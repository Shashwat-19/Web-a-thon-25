// Action Tracker JavaScript

let userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
  name: "Eco Champion",
  level: 1,
  totalPoints: 0,
  totalActions: 0,
  streakDays: 0,
  badges: [],
  joinDate: new Date().toISOString(),
};

let userActions = JSON.parse(localStorage.getItem("userActions")) || [];
let availableBadges = [
  {
    id: "first-action",
    name: "First Steps",
    description: "Log your first action",
    icon: "fas fa-seedling",
    requirement: 1,
  },
  {
    id: "tree-planter",
    name: "Tree Planter",
    description: "Plant 5 trees",
    icon: "fas fa-tree",
    requirement: 5,
    actionType: "tree",
  },
  {
    id: "recycling-hero",
    name: "Recycling Hero",
    description: "Recycle 10 times",
    icon: "fas fa-recycle",
    requirement: 10,
    actionType: "recycle",
  },
  {
    id: "transport-champion",
    name: "Transport Champion",
    description: "Use public transport 15 times",
    icon: "fas fa-bus",
    requirement: 15,
    actionType: "transport",
  },
  {
    id: "energy-saver",
    name: "Energy Saver",
    description: "Save energy 20 times",
    icon: "fas fa-lightbulb",
    requirement: 20,
    actionType: "energy",
  },
  {
    id: "water-guardian",
    name: "Water Guardian",
    description: "Conserve water 25 times",
    icon: "fas fa-tint",
    requirement: 25,
    actionType: "water",
  },
  {
    id: "point-collector",
    name: "Point Collector",
    description: "Earn 500 points",
    icon: "fas fa-star",
    requirement: 500,
    type: "points",
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "7-day action streak",
    icon: "fas fa-fire",
    requirement: 7,
    type: "streak",
  },
  {
    id: "eco-warrior",
    name: "Eco Warrior",
    description: "Complete 50 actions",
    icon: "fas fa-shield-alt",
    requirement: 50,
    type: "total",
  },
];

let challenges = [
  {
    id: "weekly-tree",
    title: "Weekly Tree Challenge",
    description: "Plant 3 trees this week",
    target: 3,
    current: 0,
    actionType: "tree",
    period: "week",
    reward: 100,
    endDate: getEndOfWeek(),
  },
  {
    id: "monthly-transport",
    title: "Monthly Transport Challenge",
    description: "Use public transport 20 times this month",
    target: 20,
    current: 0,
    actionType: "transport",
    period: "month",
    reward: 200,
    endDate: getEndOfMonth(),
  },
];

// Initialize Action Tracker
function initializeActionTracker() {
  updateUserProfile();
  renderBadges();
  renderActions();
  renderLeaderboard();
  renderChallenges();
  setupTabs();
  setupModals();
  setupQuickActions();
  checkAndAwardBadges();

  // Set today's date as default
  document.getElementById("action-date").value = new Date()
    .toISOString()
    .split("T")[0];
}

// Update User Profile Display
function updateUserProfile() {
  document.getElementById("user-name").textContent = userProfile.name;
  document.getElementById("user-level").textContent = `Level ${
    userProfile.level
  } - ${getLevelName(userProfile.level)}`;
  document.getElementById("total-points").textContent =
    userProfile.totalPoints.toLocaleString();
  document.getElementById("total-actions").textContent =
    userProfile.totalActions;
  document.getElementById("streak-days").textContent = userProfile.streakDays;

  // Update progress bar
  const currentLevelPoints = getLevelPoints(userProfile.level);
  const nextLevelPoints = getLevelPoints(userProfile.level + 1);
  const progress =
    ((userProfile.totalPoints - currentLevelPoints) /
      (nextLevelPoints - currentLevelPoints)) *
    100;

  document.getElementById("progress-fill").style.width = `${Math.min(
    progress,
    100
  )}%`;
  document.getElementById("progress-text").textContent = `${
    userProfile.totalPoints - currentLevelPoints
  }/${nextLevelPoints - currentLevelPoints}`;
}

