// Waste Management Hub JavaScript

// Sample data for waste management locations
const wasteLocations = [
  {
    id: 1,
    name: "Central Recycling Center",
    type: "recycling",
    address: "123 Green Street, Downtown",
    phone: "(555) 123-4567",
    hours: "Mon-Sat: 8AM-6PM, Sun: 10AM-4PM",
    accepts: ["Paper", "Plastic", "Glass", "Metal", "Electronics"],
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "Community Composting Facility",
    type: "composting",
    address: "456 Eco Avenue, Green District",
    phone: "(555) 234-5678",
    hours: "Daily: 6AM-8PM",
    accepts: ["Organic Waste", "Garden Trimmings", "Food Scraps"],
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: 3,
    name: "Neighborhood Collection Point",
    type: "collection",
    address: "789 Sustainable Lane, Eco Park",
    phone: "(555) 345-6789",
    hours: "24/7 Access",
    accepts: ["General Waste", "Recyclables"],
    coordinates: { lat: 40.7282, lng: -73.7949 },
  },
  {
    id: 4,
    name: "Hazardous Waste Disposal",
    type: "hazardous",
    address: "321 Safety Road, Industrial Zone",
    phone: "(555) 456-7890",
    hours: "Tue-Thu: 9AM-5PM, Sat: 9AM-3PM",
    accepts: ["Batteries", "Paint", "Chemicals", "Electronic Waste"],
    coordinates: { lat: 40.6782, lng: -73.9442 },
  },
];

// Waste segregation categories
const wasteCategories = [
  {
    id: "organic",
    name: "Organic Waste",
    color: "#4CAF50",
    icon: "fas fa-apple-alt",
    description: "Biodegradable waste that can be composted",
    examples: [
      "Food scraps and leftovers",
      "Fruit and vegetable peels",
      "Coffee grounds and tea bags",
      "Eggshells",
      "Garden trimmings and leaves",
    ],
    tips: [
      "Keep organic waste in a separate bin",
      "Use compostable bags or newspaper",
      "Avoid adding meat, dairy, or oily foods",
      "Turn compost regularly for better decomposition",
    ],
  },
  {
    id: "recyclable",
    name: "Recyclable Waste",
    color: "#2196F3",
    icon: "fas fa-recycle",
    description: "Materials that can be processed and reused",
    examples: [
      "Paper and cardboard",
      "Plastic bottles and containers",
      "Glass bottles and jars",
      "Metal cans and foil",
      "Clean packaging materials",
    ],
    tips: [
      "Clean containers before recycling",
      "Remove caps and lids when required",
      "Separate different materials",
      "Check local recycling guidelines",
    ],
  },
  {
    id: "hazardous",
    name: "Hazardous Waste",
    color: "#FF5722",
    icon: "fas fa-exclamation-triangle",
    description: "Dangerous materials requiring special handling",
    examples: [
      "Batteries and electronics",
      "Paint and solvents",
      "Cleaning chemicals",
      "Medical waste",
      "Fluorescent bulbs",
    ],
    tips: [
      "Never mix with regular waste",
      "Take to designated collection centers",
      "Keep in original containers",
      "Handle with protective equipment",
    ],
  },
  {
    id: "general",
    name: "General Waste",
    color: "#607D8B",
    icon: "fas fa-trash",
    description: "Non-recyclable waste for landfill disposal",
    examples: [
      "Dirty diapers and sanitary items",
      "Broken ceramics and mirrors",
      "Contaminated packaging",
      "Mixed material items",
      "Non-recyclable plastics",
    ],
    tips: [
      "Minimize general waste generation",
      "Use proper waste bags",
      "Dispose in designated bins",
      "Consider alternatives before throwing away",
    ],
  },
];

// Initialize Waste Management Hub
function initializeWasteHub() {
  setupTabs();
  renderWasteLocations();
  renderWasteCategories();
  setupPickupForm();
  setupMapFilters();

  // Set minimum pickup date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("pickup-date").min = tomorrow
    .toISOString()
    .split("T")[0];
}

// Setup Tabs
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      showTab(targetTab);
    });
  });
}

// Show Tab
function showTab(tabName) {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });

  tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === `${tabName}-tab`);
  });
}

