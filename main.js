// Load content into sections
window.addEventListener('DOMContentLoaded', () => {
    loadSection('about', 'about.html');
    loadSection('skills', 'skills.html');
    loadSection('projects', 'projects.html');
    loadSection('experience', 'experience.html');
    loadSection('contact', 'contact.html');
    
    // Initialize page functionality
    initPage();
});

function loadSection(sectionId, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(sectionId).innerHTML = data;
            // Initialize animations after content loads
            animateOnScroll();
        })
        .catch(error => {
            console.error(`Error loading ${url}:`, error);
        });
}

function initPage() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Form Submission Handler
    document.addEventListener('submit', async (e) => {
        if (e.target.id === 'contactForm') {
            e.preventDefault();
            const form = e.target;
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            // Show loading state
            button.textContent = 'Sending...';
            button.disabled = true;
            button.classList.add('loading');
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    //Notification('Thank you for your message! I will get back to you soon.', 'success');
                    form.reset();
                } else {
                    showNotification('Oops! There was a problem submitting your form. Please try again.', 'error');
                }
            } catch (error) {
                showNotification('Oops! There was a problem submitting your form. Please try again.', 'error');
            } finally {
                // Reset button state
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('loading');
            }
        }
    });
    
    // Enhanced Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            closeMobileMenu();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Calculate header height for offset
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 60;
                
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced Header scroll effect
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        handleScrollToTop();
        animateOnScroll(); // Animate elements on scroll
    });
    
    // Scroll to top functionality
    initScrollToTop();
    
    // Set initial styles for animated elements
    initAnimations();
    
    // Initial animation check
    animateOnScroll();
    
    // Keyboard navigation support
    initKeyboardNavigation();
    
    // Initialize page load animation
    initPageLoadAnimation();
}

// Enhanced Mobile Menu Functionality
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    
    if (!menuBtn || !navLinks) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle mobile menu
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking outside (additional safety)
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    
    navLinks.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    menuBtn.classList.add('active');
    
    // Change icon to X
    const icon = menuBtn.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    
    if (!menuBtn || !navLinks) return;
    
    navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    menuBtn.classList.remove('active');
    
    // Change icon back to bars
    const icon = menuBtn.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Enhanced Header Scroll Effect
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
}

// Scroll to Top Functionality
function handleScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }
}

function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Enhanced Animation System
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.about-content, .skill-card, .project-card, .timeline-item, .contact-container, .contact-info, .contact-form'
    );
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = `all 0.8s ease ${index * 0.1}s`;
    });
}

// Enhanced Animation on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll(
        '.about-content, .skill-card, .project-card, .timeline-item, .contact-container, .contact-info, .contact-form, .professional-header'
    );
    
    elements.forEach(element => {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Keyboard Navigation Support
function initKeyboardNavigation() {
    // Tab navigation for menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const menuBtn = document.getElementById('menuBtn');
            const navLinks = document.getElementById('navLinks');
            
            if (navLinks && navLinks.classList.contains('active')) {
                const focusableElements = navLinks.querySelectorAll('a');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Open Sans', sans-serif;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Page Load Animation
function initPageLoadAnimation() {
    // Add fade-in effect to main content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const debouncedAnimateOnScroll = debounce(animateOnScroll, 10);
const debouncedHeaderScroll = debounce(handleHeaderScroll, 10);

// Replace the scroll event listener with debounced versions for better performance
window.addEventListener('scroll', () => {
    debouncedHeaderScroll();
    handleScrollToTop();
    debouncedAnimateOnScroll();
});

// Error handling for failed section loads
window.addEventListener('error', function(e) {
    console.error('Page error:', e.error);
});

// Add loading indicator for sections
function showLoadingIndicator(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #666;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Loading...</p>
            </div>
        `;
    }
}

// Enhanced section loading with loading indicators
function loadSection(sectionId, url) {
    showLoadingIndicator(sectionId);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(sectionId).innerHTML = data;
            // Initialize animations after content loads
            setTimeout(() => {
                animateOnScroll();
            }, 100);
        })
        .catch(error => {
            console.error(`Error loading ${url}:`, error);
            document.getElementById(sectionId).innerHTML = `
                <div style="text-align: center; padding: 50px; color: #f44336;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Failed to load section. Please refresh the page.</p>
                </div>
            `;
        });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded successfully!');
});
