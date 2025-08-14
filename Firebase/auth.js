// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

console.log("Auth script loaded successfully");

const firebaseConfig = {
    apiKey: "AIzaSyAgBL9AsBS8DGb7MmLW6vETJuFRmWMzPo4",
    authDomain: "web-a-thon-login.firebaseapp.com",
    projectId: "web-a-thon-login",
    storageBucket: "web-a-thon-login.firebasestorage.app",
    messagingSenderId: "1001205150619",
    appId: "1:1001205150619:web:2cb5abb3f392950ae4e73e",
    measurementId: "G-BPYSSGYRFJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🔥 Firebase initialized successfully");

function debugPaths() {
  console.log("📁 Current page:", window.location.href);
  console.log("📁 Current pathname:", window.location.pathname);
  console.log("📁 Current directory:", window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));
}

function showMessage(message, type = 'info') {
  console.log(`📢 ${type.toUpperCase()}: ${message}`);
  
  const existingMessages = document.querySelectorAll('.debug-message');
  existingMessages.forEach(msg => msg.remove());
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'debug-message';
  messageDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#5352ed'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: 500;
      max-width: 300px;
      word-wrap: break-word;
    ">
      ${message}
    </div>
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => messageDiv.remove(), 5000);
}

function startSession() {
  console.log("🎯 Starting session...");
  try {
    const currentTime = new Date().getTime();
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('loginTime', currentTime.toString());
    console.log("Session started successfully:", currentTime);
  } catch (error) {
    console.error("Error starting session:", error);
  }
}

function clearSession() {
  console.log("Clearing session...");
  try {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loginTime');
    console.log("Session cleared successfully");
  } catch (error) {
    console.error("Error clearing session:", error);
  }
}

function isSessionValid() {
  console.log("🔍 Checking session validity...");
  try {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const loginTime = localStorage.getItem('loginTime');
    
    console.log("Session data:", { isLoggedIn, loginTime });
    
    if (isLoggedIn !== 'true' || !loginTime) {
      console.log("Session invalid: missing data");
      return false;
    }
    
    const now = new Date().getTime();
    const sessionAge = now - parseInt(loginTime);
    const thirtyTwoHours = 32 * 60 * 60 * 1000;
    
    console.log("⏰ Session age:", sessionAge, "Max age:", thirtyTwoHours);
    
    const isValid = sessionAge < thirtyTwoHours;
    console.log(isValid ? "Session valid" : "Session expired");
    return isValid;
  } catch (error) {
    console.error("Error checking session validity:", error);
    return false;
  }
}

function redirectToHome() {
  console.log("Attempting to redirect to homepage...");
  debugPaths();
  
 
  const possiblePaths = [
    "Homepage/index.html",      
    "Home page/index.html",    
    "home/index.html",         
    "dashboard.html",           
    "main.html"                 
  ];
  
  const targetPath = possiblePaths[0];
  console.log("Redirecting to:", targetPath);
  
  setTimeout(() => {
    try {
      window.location.href = targetPath;
      console.log("Redirect initiated");
    } catch (error) {
      console.error("Redirect failed:", error);
      showMessage("Redirect failed. Check console for details.", 'error');
    }
  }, 1000);
}

function redirectToLogin() {
  console.log("Redirecting to login...");
  debugPaths();
  
  setTimeout(() => {
    try {
      window.location.href = "index.html";
      console.log("Login redirect initiated");
    } catch (error) {
      console.error("Login redirect failed:", error);
    }
  }, 1000);
}

function checkSessionAndRedirect() {
  console.log("Checking session for redirect...");
  debugPaths();
  
  if (isSessionValid()) {
    console.log("Valid session found, redirecting to home");
    showMessage('Valid session found! Redirecting to homepage...', 'success');
    redirectToHome();
  } else {
    console.log("No valid session, staying on login page");
    clearSession();
  }
}

function protectPage() {
  console.log("Protecting page...");
  debugPaths();
  
  if (!isSessionValid()) {
    console.log("Invalid session, redirecting to login");
    showMessage('Session expired. Redirecting to login...', 'error');
    clearSession();
    redirectToLogin();
    return false;
  }
  console.log("Page access granted");
  return true;
}

