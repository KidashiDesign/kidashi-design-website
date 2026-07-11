// ============================================
// MAIN JAVASCRIPT - LANDING PAGE
// ============================================

/**
 * Render featured products on landing page
 */
function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');

    if (!container) return;

    const products = getProducts().slice(0, 6);

    container.innerHTML = products.map(product => `
        <a href="pages/product.html?id=${product.id}" class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-rating">
                    <span class="stars">★★★★★</span>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    $${product.price.toFixed(2)}
                    <span class="product-original-price">$${product.originalPrice.toFixed(2)}</span>
                </div>
            </div>
        </a>
    `).join('');

    // Re-initialize animations for new elements
    initBlurHoverAnimations();
}

/**
 * Handle newsletter signup
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value;

        if (email) {
            // Save to localStorage
            let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('subscribers', JSON.stringify(subscribers));
            }

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'form-message success';
            successMsg.textContent = `✓ Thank you! Check your email for a 10% discount code.`;
            form.replaceWith(successMsg);

            setTimeout(() => {
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'translateY(10px)';
            }, 3000);
        }
    });
}

/**
 * Handle contact form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(formData);
        localStorage.setItem('contacts', JSON.stringify(contacts));

        // Show success message
        const messageDiv = document.getElementById('formMessage');
        messageDiv.className = 'form-message success';
        messageDiv.textContent = '✓ Thank you for your message! We\'ll get back to you soon.';
        messageDiv.style.display = 'block';

        form.reset();

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    });
}

/**
 * Initialize page based on location
 */
function initializePage() {
    renderFeaturedProducts();
    initNewsletterForm();
    initContactForm();
}

/**
 * Setup analytics tracking
 */
function setupAnalytics() {
    // Track page view
    const pageViewed = {
        path: window.location.pathname,
        timestamp: new Date().toISOString()
    };

    let pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
    pageViews.push(pageViewed);

    // Keep only last 100 views
    if (pageViews.length > 100) {
        pageViews = pageViews.slice(-100);
    }

    localStorage.setItem('pageViews', JSON.stringify(pageViews));
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

/**
 * Handle product card click tracking
 */
function trackProductClicks() {
    document.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');

        if (productCard) {
            const productName = productCard.querySelector('.product-name')?.textContent;
            const productId = productCard.href.split('id=')[1];

            if (productName) {
                let clicks = JSON.parse(localStorage.getItem('productClicks') || '{}');
                clicks[productId] = (clicks[productId] || 0) + 1;
                localStorage.setItem('productClicks', JSON.stringify(clicks));
            }
        }
    });
}

/**
 * Initialize everything on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setupAnalytics();
    trackProductClicks();
});

/**
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', () => {
    // Could trigger responsive layout adjustments
});

/**
 * Handle online/offline status
 */
window.addEventListener('online', () => {
    console.log('Back online');
});

window.addEventListener('offline', () => {
    console.log('You are offline');
});