// Render Badges
function renderBadges() {
  const badgesGrid = document.getElementById("badges-grid");
  const badgesEmpty = document.getElementById("badges-empty");

  if (userProfile.badges.length === 0) {
    badgesGrid.style.display = "none";
    badgesEmpty.style.display = "block";
    return;
  }

  badgesGrid.style.display = "grid";
  badgesEmpty.style.display = "none";

  badgesGrid.innerHTML = userProfile.badges
    .map((badgeId) => {
      const badge = availableBadges.find((b) => b.id === badgeId);
      return badge
        ? `
            <div class="badge-item">
                <i class="${badge.icon}"></i>
                <span class="badge-name">${badge.name}</span>
                <span class="badge-description">${badge.description}</span>
            </div>
        `
        : "";
    })
    .join("");
}

// Render Actions
function renderActions() {
  const actionsList = document.getElementById("actions-list");
  const actionsEmpty = document.getElementById("actions-empty");

  if (userActions.length === 0) {
    actionsList.style.display = "none";
    actionsEmpty.style.display = "block";
    return;
  }

  actionsList.style.display = "block";
  actionsEmpty.style.display = "none";

  const sortedActions = [...userActions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  actionsList.innerHTML = sortedActions
    .map(
      (action) => `
        <div class="action-item">
            <div class="action-icon">
                <i class="${getActionIcon(action.type)}"></i>
            </div>
            <div class="action-content">
                <h4>${action.name}</h4>
                <p>${action.description}</p>
                <div class="action-meta">
                    <span class="action-date">${formatDate(action.date)}</span>
                    <span class="action-impact impact-${action.impact}">${
        action.impact
      } impact</span>
                    <span class="action-points">+${action.points} points</span>
                </div>
            </div>
            ${
              action.photo
                ? '<div class="action-photo"><i class="fas fa-camera"></i></div>'
                : ""
            }
        </div>
    `
    )
    .join("");
}

// Render Leaderboard
function renderLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");

  // Generate sample leaderboard data
  const leaderboard = generateLeaderboardData();

  leaderboardList.innerHTML = leaderboard
    .map(
      (user, index) => `
        <div class="leaderboard-item ${index < 3 ? "top-three" : ""} ${
        user.name === userProfile.name ? "current-user" : ""
      }">
            <div class="rank">
                ${index + 1}
                ${index === 0 ? '<i class="fas fa-crown"></i>' : ""}
            </div>
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                    <span class="user-name">${user.name}</span>
                    <span class="user-level">Level ${user.level}</span>
                </div>
            </div>
            <div class="user-stats">
                <span class="points">${user.points.toLocaleString()}</span>
                <span class="actions">${user.actions} actions</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Render Challenges
function renderChallenges() {
  const challengesGrid = document.getElementById("challenges-grid");

  challengesGrid.innerHTML = challenges
    .map((challenge) => {
      const progress = (challenge.current / challenge.target) * 100;
      const isCompleted = challenge.current >= challenge.target;

      return `
            <div class="challenge-card ${isCompleted ? "completed" : ""}">
                <div class="challenge-header">
                    <h4>${challenge.title}</h4>
                    <span class="challenge-reward">+${
                      challenge.reward
                    } pts</span>
                </div>
                <p class="challenge-description">${challenge.description}</p>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${challenge.current}/${
        challenge.target
      }</span>
                </div>
                <div class="challenge-footer">
                    <span class="challenge-deadline">Ends: ${formatDate(
                      challenge.endDate
                    )}</span>
                    ${
                      isCompleted
                        ? '<span class="challenge-status">Completed!</span>'
                        : ""
                    }
                </div>
            </div>
        `;
    })
    .join("");
}

// Setup Tabs
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`${targetTab}-tab`).classList.add("active");
    });
  });

  // Setup leaderboard filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderLeaderboard(); // In a real app, this would filter by period
    });
  });
}

// Setup Modals
function setupModals() {
  const modal = document.getElementById("log-action-modal");
  const closeBtn = modal.querySelector(".close");
  const cancelBtn = document.getElementById("cancel-log-action");
  const logActionBtn = document.getElementById("log-action-btn");
  const form = document.getElementById("log-action-form");

  logActionBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle action type change
  document.getElementById("action-type").addEventListener("change", (e) => {
    const customGroup = document.getElementById("custom-action-group");
    if (e.target.value === "custom") {
      customGroup.style.display = "block";
    } else {
      customGroup.style.display = "none";
    }
  });

  form.addEventListener("submit", handleActionSubmission);
}

// Setup Quick Actions
function setupQuickActions() {
  const quickActionBtns = document.querySelectorAll(".quick-action-btn");

  quickActionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const actionType = btn.getAttribute("data-action");
      const points = parseInt(btn.getAttribute("data-points"));

      if (actionType === "custom") {
        document.getElementById("log-action-btn").click();
      } else {
        logQuickAction(actionType, points);
      }
    });
  });
}

// Log Quick Action
function logQuickAction(actionType, points) {
  const actionNames = {
    tree: "Planted a Tree",
    recycle: "Recycled Waste",
    transport: "Used Public Transport",
    energy: "Saved Energy",
    water: "Conserved Water",
  };

  const action = {
    id: generateId(),
    type: actionType,
    name: actionNames[actionType],
    description: `Quick action: ${actionNames[actionType]}`,
    points: points,
    date: new Date().toISOString().split("T")[0],
    impact: "medium",
    photo: false,
    timestamp: new Date().toISOString(),
  };

  userActions.push(action);
  userProfile.totalActions++;
  userProfile.totalPoints += points;

  // Update challenges
  updateChallenges(actionType);

  // Check for level up
  checkLevelUp();

  // Check for new badges
  checkAndAwardBadges();

  // Save data
  saveToLocalStorage("userActions", userActions);
  saveToLocalStorage("userProfile", userProfile);

  // Update UI
  updateUserProfile();
  renderActions();
  renderChallenges();

  showNotification(
    `${actionNames[actionType]} logged! +${points} points`,
    "success"
  );
}

// Handle Action Submission
function handleActionSubmission(e) {
  e.preventDefault();

  const actionType = document.getElementById("action-type").value;
  const actionDate = document.getElementById("action-date").value;
  const actionDescription = document.getElementById("action-description").value;
  const actionImpact = document.getElementById("action-impact").value;
  const actionPhoto = document.getElementById("action-photo").files.length > 0;

  let actionName, basePoints;

  if (actionType === "custom") {
    actionName = document.getElementById("custom-action-name").value;
    basePoints = 10;
  } else {
    const option = document.querySelector(
      `#action-type option[value="${actionType}"]`
    );
    actionName = option.textContent.split(" (+")[0];
    basePoints = parseInt(option.getAttribute("data-points"));
  }

  // Calculate points based on impact and photo
  let totalPoints = basePoints;
  if (actionImpact === "high") totalPoints = Math.round(totalPoints * 1.5);
  else if (actionImpact === "low") totalPoints = Math.round(totalPoints * 0.8);
  if (actionPhoto) totalPoints += 5; // Bonus for photo

  const action = {
    id: generateId(),
    type: actionType,
    name: actionName,
    description: actionDescription,
    points: totalPoints,
    date: actionDate,
    impact: actionImpact,
    photo: actionPhoto,
    timestamp: new Date().toISOString(),
  };

  userActions.push(action);
  userProfile.totalActions++;
  userProfile.totalPoints += totalPoints;

  // Update challenges
  updateChallenges(actionType);

  // Check for level up
  checkLevelUp();

  // Check for new badges
  checkAndAwardBadges();

  // Save data
  saveToLocalStorage("userActions", userActions);
  saveToLocalStorage("userProfile", userProfile);

  // Update UI
  updateUserProfile();
  renderActions();
  renderChallenges();

  // Close modal and reset form
  document.getElementById("log-action-modal").style.display = "none";
  document.getElementById("log-action-form").reset();

  showNotification(
    `Action logged successfully! +${totalPoints} points`,
    "success"
  );
}

