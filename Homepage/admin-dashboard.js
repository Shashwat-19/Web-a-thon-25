// Admin Dashboard JavaScript

let currentTab = "overview";

// Initialize Admin Dashboard
function initializeAdminDashboard() {
  setupTabs();
  loadOverviewData();
  loadEventsData();
  loadBusinessesData();
  loadForumData();
  loadUsersData();
  setupSearch();
  updateStats();
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

      currentTab = targetTab;
    });
  });
}

// Update Stats
function updateStats() {
  // These would typically come from an API
  const stats = {
    totalUsers: 1247,
    totalEvents: 45,
    totalBusinesses: 128,
    totalPosts: 342,
  };

  document.getElementById("total-users").textContent =
    stats.totalUsers.toLocaleString();
  document.getElementById("total-events").textContent = stats.totalEvents;
  document.getElementById("total-businesses").textContent =
    stats.totalBusinesses;
  document.getElementById("total-posts").textContent = stats.totalPosts;
}

// Load Overview Data
function loadOverviewData() {
  const activityList = document.getElementById("activity-list");

  const recentActivity = [
    {
      type: "user",
      action: "New user registered",
      details: "EcoWarrior joined the community",
      time: "5 minutes ago",
      icon: "fas fa-user-plus",
      color: "success",
    },
    {
      type: "event",
      action: "Event created",
      details: "Beach Cleanup Campaign scheduled",
      time: "15 minutes ago",
      icon: "fas fa-calendar-plus",
      color: "primary",
    },
    {
      type: "business",
      action: "Business submitted",
      details: "Green Energy Solutions pending review",
      time: "1 hour ago",
      icon: "fas fa-store",
      color: "warning",
    },
    {
      type: "forum",
      action: "New discussion",
      details: "How to reduce water consumption at home?",
      time: "2 hours ago",
      icon: "fas fa-comments",
      color: "info",
    },
    {
      type: "action",
      action: "Sustainability action",
      details: "50 trees planted this week",
      time: "3 hours ago",
      icon: "fas fa-tree",
      color: "success",
    },
  ];

  activityList.innerHTML = recentActivity
    .map(
      (activity) => `
        <div class="activity-item">
            <div class="activity-icon ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.action}</h4>
                <p>${activity.details}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Load Events Data
function loadEventsData() {
  const eventsTable = document
    .getElementById("events-table")
    .getElementsByTagName("tbody")[0];

  // Sample events data - would typically come from API
  const eventsData = [
    {
      id: "1",
      title: "Community Tree Plantation",
      organizer: "Green City Initiative",
      date: "2024-02-15",
      participants: "67/100",
      status: "approved",
    },
    {
      id: "2",
      title: "Beach Cleanup Campaign",
      organizer: "Ocean Guardians",
      date: "2024-02-20",
      participants: "89/150",
      status: "pending",
    },
    {
      id: "3",
      title: "Recycling Workshop",
      organizer: "Waste Warriors",
      date: "2024-02-25",
      participants: "23/50",
      status: "approved",
    },
  ];

  eventsTable.innerHTML = eventsData
    .map(
      (event) => `
        <tr>
            <td>
                <div class="item-info">
                    <h4>${event.title}</h4>
                </div>
            </td>
            <td>${event.organizer}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.participants}</td>
            <td>
                <span class="status-badge ${event.status}">${
        event.status
      }</span>
            </td>
            <td>
                <div class="action-buttons">
                    ${
                      event.status === "pending"
                        ? `
                        <button class="btn-action approve" onclick="approveEvent('${event.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-action reject" onclick="rejectEvent('${event.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    `
                        : ""
                    }
                    <button class="btn-action view" onclick="viewEvent('${
                      event.id
                    }')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Load Businesses Data
