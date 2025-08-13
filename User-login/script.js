function openTab(tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].style.opacity = "0";
      tabContents[i].style.transform = "translateY(20px)";
      setTimeout(() => {
        tabContents[i].classList.remove("active");
      }, 300); 
    }
  
    const tabButtons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove("active");
    }
  
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach((button) => {
      if (button.textContent.toLowerCase() === tabName) {
        button.classList.add("active");
      }
    });
  
    setTimeout(() => {
      const selectedTab = document.getElementById(tabName);
      selectedTab.classList.add("active");
      setTimeout(() => {
        selectedTab.style.opacity = "1";
        selectedTab.style.transform = "translateY(0)";
      }, 50);
    }, 350); 
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const activeTab = document.querySelector(".tab-content.active");
    if (activeTab) {
      activeTab.style.opacity = "1";
      activeTab.style.transform = "translateY(0)";
    }
  });
  