// Update Challenges
function updateChallenges(actionType) {
  challenges.forEach((challenge) => {
    if (
      challenge.actionType === actionType &&
      challenge.current < challenge.target
    ) {
      challenge.current++;
      if (challenge.current >= challenge.target) {
        userProfile.totalPoints += challenge.reward;
        showNotification(
          `Challenge completed! +${challenge.reward} bonus points`,
          "success"
        );
      }
    }
  });

  localStorage.setItem("challenges", JSON.stringify(challenges));
}

// Check Level Up
function checkLevelUp() {
  const newLevel = calculateLevel(userProfile.totalPoints);
  if (newLevel > userProfile.level) {
    userProfile.level = newLevel;
    showNotification(`Level up! You're now Level ${newLevel}`, "success");
  }
}

// Check and Award Badges
function checkAndAwardBadges() {
  availableBadges.forEach((badge) => {
    if (userProfile.badges.includes(badge.id)) return;

    let earned = false;

    switch (badge.type) {
      case "points":
        earned = userProfile.totalPoints >= badge.requirement;
        break;
      case "total":
        earned = userProfile.totalActions >= badge.requirement;
        break;
      case "streak":
        earned = userProfile.streakDays >= badge.requirement;
        break;
      default:
        if (badge.actionType) {
          const actionCount = userActions.filter(
            (a) => a.type === badge.actionType
          ).length;
          earned = actionCount >= badge.requirement;
        } else {
          earned = userProfile.totalActions >= badge.requirement;
        }
    }

    if (earned) {
      userProfile.badges.push(badge.id);
      showNotification(`New badge earned: ${badge.name}!`, "success");
    }
  });

  renderBadges();
}