function loadBusinessesData() {
  const businessesTable = document
    .getElementById("businesses-table")
    .getElementsByTagName("tbody")[0];

  // Sample businesses data
  const businessesData = [
    {
      id: "1",
      name: "Green Grocers Organic Market",
      category: "Organic Food",
      contact: "info@greengrocers.com",
      rating: "4.8",
      status: "verified",
    },
    {
      id: "2",
      name: "Solar Solutions Pro",
      category: "Renewable Energy",
      contact: "contact@solarsolutions.com",
      rating: "4.9",
      status: "verified",
    },
    {
      id: "3",
      name: "EcoWrap Packaging Co.",
      category: "Eco Packaging",
      contact: "hello@ecowrap.com",
      rating: "4.7",
      status: "pending",
    },
  ];

  businessesTable.innerHTML = businessesData
    .map(
      (business) => `
        <tr>
            <td>
                <div class="item-info">
                    <h4>${business.name}</h4>
                </div>
            </td>
            <td>${business.category}</td>
            <td>${business.contact}</td>
            <td>
                <div class="rating">
                    <span class="stars">${renderStars(
                      parseFloat(business.rating)
                    )}</span>
                    <span>${business.rating}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${business.status}">${
        business.status
      }</span>
            </td>
            <td>
                <div class="action-buttons">
                    ${
                      business.status === "pending"
                        ? `
                        <button class="btn-action approve" onclick="approveBusiness('${business.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-action reject" onclick="rejectBusiness('${business.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    `
                        : ""
                    }
                    <button class="btn-action view" onclick="viewBusiness('${
                      business.id
                    }')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Load Forum Data
