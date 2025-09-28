// ========================
// Loading Screen + Theme Persistence
// ========================
window.addEventListener("load", function () {
    setTimeout(() => {
        document.getElementById("loading").classList.add("hide");
    }, 800);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("portfolioTheme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        document.getElementById("mobileThemeIcon").className = "fas fa-sun";
        document.getElementById("floatingThemeIcon").className = "fas fa-sun";
    }
});

// ========================
// Theme Toggle (Floating + Mobile only)
// ========================
const mobileThemeToggle = document.getElementById("mobileThemeToggle");
const mobileThemeIcon = document.getElementById("mobileThemeIcon");
const floatingThemeToggle = document.getElementById("floatingThemeToggle");
const floatingThemeIcon = document.getElementById("floatingThemeIcon");
const body = document.body;

function toggleTheme() {
    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
        mobileThemeIcon.className = "fas fa-sun";
        floatingThemeIcon.className = "fas fa-sun";
        localStorage.setItem("portfolioTheme", "light");
        showNotification("Light mode enabled");
    } else {
        mobileThemeIcon.className = "fas fa-moon";
        floatingThemeIcon.className = "fas fa-moon";
        localStorage.setItem("portfolioTheme", "dark");
        showNotification("Dark mode enabled");
    }
}

if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", toggleTheme);
if (floatingThemeToggle) floatingThemeToggle.addEventListener("click", toggleTheme);

// ========================
// Notification System
// ========================
function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const content = notification.querySelector(".notification-content");

    notification.className = "notification";
    notification.classList.add(type);
    content.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// ========================
// Navigation System
// ========================
const navLinks = document.querySelectorAll(".nav-link");
const contentSlider = document.getElementById("contentSlider");
const slides = document.querySelectorAll(".slide");
const swipeDots = document.querySelectorAll(".swipe-dot");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    swipeDots.forEach((dot) => dot.classList.remove("active"));
    navLinks.forEach((link) => link.classList.remove("active"));

    const translateX = -index * (100 / 7);
    contentSlider.style.transform = `translateX(${translateX}%)`;

    setTimeout(() => {
        slides[index].classList.add("active");
        swipeDots[index].classList.add("active");

        const navLink = document.querySelector(`.nav-link[data-section="${index}"]`);
        if (navLink) navLink.classList.add("active");
    }, 200);

    currentSlide = index;

    if (window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.remove("active");
        document.getElementById("sidebarOverlay").classList.remove("active");
    }
}

navLinks.forEach((link, index) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        showSlide(parseInt(this.getAttribute("data-section")));

        const sectionNames = ["Dashboard", "About", "Experience", "Education", "Projects", "Skills", "Contact"];
        showNotification(`Navigated to ${sectionNames[index]} section`);
    });
});

swipeDots.forEach((dot) => {
    dot.addEventListener("click", function () {
        const sectionIndex = parseInt(this.getAttribute("data-section"));
        showSlide(sectionIndex);
    });
});

// ========================
// Swipe Navigation
// ========================

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchMove(e) {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
}

function handleTouchEnd() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const threshold = 50; // minimum distance to count as swipe

  // Only trigger swipe if horizontal movement is greater than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < -threshold) {
      // Swipe left → next slide
      if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
      }
    } else if (deltaX > threshold) {
      // Swipe right → prev slide
      if (currentSlide > 0) {
        showSlide(currentSlide - 1);
      }
    }
  }
}

// Add event listeners for touch events on the main content
const mainContent = document.getElementById('mainContent');
mainContent.addEventListener('touchstart', handleTouchStart, false);
mainContent.addEventListener('touchmove', handleTouchMove, false);
mainContent.addEventListener('touchend', handleTouchEnd, false);

// ========================
// Keyboard Navigation
// ========================
document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" && currentSlide > 0) {
        showSlide(currentSlide - 1);
    } else if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
});


// ========================
// Contact Form (Formspree Integration)
// ========================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector(".submit-btn");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" }
            });

            if (response.ok) {
                showNotification("Message sent successfully! I’ll get back to you soon.");
                contactForm.reset();
            } else {
                showNotification("Oops! Something went wrong.", "error");
            }
        } catch (error) {
            showNotification("Network error. Please try again.", "error");
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}


// ========================
// Animate elements on scroll
// ========================
document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".glass-card, .stat-card, .skill-card, .project-card").forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
    });
});

// ========================
// Mobile Sidebar
// ========================
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
        sidebar.classList.add("active");
        sidebarOverlay.classList.add("active");
    });
}
if (closeSidebar) {
    closeSidebar.addEventListener("click", function () {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });
}
if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function () {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", function () {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });
});
