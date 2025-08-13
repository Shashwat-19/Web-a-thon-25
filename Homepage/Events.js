
let selectedEventId = null;
let filteredEvents = [...events];

function initializeEventsPage() {
  renderEvents();
  setupEventFilters();
  setupModals();
  setupEventCreation();
}


function renderEvents(eventsToRender = filteredEvents) {
  const eventsGrid = document.getElementById("events-grid");

  if (eventsToRender.length === 0) {
    eventsGrid.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <h3>No events found</h3>
                <p>Try adjusting your filters or create a new event.</p>
                <button class="btn btn-primary" onclick="openCreateEventModal()">
                    <i class="fas fa-plus"></i>
                    Create Event
                </button>
            </div>
        `;
    return;
  }

  eventsGrid.innerHTML = eventsToRender
    .map(
      (event) => `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-image">
                <img src="${
                  event.image ||
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
                }" alt="${event.title}">
                <div class="event-category">${formatCategory(
                  event.category
                )}</div>
                <div class="event-status ${event.status}">${event.status}</div>
            </div>
            <div class="event-content">
                <div class="event-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(event.date)} at ${formatTime(event.time)}
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.location}
                </div>
                <div class="event-organizer">
                    <i class="fas fa-user"></i>
                    Organized by ${event.organizer}
                </div>
                <div class="event-participants">
                    <div class="participants-info">
                        <span class="participants-count">${
                          event.currentParticipants
                        }/${event.maxParticipants}</span>
                        <span class="participants-label">participants</span>
                    </div>
                    <div class="participants-bar">
                        <div class="participants-progress" style="width: ${
                          (event.currentParticipants / event.maxParticipants) *
                          100
                        }%"></div>
                    </div>
                </div>
                <div class="event-actions">
                    ${
                      event.status === "upcoming"
                        ? `
                        <button class="btn btn-primary" onclick="openRegistrationModal('${event.id}')">
                            <i class="fas fa-user-plus"></i>
                            Register
                        </button>
                    `
                        : event.status === "completed"
                        ? `
                        <button class="btn btn-secondary" onclick="openFeedbackModal('${event.id}')">
                            <i class="fas fa-comment"></i>
                            Feedback
                        </button>
                    `
                        : ""
                    }
                    <button class="btn btn-outline" onclick="shareEvent('${
                      event.id
                    }')">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Setup Event Filters
function setupEventFilters() {
  const categoryFilter = document.getElementById("category-filter");
  const dateFilter = document.getElementById("date-filter");

  categoryFilter.addEventListener("change", filterEvents);
  dateFilter.addEventListener("change", filterEvents);
}

// Filter Events
function filterEvents() {
  const categoryFilter = document.getElementById("category-filter").value;
  const dateFilter = document.getElementById("date-filter").value;

  filteredEvents = events.filter((event) => {
    const matchesCategory =
      !categoryFilter || event.category === categoryFilter;
    const matchesDate = !dateFilter || checkDateFilter(event, dateFilter);

    return matchesCategory && matchesDate;
  });

  renderEvents(filteredEvents);
}

// Check Date Filter
function checkDateFilter(event, filter) {
  const eventDate = new Date(event.date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthFromNow = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  switch (filter) {
    case "upcoming":
      return eventDate >= today;
    case "this-week":
      return eventDate >= today && eventDate <= weekFromNow;
    case "this-month":
      return eventDate >= today && eventDate <= monthFromNow;
    default:
      return true;
  }
}

// Setup Modals
function setupModals() {
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".modal .close");

  // Close modal when clicking the X
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.closest(".modal").style.display = "none";
    });
  });

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Setup cancel buttons
  document
    .getElementById("cancel-registration")
    .addEventListener("click", () => {
      document.getElementById("registration-modal").style.display = "none";
    });

  document.getElementById("cancel-create").addEventListener("click", () => {
    document.getElementById("create-event-modal").style.display = "none";
  });

  document.getElementById("cancel-feedback").addEventListener("click", () => {
    document.getElementById("feedback-modal").style.display = "none";
  });
}

// Open Registration Modal
function openRegistrationModal(eventId) {
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  selectedEventId = eventId;

  const eventDetails = document.getElementById("event-details");
  eventDetails.innerHTML = `
        <div class="modal-event-info">
            <img src="${
              event.image ||
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
            }" alt="${event.title}">
            <div class="event-info">
                <h3>${event.title}</h3>
                <p><i class="fas fa-calendar"></i> ${formatDate(
                  event.date
                )} at ${formatTime(event.time)}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-users"></i> ${event.currentParticipants}/${
    event.maxParticipants
  } participants</p>
            </div>
        </div>
    `;

  document.getElementById("registration-modal").style.display = "block";
}

// Open Create Event Modal
function openCreateEventModal() {
  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("event-date").min = today;

  document.getElementById("create-event-modal").style.display = "block";
}

// Open Feedback Modal
function openFeedbackModal(eventId) {
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  selectedEventId = eventId;

  const eventDetails = document.getElementById("feedback-event-details");
  eventDetails.innerHTML = `
        <div class="modal-event-info">
            <img src="${
              event.image ||
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
            }" alt="${event.title}">
            <div class="event-info">
                <h3>${event.title}</h3>
                <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            </div>
        </div>
    `;

  document.getElementById("feedback-modal").style.display = "block";
}