// Utility Functions
function getLevelName(level) {
  const levelNames = {
    1: "Beginner",
    2: "Novice",
    3: "Apprentice",
    4: "Practitioner",
    5: "Expert",
    6: "Master",
    7: "Champion",
    8: "Hero",
    9: "Legend",
    10: "Eco Warrior",
  };
  return levelNames[Math.min(level, 10)] || "Eco Warrior";
}

function getLevelPoints(level) {
  return Math.pow(level, 2) * 100;
}

function calculateLevel(points) {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

function getActionIcon(actionType) {
  const icons = {
    tree: "fas fa-tree",
    recycle: "fas fa-recycle",
    transport: "fas fa-bus",
    energy: "fas fa-lightbulb",
    water: "fas fa-tint",
    bike: "fas fa-bicycle",
    compost: "fas fa-seedling",
    cleanup: "fas fa-broom",
    custom: "fas fa-star",
  };
  return icons[actionType] || "fas fa-leaf";
}

function generateLeaderboardData() {
  const sampleUsers = [
    { name: "EcoMaster2024", level: 8, points: 2450, actions: 98 },
    { name: "GreenThumb", level: 7, points: 2100, actions: 84 },
    { name: "TreeHugger", level: 6, points: 1800, actions: 72 },
    {
      name: userProfile.name,
      level: userProfile.level,
      points: userProfile.totalPoints,
      actions: userProfile.totalActions,
    },
    { name: "EcoWarrior", level: 5, points: 1200, actions: 48 },
    { name: "PlanetSaver", level: 4, points: 950, actions: 38 },
    { name: "GreenGuru", level: 4, points: 800, actions: 32 },
  ];

  return sampleUsers.sort((a, b) => b.points - a.points);
}

function getEndOfWeek() {
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  return endOfWeek.toISOString().split("T")[0];
}

function getEndOfMonth() {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return endOfMonth.toISOString().split("T")[0];
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeActionTracker();
});

