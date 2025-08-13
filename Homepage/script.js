// Global Variables
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let events = JSON.parse(localStorage.getItem("events")) || [];
let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
let actions = JSON.parse(localStorage.getItem("actions")) || [];
let forumPosts = JSON.parse(localStorage.getItem("forumPosts")) || [];

// Utility Functions
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            }"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  });

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }
  }, 5000);
}

// Navigation Functions
function initializeNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }
}

// Statistics Animation
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    // Start animation when element comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(counter);
  });
}

// User Authentication Functions
function initializeAuth() {
  // Check if user is logged in
  if (currentUser) {
    updateUIForLoggedInUser();
  }
}

function updateUIForLoggedInUser() {
  // Update navigation or other UI elements based on user state
  const adminLinks = document.querySelectorAll(".admin-link");
  if (currentUser && currentUser.role === "admin") {
    adminLinks.forEach((link) => {
      link.style.display = "block";
    });
  }
}

function loginUser(email, password) {
  // Simple authentication - in real app, this would be server-side
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    saveToLocalStorage("currentUser", currentUser);
    updateUIForLoggedInUser();
    return true;
  }
  return false;
}

function registerUser(userData) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const newUser = {
    id: generateId(),
    ...userData,
    registeredAt: new Date().toISOString(),
    points: 0,
    badges: [],
    role: "user",
  };

  users.push(newUser);
  saveToLocalStorage("users", users);

  currentUser = newUser;
  saveToLocalStorage("currentUser", currentUser);
  updateUIForLoggedInUser();

  return newUser;
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Initialize Sample Data
function initializeSampleData() {
  // Sample Events
  if (events.length === 0) {
    events = [
      {
        id: generateId(),
        title: "Community Tree Plantation Drive",
        description:
          "Join us for a massive tree plantation initiative in Central Park. We aim to plant 500+ trees to improve air quality and create green spaces.",
        date: "2024-02-15",
        time: "09:00",
        location: "Central Park, Main Entrance",
        category: "environment",
        maxParticipants: 100,
        currentParticipants: 67,
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
        organizer: "Green City Initiative",
        status: "upcoming",
      },
      {
        id: generateId(),
        title: "Beach Cleanup Campaign",
        description:
          "Help us clean our beautiful coastline and protect marine life. All cleanup equipment will be provided.",
        date: "2024-02-20",
        time: "08:00",
        location: "Marina Beach",
        category: "cleanup",
        maxParticipants: 150,
        currentParticipants: 89,
        image:
          "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
        organizer: "Ocean Guardians",
        status: "upcoming",
      },
      {
        id: generateId(),
        title: "Recycling Workshop for Families",
        description:
          "Learn creative ways to recycle household items and reduce waste. Perfect for families with children.",
        date: "2024-02-25",
        time: "14:00",
        location: "Community Center Hall A",
        category: "workshop",
        maxParticipants: 50,
        currentParticipants: 23,
        image:
          "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
        organizer: "Waste Warriors",
        status: "upcoming",
      },
    ];
    saveToLocalStorage("events", events);
  }

  // Sample Businesses
  if (businesses.length === 0) {
    businesses = [
      {
        id: generateId(),
        name: "Green Grocers Organic Market",
        description:
          "100% organic produce sourced from local farms. Zero plastic packaging, supporting sustainable agriculture.",
        category: "organic-food",
        address: "123 Eco Street, Green District",
        phone: "+1 234-567-8900",
        email: "info@greengrocers.com",
        website: "https://greengrocers.com",
        rating: 4.8,
        reviews: 156,
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
        verified: true,
        features: ["Organic Certified", "Zero Waste", "Local Sourcing"],
      },
      {
        id: generateId(),
        name: "Solar Solutions Pro",
        description:
          "Leading provider of residential and commercial solar panel installations. Clean energy for a sustainable future.",
        category: "renewable-energy",
        address: "456 Solar Avenue, Tech Park",
        phone: "+1 234-567-8901",
        email: "contact@solarsolutions.com",
        website: "https://solarsolutions.com",
        rating: 4.9,
        reviews: 203,
        image:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
        verified: true,
        features: [
          "25 Year Warranty",
          "Free Consultation",
          "Government Rebates",
        ],
      },
      {
        id: generateId(),
        name: "EcoWrap Packaging Co.",
        description:
          "Biodegradable and compostable packaging solutions for businesses. Say goodbye to plastic waste.",
        category: "eco-packaging",
        address: "789 Innovation Blvd, Business Park",
        phone: "+1 234-567-8902",
        email: "hello@ecowrap.com",
        website: "https://ecowrap.com",
        rating: 4.7,
        reviews: 89,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        verified: true,
        features: ["100% Biodegradable", "Custom Designs", "Bulk Orders"],
      },
    ];
    saveToLocalStorage("businesses", businesses);
  }

  // Sample Forum Posts
  if (forumPosts.length === 0) {
    forumPosts = [
      {
        id: generateId(),
        title: "How to reduce energy consumption at home?",
        content:
          "I'm looking for practical tips to reduce my household energy consumption. What are some effective strategies you've tried?",
        author: "EcoEnthusiast",
        category: "energy",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        upvotes: 15,
        downvotes: 2,
        replies: [
          {
            id: generateId(),
            author: "GreenTech",
            content:
              "LED bulbs and smart thermostats made a huge difference for us!",
            timestamp: new Date(Date.now() - 43200000).toISOString(),
            upvotes: 8,
            downvotes: 0,
          },
        ],
      },
      {
        id: generateId(),
        title: "Public transport vs. electric vehicles",
        content:
          "What's more sustainable for daily commuting - using public transport or switching to an electric vehicle?",
        author: "CommuteCurious",
        category: "transport",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        upvotes: 23,
        downvotes: 5,
        replies: [],
      },
    ];
    saveToLocalStorage("forumPosts", forumPosts);
  }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeAuth();
  initializeSampleData();
  initializeSmoothScrolling();

  // Animate counters if on home page
  if (document.querySelector(".stat-number")) {
    animateCounters();
  }

  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });
});

// Add notification styles to head if not already present
if (!document.querySelector("#notification-styles")) {
  const notificationStyles = document.createElement("style");
  notificationStyles.id = "notification-styles";
  notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--white-color);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            padding: var(--spacing-4);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 500px;
            z-index: 10000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification-error {
            border-left: 4px solid var(--error-color);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: var(--spacing-3);
        }
        
        .notification-content i {
            font-size: var(--font-size-lg);
        }
        
        .notification-success .notification-content i {
            color: var(--success-color);
        }
        
        .notification-error .notification-content i {
            color: var(--error-color);
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: var(--font-size-xl);
            cursor: pointer;
            color: var(--gray-500);
            padding: 0;
            margin-left: var(--spacing-3);
        }
        
        .notification-close:hover {
            color: var(--gray-700);
        }
        
        .navbar.scrolled {
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
        }
    `;
  document.head.appendChild(notificationStyles);
}
