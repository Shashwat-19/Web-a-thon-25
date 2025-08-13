

let filteredBusinesses = [...businesses];
let selectedBusinessId = null;
let currentView = "grid";

function initializeBusinessDirectory() {
  renderBusinesses();
  setupSearch();
  setupFilters();
  setupModals();
  setupViewToggle();
  updateResultsCount();
}

function renderBusinesses(businessesToRender = filteredBusinesses) {
  const businessGrid = document.getElementById("business-grid");
  businessGrid.className = `business-${currentView}`;

  if (businessesToRender.length === 0) {
    businessGrid.innerHTML = `
            <div class="no-businesses">
                <i class="fas fa-store-slash"></i>
                <h3>No businesses found</h3>
                <p>Try adjusting your search criteria or add a new business to the directory.</p>
                <button class="btn btn-primary" onclick="openAddBusinessModal()">
                    <i class="fas fa-plus"></i>
                    Add Business
                </button>
            </div>
        `;
    return;
  }

  if (currentView === "grid") {
    businessGrid.innerHTML = businessesToRender
      .map(
        (business) => `
            <div class="business-card" data-business-id="${
              business.id
            }" onclick="openBusinessModal('${business.id}')">
                <div class="business-image">
                    <img src="${business.image}" alt="${business.name}">
                    ${
                      business.verified
                        ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>'
                        : ""
                    }
                </div>
                <div class="business-content">
                    <div class="business-category">${formatCategory(
                      business.category
                    )}</div>
                    <h3 class="business-name">${business.name}</h3>
                    <p class="business-description">${business.description}</p>
                    <div class="business-rating">
                        <div class="stars">${renderStars(business.rating)}</div>
                        <span class="rating-text">${business.rating} (${
          business.reviews
        } reviews)</span>
                    </div>
                    <div class="business-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${business.address}
                    </div>
                    <div class="business-features">
                        ${business.features
                          .slice(0, 3)
                          .map(
                            (feature) =>
                              `<span class="feature-tag">${feature}</span>`
                          )
                          .join("")}
                    </div>
                    <div class="business-actions">
                        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); contactBusiness('${
                          business.id
                        }')">
                            <i class="fas fa-phone"></i>
                            Contact
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); visitWebsite('${
                          business.id
                        }')">
                            <i class="fas fa-external-link-alt"></i>
                            Website
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  } else {
    businessGrid.innerHTML = businessesToRender
      .map(
        (business) => `
            <div class="business-list-item" data-business-id="${
              business.id
            }" onclick="openBusinessModal('${business.id}')">
                <div class="business-list-image">
                    <img src="${business.image}" alt="${business.name}">
                    ${
                      business.verified
                        ? '<div class="verified-badge"><i class="fas fa-check-circle"></i></div>'
                        : ""
                    }
                </div>
                <div class="business-list-content">
                    <div class="business-list-header">
                        <div class="business-category">${formatCategory(
                          business.category
                        )}</div>
                        <div class="business-rating">
                            <div class="stars">${renderStars(
                              business.rating
                            )}</div>
                            <span class="rating-text">${business.rating} (${
          business.reviews
        })</span>
                        </div>
                    </div>
                    <h3 class="business-name">${business.name}</h3>
                    <p class="business-description">${business.description}</p>
                    <div class="business-meta">
                        <div class="business-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${business.address}
                        </div>
                        <div class="business-contact">
                            <i class="fas fa-phone"></i>
                            ${business.phone}
                        </div>
                    </div>
                    <div class="business-features">
                        ${business.features
                          .map(
                            (feature) =>
                              `<span class="feature-tag">${feature}</span>`
                          )
                          .join("")}
                    </div>
                </div>
                <div class="business-list-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); contactBusiness('${
                      business.id
                    }')">
                        <i class="fas fa-phone"></i>
                        Contact
                    </button>
                    <button class="btn btn-outline" onclick="event.stopPropagation(); visitWebsite('${
                      business.id
                    }')">
                        <i class="fas fa-external-link-alt"></i>
                        Website
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }
}