// Setup Event Creation
function setupEventCreation() {
  const createEventBtn = document.getElementById("create-event-btn");
  const createEventForm = document.getElementById("create-event-form");
  const registrationForm = document.getElementById("registration-form");
  const feedbackForm = document.getElementById("feedback-form");

  createEventBtn.addEventListener("click", openCreateEventModal);

  createEventForm.addEventListener("submit", handleEventCreation);
  registrationForm.addEventListener("submit", handleRegistration);
  feedbackForm.addEventListener("submit", handleFeedback);
}

// Handle Event Creation
function handleEventCreation(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const newEvent = {
    id: generateId(),
    title: document.getElementById("event-title").value,
    description: document.getElementById("event-description").value,
    date: document.getElementById("event-date").value,
    time: document.getElementById("event-time").value,
    location: document.getElementById("event-location").value,
    category: document.getElementById("event-category").value,
    maxParticipants: parseInt(
      document.getElementById("max-participants").value
    ),
    organizer: document.getElementById("event-organizer").value,
    currentParticipants: 0,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  };

  events.push(newEvent);
  saveToLocalStorage("events", events);
  filteredEvents = [...events];

  renderEvents();
  document.getElementById("create-event-modal").style.display = "none";
  document.getElementById("create-event-form").reset();

  showNotification("Event created successfully!", "success");
}

// Handle Registration
function handleRegistration(e) {
  e.preventDefault();

  const event = events.find((e) => e.id === selectedEventId);
  if (!event) return;

  if (event.currentParticipants >= event.maxParticipants) {
    showNotification("Sorry, this event is full!", "error");
    return;
  }

  const registration = {
    id: generateId(),
    eventId: selectedEventId,
    name: document.getElementById("participant-name").value,
    email: document.getElementById("participant-email").value,
    phone: document.getElementById("participant-phone").value,
    emergencyContact: document.getElementById("emergency-contact").value,
    dietaryRequirements: document.getElementById("dietary-requirements").value,
    registeredAt: new Date().toISOString(),
  };

  // Save registration
  const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  registrations.push(registration);
  saveToLocalStorage("registrations", registrations);

  // Update event participant count
  event.currentParticipants++;
  saveToLocalStorage("events", events);

  renderEvents();
  document.getElementById("registration-modal").style.display = "none";
  document.getElementById("registration-form").reset();

  showNotification(
    "Registration successful! Check your email for details.",
    "success"
  );
}

// Handle Feedback
function handleFeedback(e) {
  e.preventDefault();

  const rating = document.querySelector('input[name="rating"]:checked')?.value;
  const comments = document.getElementById("feedback-comments").value;
  const photos = document.getElementById("feedback-photos").files;

  if (!rating) {
    showNotification("Please provide a rating!", "error");
    return;
  }

  const feedback = {
    id: generateId(),
    eventId: selectedEventId,
    rating: parseInt(rating),
    comments: comments,
    photoCount: photos.length,
    submittedAt: new Date().toISOString(),
  };

  // Save feedback
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push(feedback);
  saveToLocalStorage("feedbacks", feedbacks);

  document.getElementById("feedback-modal").style.display = "none";
  document.getElementById("feedback-form").reset();

  showNotification("Thank you for your feedback!", "success");
}

