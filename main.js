// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (menuBtn.querySelector('i').classList.contains('fa-bars')) {
            menuBtn.querySelector('i').classList.remove('fa-bars');
            menuBtn.querySelector('i').classList.add('fa-times');
        } else {
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        }
    });
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuBtn) {
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
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
document.querySelector('.scroll-top')?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.about-content, .skill-card, .project-card, .timeline-item, .contact-container');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animated elements
document.querySelectorAll('.about-content, .skill-card, .project-card, .timeline-item, .contact-container').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'all 0.8s ease';
});

// Animate elements when page loads
window.addEventListener('load', animateOnScroll);

// Animate elements when scrolling
window.addEventListener('scroll', animateOnScroll);