function initializeLoginForm() {
  console.log("Initializing login form...");
  const loginForm = document.querySelector("#login-form");
  
  if (!loginForm) {
    console.log("Login form not found");
    return;
  }
  
  console.log("Login form found");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
    
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    
    console.log("Login attempt for email:", email);
    
    if (!email || !password) {
      console.log("Missing email or password");
      showMessage("Please fill in all fields", 'error');
      return;
    }
    
    const submitBtn = loginForm.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    try {
      console.log("Attempting Firebase login...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Firebase login successful:", user.uid);
      console.log("User email:", user.email);
      
      startSession();
      showMessage(`Login successful! Redirecting...`, 'success');
      
      console.log("About to redirect to homepage...");
      setTimeout(() => {
        console.log("Executing redirect now...");
        redirectToHome();
      }, 2000);
      
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "Login failed: " + error.message;
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
      }
      
      showMessage(errorMessage, 'error');
      
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function initializeRegisterForm() {
  console.log("Initializing register form...");
  const registerForm = document.querySelector("#register-form");
  
  if (!registerForm) {
    console.log("Register form not found");
    return;
  }
  
  console.log("Register form found");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Register form submitted");
    
    const fullName = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const termsAccepted = document.getElementById("terms").checked;
    
    console.log("Registration data:", { fullName, email, termsAccepted });
    
    if (!termsAccepted) {
      console.log("Terms not accepted");
      showMessage("Please accept the Terms & Conditions.", 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      showMessage("Passwords do not match.", 'error');
      return;
    }
    
    const submitBtn = registerForm.querySelector('.reg-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
      console.log("Attempting Firebase registration...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Firebase registration successful:", user.uid);
      
      const userData = {
        fullName: fullName,
        email: email,
        createdAt: new Date().toISOString()
      };
      
      console.log("Saving user data to Firestore...");
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User data saved to Firestore");
      
      startSession();
      showMessage("Account created successfully! Redirecting...", 'success');
      
      console.log("About to redirect to homepage...");
      setTimeout(() => {
        console.log("Executing redirect now...");
        redirectToHome();
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "Registration failed: " + error.message;
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak.";
          break;
      }
      
      showMessage(errorMessage, 'error');
      
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(" Auth state: User signed in:", user.email);
  } else {
    console.log("Auth state: User signed out");
  }
});

window.openTab = function(tabName) {
  console.log("🗂️ Opening tab:", tabName);
  const tabContents = document.querySelectorAll(".tab-content");
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabContents.forEach((tab) => {
    tab.style.opacity = "0";
    tab.style.transform = "translateY(20px)";
    setTimeout(() => tab.classList.remove("active"), 300);
  });

  tabButtons.forEach((button) => button.classList.remove("active"));

  const selectedButton = Array.from(tabButtons).find(
    (button) => button.textContent.toLowerCase().trim() === tabName.toLowerCase()
  );
  
  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  setTimeout(() => {
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
      selectedTab.classList.add("active");
      setTimeout(() => {
        selectedTab.style.opacity = "1";
        selectedTab.style.transform = "translateY(0)";
      }, 50);
    }
  }, 350);
};

window.logout = async function() {
  console.log(" Logging out...");
  try {
    await signOut(auth);
    clearSession();
    showMessage("Logged out successfully!", 'success');
    setTimeout(redirectToLogin, 1000);
  } catch (error) {
    console.error("Logout error:", error);
    clearSession();
    redirectToLogin();
  }
};


function initializePageProtection() {
  const currentPath = window.location.pathname.toLowerCase();
  console.log(" Initializing page protection for:", currentPath);
  
  if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
    console.log(" On login page - checking for existing session");
    document.addEventListener("DOMContentLoaded", checkSessionAndRedirect);
  }
  
  if (currentPath.includes('homepage') || currentPath.includes('home page') || currentPath.includes('home')) {
    console.log(" On protected page - verifying access");
    document.addEventListener("DOMContentLoaded", protectPage);
  }
}


document.addEventListener("DOMContentLoaded", function() {
  console.log(" DOM Content Loaded - Initializing auth system");
  debugPaths();
  
  initializeLoginForm();
  initializeRegisterForm();
  initializePageProtection();
  
  const activeTab = document.querySelector(".tab-content.active");
  if (activeTab) {
    activeTab.style.opacity = "1";
    activeTab.style.transform = "translateY(0)";
  }
  
  console.log(" Auth system initialization complete");
});

console.log(" Auth script fully loaded and ready");