// Share Event
function shareEvent(eventId) {
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  if (navigator.share) {
    navigator.share({
      title: event.title,
      text: event.description,
      url: window.location.href,
    });
  } else {
    // Fallback - copy to clipboard
    const shareText = `Check out this event: ${event.title} - ${event.description}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showNotification("Event details copied to clipboard!", "success");
    });
  }
}

// Utility Functions
function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeEventsPage();
});

// Add event-specific styles
const eventStyles = document.createElement("style");
eventStyles.textContent = `
    .page-header {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        color: var(--white-color);
        padding: calc(70px + var(--spacing-12)) 0 var(--spacing-12) 0;
        text-align: center;
    }
    
    .page-title {
        font-size: var(--font-size-4xl);
        font-weight: 700;
        margin-bottom: var(--spacing-4);
    }
    
    .page-description {
        font-size: var(--font-size-lg);
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .event-filters {
        padding: var(--spacing-8) 0;
        background-color: var(--gray-100);
    }
    
    .filter-bar {
        display: flex;
        gap: var(--spacing-6);
        align-items: end;
        flex-wrap: wrap;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }
    
    .filter-group label {
        font-weight: 600;
        color: var(--gray-700);
    }
    
    .filter-select {
        padding: var(--spacing-3) var(--spacing-4);
        border: 1px solid var(--gray-300);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        min-width: 150px;
    }
    
    .events-section {
        padding: var(--spacing-12) 0;
    }
    
    .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: var(--spacing-8);
    }
    
    .event-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .event-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
    }
    
    .event-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .event-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .event-category {
        position: absolute;
        top: var(--spacing-3);
        left: var(--spacing-3);
        background-color: var(--primary-color);
        color: var(--white-color);
        padding: var(--spacing-1) var(--spacing-3);
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-sm);
        font-weight: 600;
    }
    
    .event-status {
        position: absolute;
        top: var(--spacing-3);
        right: var(--spacing-3);
        padding: var(--spacing-1) var(--spacing-3);
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-sm);
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .event-status.upcoming {
        background-color: var(--success-color);
        color: var(--white-color);
    }
    
    .event-status.completed {
        background-color: var(--gray-500);
        color: var(--white-color);
    }
    
    .event-content {
        padding: var(--spacing-6);
    }
    
    .event-date {
        color: var(--primary-color);
        font-weight: 600;
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-3);
    }
    
    .event-date i {
        margin-right: var(--spacing-2);
    }
    
    .event-title {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--dark-color);
        margin-bottom: var(--spacing-3);
        line-height: 1.3;
    }
    
    .event-description {
        color: var(--gray-600);
        line-height: 1.6;
        margin-bottom: var(--spacing-4);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .event-location,
    .event-organizer {
        color: var(--gray-600);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-2);
    }
    
    .event-location i,
    .event-organizer i {
        margin-right: var(--spacing-2);
        color: var(--primary-color);
    }
    
    .event-participants {
        margin: var(--spacing-4) 0;
    }
    
    .participants-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-2);
    }
    
    .participants-count {
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .participants-label {
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .participants-bar {
        height: 6px;
        background-color: var(--gray-200);
        border-radius: var(--border-radius-full);
        overflow: hidden;
    }
    
    .participants-progress {
        height: 100%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: var(--border-radius-full);
        transition: width 0.3s ease;
    }
    
    .event-actions {
        display: flex;
        gap: var(--spacing-3);
        margin-top: var(--spacing-4);
    }
    
    .btn-outline {
        background-color: transparent;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        text-decoration: none;
        font-weight: 600;
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-2);
    }
    
    .btn-outline:hover {
        background-color: var(--primary-color);
        color: var(--white-color);
    }
    
    .no-events {
        text-align: center;
        padding: var(--spacing-16);
        color: var(--gray-600);
        grid-column: 1 / -1;
    }
    
    .no-events i {
        font-size: 4rem;
        color: var(--gray-400);
        margin-bottom: var(--spacing-4);
    }
    
    .no-events h3 {
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-3);
        color: var(--gray-700);
    }
    
    /* Modal Styles */
    .modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background-color: var(--white-color);
        margin: 2% auto;
        padding: 0;
        border-radius: var(--border-radius-lg);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-xl);
        animation: modalSlideIn 0.3s ease-out;
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .modal-header {
        padding: var(--spacing-6);
        border-bottom: 1px solid var(--gray-200);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h2 {
        margin: 0;
        color: var(--dark-color);
    }
    
    .close {
        color: var(--gray-500);
        font-size: var(--font-size-2xl);
        font-weight: bold;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .close:hover {
        color: var(--gray-700);
    }
    
    .modal-body {
        padding: var(--spacing-6);
    }
    
    .modal-event-info {
        display: flex;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
        padding: var(--spacing-4);
        background-color: var(--gray-100);
        border-radius: var(--border-radius);
    }
    
    .modal-event-info img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: var(--border-radius);
    }
    
    .event-info h3 {
        margin: 0 0 var(--spacing-2) 0;
        color: var(--dark-color);
    }
    
    .event-info p {
        margin: var(--spacing-1) 0;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .event-info i {
        margin-right: var(--spacing-2);
        color: var(--primary-color);
    }
    
    .form-group {
        margin-bottom: var(--spacing-4);
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-4);
    }
    
    .form-group label {
        display: block;
        margin-bottom: var(--spacing-2);
        font-weight: 600;
        color: var(--gray-700);
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: var(--spacing-3);
        border: 1px solid var(--gray-300);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    
    .form-group small {
        display: block;
        margin-top: var(--spacing-1);
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .form-actions {
        display: flex;
        gap: var(--spacing-3);
        justify-content: flex-end;
        margin-top: var(--spacing-6);
        padding-top: var(--spacing-4);
        border-top: 1px solid var(--gray-200);
    }
    
    .rating-input {
        display: flex;
        flex-direction: row-reverse;
        gap: var(--spacing-1);
    }
    
    .rating-input input[type="radio"] {
        display: none;
    }
    
    .rating-input label {
        cursor: pointer;
        font-size: var(--font-size-2xl);
        color: var(--gray-300);
        transition: color 0.3s ease;
    }
    
    .rating-input input[type="radio"]:checked ~ label,
    .rating-input label:hover,
    .rating-input label:hover ~ label {
        color: var(--secondary-color);
    }
    
    @media (max-width: 768px) {
        .filter-bar {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-group {
            width: 100%;
        }
        
        .filter-select {
            min-width: auto;
        }
        
        .events-grid {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .modal-content {
            width: 95%;
            margin: 5% auto;
        }
        
        .modal-event-info {
            flex-direction: column;
            text-align: center;
        }
        
        .form-actions {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(eventStyles);