function setupSearch() {
  const searchInput = document.getElementById("business-search");
  const searchBtn = document.getElementById("search-btn");

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
      filteredBusinesses = [...businesses];
    } else {
      filteredBusinesses = businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(searchTerm) ||
          business.description.toLowerCase().includes(searchTerm) ||
          business.address.toLowerCase().includes(searchTerm) ||
          business.features.some((feature) =>
            feature.toLowerCase().includes(searchTerm)
          )
      );
    }

    applyFilters();
    renderBusinesses();
    updateResultsCount();
  }

  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
  });
}

function setupFilters() {
  const categoryFilter = document.getElementById("category-filter");
  const ratingFilter = document.getElementById("rating-filter");
  const verifiedFilter = document.getElementById("verified-filter");

  categoryFilter.addEventListener("change", applyFilters);
  ratingFilter.addEventListener("change", applyFilters);
  verifiedFilter.addEventListener("change", applyFilters);
}


function applyFilters() {
  const categoryFilter = document.getElementById("category-filter").value;
  const ratingFilter =
    parseFloat(document.getElementById("rating-filter").value) || 0;
  const verifiedFilter = document.getElementById("verified-filter").value;

  let filtered = [...filteredBusinesses];

  if (categoryFilter) {
    filtered = filtered.filter(
      (business) => business.category === categoryFilter
    );
  }

  if (ratingFilter > 0) {
    filtered = filtered.filter((business) => business.rating >= ratingFilter);
  }

  if (verifiedFilter === "verified") {
    filtered = filtered.filter((business) => business.verified);
  }

  filteredBusinesses = filtered;
  renderBusinesses();
  updateResultsCount();
}

function setupViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn");

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentView = btn.getAttribute("data-view");
      renderBusinesses();
    });
  });
}

function setupModals() {
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".modal .close");

  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.closest(".modal").style.display = "none";
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });


  document
    .getElementById("add-business-form")
    .addEventListener("submit", handleAddBusiness);
  document
    .getElementById("review-form")
    .addEventListener("submit", handleReviewSubmission);

  document
    .getElementById("cancel-add-business")
    .addEventListener("click", () => {
      document.getElementById("add-business-modal").style.display = "none";
    });

  document.getElementById("cancel-review").addEventListener("click", () => {
    document.getElementById("review-modal").style.display = "none";
  });


  document
    .getElementById("add-business-btn")
    .addEventListener("click", openAddBusinessModal);
}