function loadForumData() {
  const forumTable = document
    .getElementById("forum-table")
    .getElementsByTagName("tbody")[0];

  // Sample forum data
  const forumData = [
    {
      id: "1",
      title: "How to reduce energy consumption at home?",
      author: "EcoEnthusiast",
      category: "Energy",
      replies: 8,
      votes: 13,
      status: "approved",
    },
    {
      id: "2",
      title: "Public transport vs. electric vehicles",
      author: "CommuteCurious",
      category: "Transport",
      replies: 5,
      votes: 18,
      status: "approved",
    },
    {
      id: "3",
      title: "Best practices for water conservation",
      author: "WaterWise",
      category: "Water",
      replies: 3,
      votes: 7,
      status: "flagged",
    },
  ];

  forumTable.innerHTML = forumData
    .map(
      (post) => `
        <tr>
            <td>
                <div class="item-info">
                    <h4>${post.title}</h4>
                </div>
            </td>
            <td>${post.author}</td>
            <td>
                <span class="category-tag ${post.category.toLowerCase()}">${
        post.category
      }</span>
            </td>
            <td>${post.replies}</td>
            <td>${post.votes}</td>
            <td>
                <span class="status-badge ${post.status}">${post.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    ${
                      post.status === "flagged"
                        ? `
                        <button class="btn-action approve" onclick="approvePost('${post.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-action reject" onclick="hidePost('${post.id}')">
                            <i class="fas fa-eye-slash"></i>
                        </button>
                    `
                        : ""
                    }
                    <button class="btn-action view" onclick="viewPost('${
                      post.id
                    }')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Load Users Data
function loadUsersData() {
  const usersTable = document
    .getElementById("users-table")
    .getElementsByTagName("tbody")[0];

  // Sample users data
  const usersData = [
    {
      id: "1",
      name: "EcoMaster2024",
      email: "ecomaster@email.com",
      joinDate: "2024-01-15",
      points: 2450,
      level: 8,
      status: "active",
    },
    {
      id: "2",
      name: "GreenThumb",
      email: "greenthumb@email.com",
      joinDate: "2024-01-20",
      points: 2100,
      level: 7,
      status: "active",
    },
    {
      id: "3",
      name: "TreeHugger",
      email: "treehugger@email.com",
      joinDate: "2024-02-01",
      points: 1800,
      level: 6,
      status: "active",
    },
  ];

  usersTable.innerHTML = usersData
    .map(
      (user) => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span>${user.name}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${formatDate(user.joinDate)}</td>
            <td>${user.points.toLocaleString()}</td>
            <td>${user.level}</td>
            <td>
                <span class="status-badge ${user.status}">${user.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action view" onclick="viewUser('${
                      user.id
                    }')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action edit" onclick="editUser('${
                      user.id
                    }')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Setup Search
function setupSearch() {
  const userSearch = document.getElementById("user-search");

  if (userSearch) {
    let searchTimeout;
    userSearch.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        // Filter users based on search term
        // This would typically make an API call
        console.log("Searching users:", userSearch.value);
      }, 300);
    });
  }
}

// Action Handlers
function approveEvent(eventId) {
  showNotification("Event approved successfully!", "success");
  // Update the UI and make API call
}

function rejectEvent(eventId) {
  showNotification("Event rejected.", "error");
  // Update the UI and make API call
}

function viewEvent(eventId) {
  showNotification("Opening event details...", "info");
  // Navigate to event details
}

function approveBusiness(businessId) {
  showNotification("Business approved and verified!", "success");
  // Update the UI and make API call
}

function rejectBusiness(businessId) {
  showNotification("Business application rejected.", "error");
  // Update the UI and make API call
}

function viewBusiness(businessId) {
  showNotification("Opening business details...", "info");
  // Navigate to business details
}

function approvePost(postId) {
  showNotification("Post approved and published!", "success");
  // Update the UI and make API call
}

function hidePost(postId) {
  showNotification("Post hidden from public view.", "warning");
  // Update the UI and make API call
}

function viewPost(postId) {
  showNotification("Opening post details...", "info");
  // Navigate to post details
}

function viewUser(userId) {
  showNotification("Opening user profile...", "info");
  // Navigate to user profile
}

function editUser(userId) {
  showNotification("Opening user editor...", "info");
  // Open user edit modal
}

// Utility Functions
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
  );
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeAdminDashboard();
});

// Add admin dashboard specific styles
const adminStyles = document.createElement("style");
adminStyles.textContent = `
    .admin-header {
        background: linear-gradient(135deg, var(--dark-color) 0%, var(--gray-800) 100%);
    }
    
    .dashboard-stats {
        padding: var(--spacing-8) 0;
        background-color: var(--gray-100);
        margin-top: -50px;
        position: relative;
        z-index: 1;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-6);
    }
    
    .stat-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
    }
    
    .stat-icon {
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
    
    .stat-content h3 {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--primary-color);
        margin: 0 0 var(--spacing-1) 0;
    }
    
    .stat-content p {
        margin: 0 0 var(--spacing-2) 0;
        color: var(--gray-600);
        font-weight: 500;
    }
    
    .stat-change {
        font-size: var(--font-size-sm);
        font-weight: 600;
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
    }
    
    .stat-change.positive {
        background-color: rgba(76, 175, 80, 0.1);
        color: var(--success-color);
    }
    
    .admin-content {
        padding: var(--spacing-12) 0;
    }
    
    .admin-tabs {
        display: flex;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-8);
        border-bottom: 1px solid var(--gray-200);
        overflow-x: auto;
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
        white-space: nowrap;
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
    
    .overview-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--spacing-8);
    }
    
    .recent-activity,
    .pending-approvals {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
    }
    
    .recent-activity h3,
    .pending-approvals h3 {
        margin: 0 0 var(--spacing-6) 0;
        color: var(--dark-color);
    }
    
    .activity-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }
    
    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
        background-color: var(--gray-50);
        border-radius: var(--border-radius);
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        flex-shrink: 0;
    }
    
    .activity-icon.success { background-color: var(--success-color); }
    .activity-icon.primary { background-color: var(--primary-color); }
    .activity-icon.warning { background-color: var(--warning-color); }
    .activity-icon.info { background-color: var(--accent-color); }
    
    .activity-content h4 {
        margin: 0 0 var(--spacing-1) 0;
        color: var(--dark-color);
        font-size: var(--font-size-base);
    }
    
    .activity-content p {
        margin: 0 0 var(--spacing-1) 0;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .activity-time {
        color: var(--gray-500);
        font-size: var(--font-size-xs);
    }
    
    .approval-summary {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }
    
    .approval-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-4);
        background-color: var(--gray-50);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--warning-color);
    }
    
    .approval-count {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--warning-color);
    }
    
    .approval-type {
        color: var(--gray-700);
        font-weight: 500;
    }
    
    .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
    }
    
    .tab-header h3 {
        margin: 0;
        color: var(--dark-color);
    }
    
    .tab-filters {
        display: flex;
        gap: var(--spacing-2);
    }
    
    .filter-btn {
        background-color: var(--gray-100);
        border: none;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--gray-700);
        font-size: var(--font-size-sm);
    }
    
    .filter-btn.active,
    .filter-btn:hover {
        background-color: var(--primary-color);
        color: var(--white-color);
    }
    
    .search-bar {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .search-bar input {
        padding: var(--spacing-3) var(--spacing-10) var(--spacing-3) var(--spacing-4);
        border: 1px solid var(--gray-300);
        border-radius: var(--border-radius);
        min-width: 300px;
    }
    
    .search-bar i {
        position: absolute;
        right: var(--spacing-4);
        color: var(--gray-500);
    }
    
    .admin-table {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
        overflow: hidden;
    }
    
    .admin-table table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .admin-table th {
        background-color: var(--gray-100);
        padding: var(--spacing-4) var(--spacing-6);
        text-align: left;
        font-weight: 600;
        color: var(--gray-700);
        border-bottom: 1px solid var(--gray-200);
    }
    
    .admin-table td {
        padding: var(--spacing-4) var(--spacing-6);
        border-bottom: 1px solid var(--gray-100);
        vertical-align: middle;
    }
    
    .admin-table tr:hover {
        background-color: var(--gray-50);
    }
    
    .item-info h4 {
        margin: 0;
        color: var(--dark-color);
        font-size: var(--font-size-base);
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
    }
    
    .user-avatar {
        width: 32px;
        height: 32px;
        background-color: var(--gray-300);
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gray-600);
    }
    
    .status-badge {
        padding: var(--spacing-1) var(--spacing-3);
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-badge.pending {
        background-color: rgba(255, 152, 0, 0.1);
        color: var(--warning-color);
    }
    
    .status-badge.approved,
    .status-badge.verified,
    .status-badge.active {
        background-color: rgba(76, 175, 80, 0.1);
        color: var(--success-color);
    }
    
    .status-badge.rejected,
    .status-badge.hidden {
        background-color: rgba(244, 67, 54, 0.1);
        color: var(--error-color);
    }
    
    .status-badge.flagged {
        background-color: rgba(255, 87, 34, 0.1);
        color: #FF5722;
    }
    
    .category-tag {
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        color: var(--white-color);
    }
    
    .category-tag.transport { background-color: #2196F3; }
    .category-tag.housing { background-color: #4CAF50; }
    .category-tag.energy { background-color: #FF9800; }
    .category-tag.water { background-color: #00BCD4; }
    
    .action-buttons {
        display: flex;
        gap: var(--spacing-2);
    }
    
    .btn-action {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
    }
    
    .btn-action.approve {
        background-color: var(--success-color);
    }
    
    .btn-action.reject {
        background-color: var(--error-color);
    }
    
    .btn-action.view {
        background-color: var(--accent-color);
    }
    
    .btn-action.edit {
        background-color: var(--warning-color);
    }
    
    .btn-action:hover {
        opacity: 0.8;
        transform: scale(1.05);
    }
    
    .rating {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }
    
    .stars {
        color: var(--secondary-color);
    }
    
    .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-8);
    }
    
    .chart-container {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
    }
    
    .chart-container h3 {
        margin: 0 0 var(--spacing-4) 0;
        color: var(--dark-color);
    }
    
    .chart-placeholder {
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--gray-500);
        text-align: center;
    }
    
    .chart-placeholder i {
        font-size: 3rem;
        margin-bottom: var(--spacing-3);
        color: var(--gray-400);
    }
    
    @media (max-width: 768px) {
        .overview-grid {
            grid-template-columns: 1fr;
        }
        
        .tab-header {
            flex-direction: column;
            gap: var(--spacing-4);
            align-items: stretch;
        }
        
        .tab-filters {
            flex-wrap: wrap;
        }
        
        .search-bar input {
            min-width: auto;
            width: 100%;
        }
        
        .admin-table {
            overflow-x: auto;
        }
        
        .admin-table table {
            min-width: 800px;
        }
        
        .analytics-grid {
            grid-template-columns: 1fr;
        }
        
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(adminStyles);
