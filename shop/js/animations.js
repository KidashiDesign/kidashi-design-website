// ============================================
// BLUR & FOCUS ANIMATIONS
// ============================================

/**
 * Initialize blur-hover animations for product cards
 * By default, all product images are blurred
 * On hover, the image becomes sharp and clear
 */

function initBlurHoverAnimations() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const image = card.querySelector('.product-image img');

        if (!image) return;

        // Set initial blurred state
        image.style.filter = 'blur(8px)';
        image.style.opacity = '0.6';

        // Add hover listeners
        card.addEventListener('mouseenter', () => {
            clearBlur(image);
        });

        card.addEventListener('mouseleave', () => {
            applyBlur(image);
        });

        // Touch support for mobile
        card.addEventListener('touchstart', () => {
            clearBlur(image);
        });

        card.addEventListener('touchend', () => {
            applyBlur(image);
        });
    });
}

/**
 * Clear blur effect on image
 */
function clearBlur(image) {
    image.style.filter = 'blur(0px)';
    image.style.opacity = '1';
}

/**
 * Apply blur effect on image
 */
function applyBlur(image) {
    image.style.filter = 'blur(8px)';
    image.style.opacity = '0.6';
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

/**
 * Animate elements as they come into view
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });

    // Observe other elements
    document.querySelectorAll('.category-card, .article-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

/**
 * Add smooth scroll behavior to anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// REVEAL ANIMATIONS
// ============================================

/**
 * Staggered reveal animation for product grids
 */
function initStaggeredReveal() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((card, index) => {
        card.style.setProperty('--delay', `${index * 0.1}s`);
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================

/**
 * Add parallax effect to hero section
 */
function initParallax() {
    const heroPhone = document.querySelector('.hero-phone');

    if (!heroPhone) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const parallaxValue = scrollY * 0.5;

        heroPhone.style.transform = `translateY(${parallaxValue}px)`;
    });
}

// ============================================
// FADE ON SCROLL
// ============================================

/**
 * Fade out header on scroll
 */
function initHeaderFadeOnScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// ============================================
// HOVER LIFT EFFECT
// ============================================

/**
 * Add lift effect on hover for cards
 */
function initHoverLiftEffect() {
    const cards = document.querySelectorAll('.product-card, .category-card, .article-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ============================================
// RIPPLE EFFECT
// ============================================

/**
 * Add ripple effect to buttons
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');

            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================

/**
 * Animate numbers counting up
 */
function animateCounter(element, target, duration = 1000) {
    let current = 0;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// MOBILE MENU ANIMATION
// ============================================

/**
 * Initialize mobile menu animations
 */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all animations when DOM is ready
 */
function initializeAnimations() {
    initBlurHoverAnimations();
    initScrollAnimations();
    initSmoothScroll();
    initStaggeredReveal();
    initParallax();
    initHeaderFadeOnScroll();
    initHoverLiftEffect();
    initRippleEffect();
    initMobileMenu();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}

// Re-initialize animations after dynamic content load
window.addEventListener('contentLoaded', initializeAnimations);