// Render Waste Locations
function renderWasteLocations() {
  const mapLocations = document.getElementById("map-locations");

  mapLocations.innerHTML = wasteLocations
    .map(
      (location) => `
        <div class="location-card" data-type="${location.type}">
            <div class="location-header">
                <div class="location-icon ${location.type}">
                    <i class="${getLocationIcon(location.type)}"></i>
                </div>
                <div class="location-info">
                    <h4>${location.name}</h4>
                    <p class="location-type">${formatLocationType(
                      location.type
                    )}</p>
                </div>
            </div>
            <div class="location-details">
                <div class="location-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${location.address}
                </div>
                <div class="location-phone">
                    <i class="fas fa-phone"></i>
                    ${location.phone}
                </div>
                <div class="location-hours">
                    <i class="fas fa-clock"></i>
                    ${location.hours}
                </div>
                <div class="location-accepts">
                    <strong>Accepts:</strong>
                    <div class="accepts-list">
                        ${location.accepts
                          .map(
                            (item) => `<span class="accept-tag">${item}</span>`
                          )
                          .join("")}
                    </div>
                </div>
            </div>
            <div class="location-actions">
                <button class="btn btn-outline btn-sm" onclick="getDirections('${
                  location.address
                }')">
                    <i class="fas fa-directions"></i>
                    Directions
                </button>
                <button class="btn btn-outline btn-sm" onclick="callLocation('${
                  location.phone
                }')">
                    <i class="fas fa-phone"></i>
                    Call
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Render Waste Categories
function renderWasteCategories() {
  const categoriesContainer = document.getElementById("waste-categories");

  categoriesContainer.innerHTML = wasteCategories
    .map(
      (category) => `
        <div class="waste-category" style="border-left-color: ${
          category.color
        }">
            <div class="category-header">
                <div class="category-icon" style="background-color: ${
                  category.color
                }">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                </div>
            </div>
            
            <div class="category-content">
                <div class="category-section">
                    <h4>Examples:</h4>
                    <ul class="examples-list">
                        ${category.examples
                          .map((example) => `<li>${example}</li>`)
                          .join("")}
                    </ul>
                </div>
                
                <div class="category-section">
                    <h4>Tips:</h4>
                    <ul class="tips-list">
                        ${category.tips
                          .map((tip) => `<li>${tip}</li>`)
                          .join("")}
                    </ul>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Setup Pickup Form
function setupPickupForm() {
  const form = document.getElementById("pickup-request-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handlePickupRequest();
  });
}

// Setup Map Filters
function setupMapFilters() {
  const filterCheckboxes = document.querySelectorAll(".filter-checkbox input");

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterLocations);
  });
}