function openBusinessModal(businessId) {
  const business = businesses.find((b) => b.id === businessId);
  if (!business) return;

  selectedBusinessId = businessId;

  document.getElementById("business-modal-title").textContent = business.name;

  const businessDetails = document.getElementById("business-details");
  businessDetails.innerHTML = `
        <div class="business-modal-header">
            <img src="${business.image}" alt="${
    business.name
  }" class="business-modal-image">
            <div class="business-modal-info">
                <div class="business-category">${formatCategory(
                  business.category
                )}</div>
                <h2>${business.name}</h2>
                ${
                  business.verified
                    ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified Business</div>'
                    : ""
                }
                <div class="business-rating">
                    <div class="stars">${renderStars(business.rating)}</div>
                    <span class="rating-text">${business.rating} out of 5 (${
    business.reviews
  } reviews)</span>
                </div>
            </div>
        </div>
        
        <div class="business-modal-content">
            <div class="business-description">
                <h3>About</h3>
                <p>${business.description}</p>
            </div>
            
            <div class="business-contact">
                <h3>Contact Information</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${business.address}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${business.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${business.email}</span>
                    </div>
                    ${
                      business.website
                        ? `
                        <div class="contact-item">
                            <i class="fas fa-globe"></i>
                            <a href="${business.website}" target="_blank">${business.website}</a>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
            
            <div class="business-features-section">
                <h3>Key Features</h3>
                <div class="features-grid">
                    ${business.features
                      .map(
                        (feature) =>
                          `<span class="feature-tag large">${feature}</span>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;

  loadBusinessReviews(businessId);
  document.getElementById("business-modal").style.display = "block";
}

function loadBusinessReviews(businessId) {
  const reviews = getBusinessReviews(businessId);
  const reviewsList = document.getElementById("reviews-list");

  if (reviews.length === 0) {
    reviewsList.innerHTML = `
            <div class="no-reviews">
                <p>No reviews yet. Be the first to review this business!</p>
            </div>
        `;
    return;
  }

  reviewsList.innerHTML = reviews
    .map(
      (review) => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <strong>${review.reviewerName}</strong>
                    <div class="stars">${renderStars(review.rating)}</div>
                </div>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-comment">${review.comment}</p>
        </div>
    `
    )
    .join("");

  document.getElementById("write-review-btn").onclick = () =>
    openReviewModal(businessId);
}

function openAddBusinessModal() {
  document.getElementById("add-business-modal").style.display = "block";
}

function openReviewModal(businessId) {
  const business = businesses.find((b) => b.id === businessId);
  if (!business) return;

  selectedBusinessId = businessId;

  const businessInfo = document.getElementById("review-business-info");
  businessInfo.innerHTML = `
        <div class="review-business-card">
            <img src="${business.image}" alt="${business.name}">
            <div class="business-info">
                <h3>${business.name}</h3>
                <p>${formatCategory(business.category)}</p>
            </div>
        </div>
    `;

  document.getElementById("business-modal").style.display = "none";
  document.getElementById("review-modal").style.display = "block";
}

// Handle Add Business
function handleAddBusiness(e) {
  e.preventDefault();

  const features = document
    .getElementById("business-features")
    .value.split(",")
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  const newBusiness = {
    id: generateId(),
    name: document.getElementById("business-name").value,
    description: document.getElementById("business-description").value,
    category: document.getElementById("business-category").value,
    address: document.getElementById("business-address").value,
    phone: document.getElementById("business-phone").value,
    email: document.getElementById("business-email").value,
    website: document.getElementById("business-website").value,
    image:
      document.getElementById("business-image").value ||
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    features: features,
    rating: 0,
    reviews: 0,
    verified: false,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  businesses.push(newBusiness);
  saveToLocalStorage("businesses", businesses);
  filteredBusinesses = [...businesses];

  renderBusinesses();
  updateResultsCount();
  document.getElementById("add-business-modal").style.display = "none";
  document.getElementById("add-business-form").reset();

  showNotification(
    "Business submitted for review! We'll verify and approve it soon.",
    "success"
  );
}

// Handle Review Submission
function handleReviewSubmission(e) {
  e.preventDefault();

  const rating = document.querySelector(
    'input[name="review-rating"]:checked'
  )?.value;
  if (!rating) {
    showNotification("Please select a rating!", "error");
    return;
  }

  const review = {
    id: generateId(),
    businessId: selectedBusinessId,
    reviewerName: document.getElementById("reviewer-name").value,
    rating: parseInt(rating),
    title: document.getElementById("review-title").value,
    comment: document.getElementById("review-comment").value,
    date: new Date().toISOString(),
  };

  // Save review
  const reviews = JSON.parse(localStorage.getItem("businessReviews")) || [];
  reviews.push(review);
  saveToLocalStorage("businessReviews", reviews);

  // Update business rating
  const business = businesses.find((b) => b.id === selectedBusinessId);
  if (business) {
    const businessReviews = getBusinessReviews(selectedBusinessId);
    const avgRating =
      businessReviews.reduce((sum, r) => sum + r.rating, 0) /
      businessReviews.length;
    business.rating = Math.round(avgRating * 10) / 10;
    business.reviews = businessReviews.length;
    saveToLocalStorage("businesses", businesses);
  }

  renderBusinesses();
  document.getElementById("review-modal").style.display = "none";
  document.getElementById("review-form").reset();

  showNotification("Review submitted successfully!", "success");
}

// Contact Business
function contactBusiness(businessId) {
  const business = businesses.find((b) => b.id === businessId);
  if (!business) return;

  window.open(`tel:${business.phone}`);
}

// Visit Website
function visitWebsite(businessId) {
  const business = businesses.find((b) => b.id === businessId);
  if (!business || !business.website) return;

  window.open(business.website, "_blank");
}

// Utility Functions
function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
  );
}