// Add action tracker specific styles
const actionTrackerStyles = document.createElement("style");
actionTrackerStyles.textContent = `
    .user-dashboard {
        padding: var(--spacing-8) 0;
        background-color: var(--gray-100);
    }
    
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: var(--spacing-8);
    }
    
    .user-profile-card,
    .quick-actions-card,
    .badges-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
    }
    
    .profile-avatar {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        font-size: var(--font-size-xl);
    }
    
    .profile-info h3 {
        margin: 0;
        color: var(--dark-color);
        font-size: var(--font-size-xl);
    }
    
    .profile-info p {
        margin: var(--spacing-1) 0 0 0;
        color: var(--gray-600);
    }
    
    .profile-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-number {
        display: block;
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--primary-color);
    }
    
    .stat-label {
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .level-progress {
        margin-top: var(--spacing-4);
    }
    
    .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--spacing-2);
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .progress-bar {
        height: 8px;
        background-color: var(--gray-200);
        border-radius: var(--border-radius-full);
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: var(--border-radius-full);
        transition: width 0.3s ease;
    }
    
    .quick-actions-card h3,
    .badges-card h3 {
        margin: 0 0 var(--spacing-4) 0;
        color: var(--dark-color);
    }
    
    .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-3);
    }
    
    .quick-action-btn {
        background-color: var(--gray-50);
        border: 1px solid var(--gray-200);
        border-radius: var(--border-radius);
        padding: var(--spacing-4);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-2);
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .quick-action-btn:hover {
        background-color: var(--primary-color);
        color: var(--white-color);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .quick-action-btn i {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-2);
    }
    
    .quick-action-btn span {
        font-weight: 600;
    }
    
    .quick-action-btn small {
        font-size: var(--font-size-xs);
        opacity: 0.8;
    }
    
    .badges-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-3);
    }
    
    .badge-item {
        background-color: var(--gray-50);
        border-radius: var(--border-radius);
        padding: var(--spacing-4);
        text-align: center;
        border: 2px solid var(--secondary-color);
    }
    
    .badge-item i {
        font-size: var(--font-size-2xl);
        color: var(--secondary-color);
        margin-bottom: var(--spacing-2);
    }
    
    .badge-name {
        display: block;
        font-weight: 600;
        color: var(--dark-color);
        margin-bottom: var(--spacing-1);
    }
    
    .badge-description {
        font-size: var(--font-size-xs);
        color: var(--gray-600);
    }
    
    .badges-empty {
        text-align: center;
        padding: var(--spacing-8);
        color: var(--gray-500);
    }
    
    .badges-empty i {
        font-size: 3rem;
        margin-bottom: var(--spacing-3);
    }
    
    .content-section {
        padding: var(--spacing-12) 0;
    }
    
    .content-tabs {
        display: flex;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-8);
        border-bottom: 1px solid var(--gray-200);
    }
    
    .tab-btn {
        background: none;
        border: none;
        padding: var(--spacing-4) var(--spacing-6);
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--gray-600);
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .tab-btn.active,
    .tab-btn:hover {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
    }
    
    .tab-content {
        display: none;
    }
    
    .tab-content.active {
        display: block;
    }
    
    .actions-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
    }
    
    .actions-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }
    
    .action-item {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-4);
    }
    
    .action-icon {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        font-size: var(--font-size-lg);
        flex-shrink: 0;
    }
    
    .action-content {
        flex: 1;
    }
    
    .action-content h4 {
        margin: 0 0 var(--spacing-2) 0;
        color: var(--dark-color);
    }
    
    .action-content p {
        margin: 0 0 var(--spacing-3) 0;
        color: var(--gray-600);
        line-height: 1.5;
    }
    
    .action-meta {
        display: flex;
        gap: var(--spacing-4);
        font-size: var(--font-size-sm);
    }
    
    .action-date {
        color: var(--gray-500);
    }
    
    .action-impact {
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .impact-low { background-color: var(--warning-color); color: var(--white-color); }
    .impact-medium { background-color: var(--accent-color); color: var(--white-color); }
    .impact-high { background-color: var(--success-color); color: var(--white-color); }
    
    .action-points {
        color: var(--primary-color);
        font-weight: 600;
    }
    
    .action-photo {
        color: var(--gray-400);
        font-size: var(--font-size-lg);
    }
    
    .actions-empty {
        text-align: center;
        padding: var(--spacing-16);
        color: var(--gray-500);
    }
    
    .actions-empty i {
        font-size: 4rem;
        margin-bottom: var(--spacing-4);
    }
    
    .leaderboard-filters {
        display: flex;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-6);
    }
    
    .filter-btn {
        background-color: var(--gray-100);
        border: none;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn.active,
    .filter-btn:hover {
        background-color: var(--primary-color);
        color: var(--white-color);
    }
    
    .leaderboard-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }
    
    .leaderboard-item {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-4);
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
    }
    
    .leaderboard-item.top-three {
        background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
        border: 2px solid var(--primary-color);
    }
    
    .leaderboard-item.current-user {
        border: 2px solid var(--accent-color);
        background-color: rgba(30, 136, 229, 0.05);
    }
    
    .rank {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--primary-color);
        min-width: 40px;
        text-align: center;
        position: relative;
    }
    
    .rank i {
        position: absolute;
        top: -5px;
        right: -5px;
        color: var(--secondary-color);
        font-size: var(--font-size-sm);
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        flex: 1;
    }
    
    .user-avatar {
        width: 40px;
        height: 40px;
        background-color: var(--gray-300);
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gray-600);
    }
    
    .user-details {
        display: flex;
        flex-direction: column;
    }
    
    .user-name {
        font-weight: 600;
        color: var(--dark-color);
    }
    
    .user-level {
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .user-stats {
        text-align: right;
    }
    
    .points {
        display: block;
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--primary-color);
    }
    
    .actions {
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .challenges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-6);
    }
    
    .challenge-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
        border-left: 4px solid var(--primary-color);
    }
    
    .challenge-card.completed {
        border-left-color: var(--success-color);
        background-color: rgba(76, 175, 80, 0.05);
    }
    
    .challenge-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-3);
    }
    
    .challenge-header h4 {
        margin: 0;
        color: var(--dark-color);
    }
    
    .challenge-reward {
        background-color: var(--secondary-color);
        color: var(--white-color);
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
        font-size: var(--font-size-sm);
        font-weight: 600;
    }
    
    .challenge-description {
        color: var(--gray-600);
        margin-bottom: var(--spacing-4);
    }
    
    .challenge-progress {
        margin-bottom: var(--spacing-4);
    }
    
    .challenge-progress .progress-bar {
        height: 8px;
        background-color: var(--gray-200);
        border-radius: var(--border-radius-full);
        overflow: hidden;
        margin-bottom: var(--spacing-2);
    }
    
    .challenge-progress .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: var(--border-radius-full);
        transition: width 0.3s ease;
    }
    
    .challenge-progress .progress-text {
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .challenge-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--font-size-sm);
    }
    
    .challenge-deadline {
        color: var(--gray-600);
    }
    
    .challenge-status {
        color: var(--success-color);
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
        
        .profile-stats {
            grid-template-columns: repeat(3, 1fr);
        }
        
        .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .badges-grid {
            grid-template-columns: 1fr;
        }
        
        .content-tabs {
            flex-wrap: wrap;
        }
        
        .actions-header {
            flex-direction: column;
            gap: var(--spacing-4);
            align-items: stretch;
        }
        
        .action-item {
            flex-direction: column;
            text-align: center;
        }
        
        .action-meta {
            justify-content: center;
        }
        
        .leaderboard-item {
            flex-wrap: wrap;
        }
        
        .challenges-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(actionTrackerStyles);