// Filter Locations
function filterLocations() {
  const checkboxes = document.querySelectorAll(".filter-checkbox input");
  const activeTypes = Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.getAttribute("data-type"));

  const locationCards = document.querySelectorAll(".location-card");

  locationCards.forEach((card) => {
    const type = card.getAttribute("data-type");
    if (activeTypes.includes(type)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Handle Pickup Request
function handlePickupRequest() {
  const formData = {
    name: document.getElementById("pickup-name").value,
    phone: document.getElementById("pickup-phone").value,
    address: document.getElementById("pickup-address").value,
    date: document.getElementById("pickup-date").value,
    time: document.getElementById("pickup-time").value,
    items: document.getElementById("pickup-items").value,
    instructions: document.getElementById("special-instructions").value,
    requestId: generateId(),
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  // Save pickup request
  const pickupRequests =
    JSON.parse(localStorage.getItem("pickupRequests")) || [];
  pickupRequests.push(formData);
  saveToLocalStorage("pickupRequests", pickupRequests);

  // Reset form
  document.getElementById("pickup-request-form").reset();

  // Set minimum date again
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("pickup-date").min = tomorrow
    .toISOString()
    .split("T")[0];

  showNotification(
    "Pickup request submitted successfully! We'll contact you within 24 hours.",
    "success"
  );
}

// Get Directions
function getDirections(address) {
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  window.open(googleMapsUrl, "_blank");
}

// Call Location
function callLocation(phone) {
  window.open(`tel:${phone}`);
}

// Utility Functions
function getLocationIcon(type) {
  const icons = {
    recycling: "fas fa-recycle",
    composting: "fas fa-seedling",
    collection: "fas fa-trash",
    hazardous: "fas fa-exclamation-triangle",
  };
  return icons[type] || "fas fa-map-marker-alt";
}

function formatLocationType(type) {
  const types = {
    recycling: "Recycling Center",
    composting: "Composting Facility",
    collection: "Collection Point",
    hazardous: "Hazardous Waste Disposal",
  };
  return types[type] || type;
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeWasteHub();
});

// Add waste management specific styles
const wasteStyles = document.createElement("style");
wasteStyles.textContent = `
    .quick-actions-section {
        padding: var(--spacing-8) 0;
        background-color: var(--gray-100);
    }
    
    .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-6);
    }
    
    .quick-action-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-8);
        text-align: center;
        box-shadow: var(--shadow);
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .quick-action-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
        border-color: var(--primary-color);
    }
    
    .quick-action-card i {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: var(--spacing-4);
    }
    
    .quick-action-card h3 {
        margin: 0 0 var(--spacing-3) 0;
        color: var(--dark-color);
    }
    
    .quick-action-card p {
        color: var(--gray-600);
        margin: 0;
    }
    
    .main-content {
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
    
    .map-section {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: var(--spacing-8);
    }
    
    .map-filters {
        background-color: var(--gray-50);
        padding: var(--spacing-6);
        border-radius: var(--border-radius-lg);
        height: fit-content;
    }
    
    .map-filters h3 {
        margin: 0 0 var(--spacing-4) 0;
        color: var(--dark-color);
    }
    
    .filter-options {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }
    
    .filter-checkbox {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        cursor: pointer;
        font-weight: 500;
    }
    
    .filter-checkbox input {
        display: none;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border-radius: var(--border-radius);
        border: 2px solid var(--gray-300);
        position: relative;
        transition: all 0.3s ease;
    }
    
    .checkmark.recycling { border-color: #2196F3; }
    .checkmark.composting { border-color: #4CAF50; }
    .checkmark.collection { border-color: #607D8B; }
    .checkmark.hazardous { border-color: #FF5722; }
    
    .filter-checkbox input:checked + .checkmark {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }
    
    .filter-checkbox input:checked + .checkmark.recycling { background-color: #2196F3; }
    .filter-checkbox input:checked + .checkmark.composting { background-color: #4CAF50; }
    .filter-checkbox input:checked + .checkmark.collection { background-color: #607D8B; }
    .filter-checkbox input:checked + .checkmark.hazardous { background-color: #FF5722; }
    
    .filter-checkbox input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        color: white;
        font-weight: bold;
        font-size: 12px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .map-container {
        background-color: var(--gray-50);
        border-radius: var(--border-radius-lg);
        overflow: hidden;
    }
    
    .map-placeholder {
        padding: var(--spacing-12);
        text-align: center;
        color: var(--gray-600);
    }
    
    .map-placeholder i {
        font-size: 4rem;
        margin-bottom: var(--spacing-4);
        color: var(--gray-400);
    }
    
    .map-placeholder h3 {
        margin-bottom: var(--spacing-3);
        color: var(--dark-color);
    }
    
    .map-locations {
        display: grid;
        gap: var(--spacing-4);
        margin-top: var(--spacing-8);
        text-align: left;
    }
    
    .location-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
        transition: all 0.3s ease;
    }
    
    .location-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
    }
    
    .location-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-4);
    }
    
    .location-icon {
        width: 50px;
        height: 50px;
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        font-size: var(--font-size-lg);
    }
    
    .location-icon.recycling { background-color: #2196F3; }
    .location-icon.composting { background-color: #4CAF50; }
    .location-icon.collection { background-color: #607D8B; }
    .location-icon.hazardous { background-color: #FF5722; }
    
    .location-info h4 {
        margin: 0 0 var(--spacing-1) 0;
        color: var(--dark-color);
    }
    
    .location-type {
        margin: 0;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
        text-transform: uppercase;
        font-weight: 600;
    }
    
    .location-details {
        margin-bottom: var(--spacing-4);
    }
    
    .location-details > div {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-2);
        color: var(--gray-700);
        font-size: var(--font-size-sm);
    }
    
    .location-details i {
        width: 16px;
        color: var(--primary-color);
    }
    
    .location-accepts {
        margin-top: var(--spacing-3);
    }
    
    .accepts-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-2);
        margin-top: var(--spacing-2);
    }
    
    .accept-tag {
        background-color: var(--gray-100);
        color: var(--gray-700);
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
        font-size: var(--font-size-xs);
        font-weight: 500;
    }
    
    .location-actions {
        display: flex;
        gap: var(--spacing-2);
    }
    
    .segregation-guide {
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .guide-intro {
        text-align: center;
        margin-bottom: var(--spacing-12);
    }
    
    .guide-intro h3 {
        margin-bottom: var(--spacing-4);
        color: var(--dark-color);
        font-size: var(--font-size-2xl);
    }
    
    .guide-intro p {
        color: var(--gray-600);
        font-size: var(--font-size-lg);
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
    }
    
    .waste-categories {
        display: grid;
        gap: var(--spacing-8);
    }
    
    .waste-category {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-8);
        box-shadow: var(--shadow);
        border-left: 6px solid var(--primary-color);
    }
    
    .category-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-6);
        margin-bottom: var(--spacing-6);
    }
    
    .category-icon {
        width: 80px;
        height: 80px;
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        font-size: var(--font-size-2xl);
        flex-shrink: 0;
    }
    
    .category-info h3 {
        margin: 0 0 var(--spacing-2) 0;
        color: var(--dark-color);
        font-size: var(--font-size-xl);
    }
    
    .category-info p {
        margin: 0;
        color: var(--gray-600);
        font-size: var(--font-size-base);
    }
    
    .category-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-8);
    }
    
    .category-section h4 {
        margin: 0 0 var(--spacing-3) 0;
        color: var(--dark-color);
        font-size: var(--font-size-lg);
    }
    
    .examples-list,
    .tips-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .examples-list li,
    .tips-list li {
        padding: var(--spacing-2) 0;
        color: var(--gray-700);
        position: relative;
        padding-left: var(--spacing-6);
    }
    
    .examples-list li::before {
        content: '•';
        color: var(--primary-color);
        position: absolute;
        left: 0;
        font-weight: bold;
        font-size: var(--font-size-lg);
    }
    
    .tips-list li::before {
        content: '💡';
        position: absolute;
        left: 0;
    }
    
    .pickup-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-12);
        align-items: start;
    }
    
    .pickup-info h3 {
        margin: 0 0 var(--spacing-4) 0;
        color: var(--dark-color);
        font-size: var(--font-size-2xl);
    }
    
    .pickup-info p {
        color: var(--gray-600);
        line-height: 1.6;
        margin-bottom: var(--spacing-6);
    }
    
    .pickup-guidelines {
        background-color: var(--gray-50);
        padding: var(--spacing-6);
        border-radius: var(--border-radius-lg);
        border-left: 4px solid var(--primary-color);
    }
    
    .pickup-guidelines h4 {
        margin: 0 0 var(--spacing-3) 0;
        color: var(--dark-color);
    }
    
    .pickup-guidelines ul {
        margin: 0;
        padding-left: var(--spacing-5);
    }
    
    .pickup-guidelines li {
        margin-bottom: var(--spacing-2);
        color: var(--gray-700);
    }
    
    .pickup-form-container {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-8);
        box-shadow: var(--shadow);
    }
    
    .pickup-form h4 {
        margin: 0 0 var(--spacing-6) 0;
        color: var(--dark-color);
        font-size: var(--font-size-xl);
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-4);
    }
    
    .form-group {
        margin-bottom: var(--spacing-4);
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
    
    .pickup-form .btn {
        width: 100%;
        margin-top: var(--spacing-4);
    }
    
    @media (max-width: 768px) {
        .map-section {
            grid-template-columns: 1fr;
        }
        
        .map-filters {
            order: 2;
        }
        
        .category-header {
            flex-direction: column;
            text-align: center;
        }
        
        .category-content {
            grid-template-columns: 1fr;
        }
        
        .pickup-section {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .filter-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-2);
        }
    }
`;

document.head.appendChild(wasteStyles);
