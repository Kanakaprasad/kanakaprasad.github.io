// Main application logic

document.addEventListener('DOMContentLoaded', () => {
    // Load content into sections dynamically
    const sectionsToLoad = [
        { id: 'about', url: 'about.html' },
        { id: 'skills', url: 'skills.html' },
        { id: 'projects', url: 'projects.html' },
        { id: 'experience', url: 'experience.html' },
        { id: 'contact', url: 'contact.html' }
    ];

    // Initialize core functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollToTop();
    initIntersectionObserver();

    // Load all sections
    Promise.all(sectionsToLoad.map(section => loadSection(section.id, section.url)))
        .then(() => {
            // Once all sections are loaded, initialize forms and re-trigger observer
            initContactForm();
            refreshIntersectionObserver();
        })
        .catch(error => console.error("Error loading sections:", error));
});

/**
 * Load HTML content into a specific section
 */
async function loadSection(sectionId, url) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.text();
        
        section.innerHTML = data;
    } catch (error) {
        console.error(`Failed to load ${url}:`, error);
        section.innerHTML = `
            <div class="container text-center">
                <p>Failed to load section. Please refresh the page.</p>
            </div>
        `;
    }
}

/**
 * Intersection Observer for scroll animations
 */
let observer;

function initIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                
                // Trigger count up if applicable
                if (entry.target.classList.contains('count-up-trigger') && !entry.target.classList.contains('counted')) {
                    startCountUp(entry.target);
                    entry.target.classList.add('counted');
                }
            }
        });
    }, options);

    observeElements();
}

function observeElements() {
    const hiddenElements = document.querySelectorAll('.animate-hidden, .count-up-trigger');
    hiddenElements.forEach(el => observer.observe(el));
}

function refreshIntersectionObserver() {
    if (observer) {
        observer.disconnect();
        observeElements();
    }
}

/**
 * Number counting animation for statistics
 */
function startCountUp(container) {
    const counters = container.querySelectorAll('.stat-value-count');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isFloat = counter.getAttribute('data-target').includes('.');
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            const currentVal = target * easeProgress;
            
            if (isFloat) {
                counter.innerText = currentVal.toFixed(1);
            } else {
                counter.innerText = Math.floor(currentVal);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + (isFloat && target % 1 === 0 ? '.0' : '');
            }
        }
        
        requestAnimationFrame(updateCount);
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const links = navLinks?.querySelectorAll('a');

    if (!menuBtn || !navLinks || !navOverlay) return;

    const toggleMenu = () => {
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        } else {
            navLinks.classList.add('active');
            navOverlay.classList.add('active');
            menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        }
    };

    menuBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    links?.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 70;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll to Top Button & Header Scroll state & Scroll Spy
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY;

        // Header background styling on scroll
        if (currentScroll > 50) {
            header?.style.setProperty('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');
        } else {
            header?.style.setProperty('box-shadow', 'none');
        }

        // Scroll to top button visibility
        if (currentScroll > 500) {
            scrollTopBtn?.classList.add('active');
        } else {
            scrollTopBtn?.classList.remove('active');
        }

        // Active Navigation Scroll Spy
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (currentScroll >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active-nav');
            }
        });
    });

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Contact Form Handler (Formspree)
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const button = form.querySelector('button[type="submit"]');
        if (!button) return;
        
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Sending...</span> <i class="fas fa-circle-notch fa-spin"></i>';
        button.disabled = true;
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                alert('Thank you! Your message has been sent successfully.');
                form.reset();
            } else {
                alert('Oops! There was a problem submitting your form. Please try again.');
            }
        } catch (error) {
            console.error("Form submission error:", error);
            alert('Oops! There was a network problem. Please try again.');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}