function getBusinessReviews(businessId) {
  const allReviews = JSON.parse(localStorage.getItem("businessReviews")) || [];
  return allReviews.filter((review) => review.businessId === businessId);
}

function updateResultsCount() {
  const count = filteredBusinesses.length;
  const resultsCount = document.getElementById("results-count");
  resultsCount.textContent = `${count} business${
    count !== 1 ? "es" : ""
  } found`;
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeBusinessDirectory();
});

// Add business directory specific styles
const businessStyles = document.createElement("style");
businessStyles.textContent = `
    .search-filters {
        padding: var(--spacing-8) 0;
        background-color: var(--gray-100);
    }
    
    .search-bar {
        display: flex;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
        align-items: center;
    }
    
    .search-input-group {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .search-input-group i {
        position: absolute;
        left: var(--spacing-4);
        color: var(--gray-500);
        z-index: 1;
    }
    
    .search-input-group input {
        width: 100%;
        padding: var(--spacing-4) var(--spacing-4) var(--spacing-4) var(--spacing-10);
        border: 1px solid var(--gray-300);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
    }
    
    .search-input-group input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    
    .filter-bar {
        display: flex;
        gap: var(--spacing-6);
        align-items: end;
        flex-wrap: wrap;
    }
    
    .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
    }
    
    .view-toggle {
        display: flex;
        gap: var(--spacing-2);
    }
    
    .view-btn {
        padding: var(--spacing-2) var(--spacing-3);
        border: 1px solid var(--gray-300);
        background-color: var(--white-color);
        color: var(--gray-600);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .view-btn:hover,
    .view-btn.active {
        background-color: var(--primary-color);
        color: var(--white-color);
        border-color: var(--primary-color);
    }
    
    .business-section {
        padding: var(--spacing-12) 0;
    }
    
    .business-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: var(--spacing-8);
    }
    
    .business-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
    }
    
    .business-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .business-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
    }
    
    .business-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .business-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .verified-badge {
        position: absolute;
        top: var(--spacing-3);
        right: var(--spacing-3);
        background-color: var(--success-color);
        color: var(--white-color);
        padding: var(--spacing-1) var(--spacing-3);
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-sm);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
    }
    
    .business-content {
        padding: var(--spacing-6);
    }
    
    .business-category {
        color: var(--primary-color);
        font-weight: 600;
        font-size: var(--font-size-sm);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: var(--spacing-2);
    }
    
    .business-name {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--dark-color);
        margin-bottom: var(--spacing-3);
        line-height: 1.3;
    }
    
    .business-description {
        color: var(--gray-600);
        line-height: 1.6;
        margin-bottom: var(--spacing-4);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .business-rating {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-3);
    }
    
    .stars {
        color: var(--secondary-color);
        font-size: var(--font-size-lg);
    }
    
    .rating-text {
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .business-location {
        color: var(--gray-600);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-4);
    }
    
    .business-location i {
        margin-right: var(--spacing-2);
        color: var(--primary-color);
    }
    
    .business-features {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-4);
    }
    
    .feature-tag {
        background-color: var(--gray-100);
        color: var(--gray-700);
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
        font-size: var(--font-size-xs);
        font-weight: 500;
    }
    
    .feature-tag.large {
        padding: var(--spacing-2) var(--spacing-3);
        font-size: var(--font-size-sm);
    }
    
    .business-actions {
        display: flex;
        gap: var(--spacing-3);
    }
    
    .btn-sm {
        padding: var(--spacing-2) var(--spacing-3);
        font-size: var(--font-size-sm);
    }
    
    /* List View Styles */
    .business-list-item {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
        padding: var(--spacing-6);
        display: flex;
        gap: var(--spacing-6);
        align-items: flex-start;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .business-list-item:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
    }
    
    .business-list-image {
        flex-shrink: 0;
        width: 120px;
        height: 120px;
        border-radius: var(--border-radius);
        overflow: hidden;
        position: relative;
    }
    
    .business-list-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .business-list-image .verified-badge {
        top: var(--spacing-2);
        right: var(--spacing-2);
        padding: var(--spacing-1) var(--spacing-2);
        font-size: var(--font-size-xs);
    }
    
    .business-list-content {
        flex: 1;
    }
    
    .business-list-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-2);
    }
    
    .business-meta {
        display: flex;
        gap: var(--spacing-6);
        margin: var(--spacing-3) 0;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .business-meta i {
        margin-right: var(--spacing-1);
        color: var(--primary-color);
    }
    
    .business-list-actions {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }
    
    /* Modal Styles */
    .business-modal-header {
        display: flex;
        gap: var(--spacing-6);
        margin-bottom: var(--spacing-6);
        padding-bottom: var(--spacing-6);
        border-bottom: 1px solid var(--gray-200);
    }
    
    .business-modal-image {
        width: 150px;
        height: 150px;
        object-fit: cover;
        border-radius: var(--border-radius-lg);
    }
    
    .business-modal-info h2 {
        margin: var(--spacing-2) 0 var(--spacing-3) 0;
        color: var(--dark-color);
    }
    
    .business-modal-content {
        display: grid;
        gap: var(--spacing-8);
    }
    
    .business-modal-content h3 {
        color: var(--dark-color);
        margin-bottom: var(--spacing-4);
        font-size: var(--font-size-xl);
    }
    
    .contact-info {
        display: grid;
        gap: var(--spacing-3);
    }
    
    .contact-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
    }
    
    .contact-item i {
        width: 20px;
        color: var(--primary-color);
    }
    
    .contact-item a {
        color: var(--primary-color);
        text-decoration: none;
    }
    
    .contact-item a:hover {
        text-decoration: underline;
    }
    
    .features-grid {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-3);
    }
    
    .reviews-section {
        margin-top: var(--spacing-8);
        padding-top: var(--spacing-6);
        border-top: 1px solid var(--gray-200);
    }
    
    .reviews-section h3 {
        margin-bottom: var(--spacing-6);
    }
    
    .review-item {
        background-color: var(--gray-50);
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-4);
    }
    
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-2);
    }
    
    .reviewer-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-1);
    }
    
    .review-date {
        color: var(--gray-500);
        font-size: var(--font-size-sm);
    }
    
    .review-title {
        font-weight: 600;
        margin-bottom: var(--spacing-2);
        color: var(--dark-color);
    }
    
    .review-comment {
        color: var(--gray-700);
        line-height: 1.6;
    }
    
    .no-reviews,
    .no-businesses {
        text-align: center;
        padding: var(--spacing-16);
        color: var(--gray-600);
    }
    
    .no-reviews i,
    .no-businesses i {
        font-size: 4rem;
        color: var(--gray-400);
        margin-bottom: var(--spacing-4);
    }
    
    .no-reviews h3,
    .no-businesses h3 {
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-3);
        color: var(--gray-700);
    }
    
    .review-business-card {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        background-color: var(--gray-100);
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-6);
    }
    
    .review-business-card img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: var(--border-radius);
    }
    
    .review-business-card h3 {
        margin: 0;
        color: var(--dark-color);
    }
    
    .review-business-card p {
        margin: var(--spacing-1) 0 0 0;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    @media (max-width: 768px) {
        .search-bar {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-bar {
            flex-direction: column;
            gap: var(--spacing-4);
        }
        
        .results-header {
            flex-direction: column;
            gap: var(--spacing-4);
            align-items: flex-start;
        }
        
        .business-grid {
            grid-template-columns: 1fr;
        }
        
        .business-list-item {
            flex-direction: column;
        }
        
        .business-list-image {
            width: 100%;
            height: 200px;
        }
        
        .business-list-actions {
            flex-direction: row;
            justify-content: space-between;
        }
        
        .business-modal-header {
            flex-direction: column;
            text-align: center;
        }
        
        .business-modal-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        
        .business-meta {
            flex-direction: column;
            gap: var(--spacing-2);
        }
        
        .review-business-card {
            flex-direction: column;
            text-align: center;
        }
    }
`;

document.head.appendChild(businessStyles);
