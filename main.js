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
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = document.querySelector('.menu-btn i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks) navLinks.classList.remove('active');
            const icon = document.querySelector('.menu-btn i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const scrollTopBtn = document.querySelector('.scroll-top');
        
        if (header && window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            header.style.background = 'rgba(19, 26, 34, 0.95)';
        } else if (header) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.background = 'var(--primary)';
        }
        
        // Show/hide scroll to top button
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        }
    });
    
    // Scroll to top functionality
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Set initial styles for animated elements
    const animatedElements = document.querySelectorAll('.about-content, .skill-card, .project-card, .timeline-item, .contact-container');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s ease';
    });
    
    // Initial animation check
    animateOnScroll();
    
    // Animate elements when scrolling
    window.addEventListener('scroll', animateOnScroll);
}

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.about-content, .skill-card, .project-card, .timeline-item, .contact-container');
    
    elements.forEach(element => {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}
