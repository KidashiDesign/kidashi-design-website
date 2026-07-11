// ============================================
// PRODUCT DETAIL PAGE
// ============================================

let currentProduct = null;
let selectedQuantity = 1;

/**
 * Get product ID from URL
 */
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Render product details
 */
function renderProductDetails() {
    const productId = getProductIdFromURL();

    if (!productId) {
        window.location.href = '../shop.html';
        return;
    }

    currentProduct = getProductById(productId);

    if (!currentProduct) {
        window.location.href = '../shop.html';
        return;
    }

    // Update breadcrumb
    const breadcrumbName = document.getElementById('breadcrumbName');
    if (breadcrumbName) {
        breadcrumbName.textContent = currentProduct.name;
    }

    // Update main image
    const mainImage = document.getElementById('productImage');
    if (mainImage) {
        mainImage.src = currentProduct.image;
        mainImage.alt = currentProduct.name;
    }

    // Update product info
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
    document.getElementById('productOriginalPrice').textContent = `$${currentProduct.originalPrice.toFixed(2)}`;
    document.getElementById('productDescription').textContent = currentProduct.description;

    // Update specs
    document.getElementById('specBrand').textContent = currentProduct.brand;
    document.getElementById('specSize').textContent = currentProduct.size;
    document.getElementById('specWeight').textContent = currentProduct.weight;

    // Update detailed specs
    document.getElementById('specDimensions').textContent = currentProduct.specs.dimensions;
    document.getElementById('specWeightDetail').textContent = currentProduct.specs.weight;
    document.getElementById('specMaterial').textContent = currentProduct.specs.material;

    // Update detail description
    document.getElementById('detailDescription').textContent = currentProduct.fullDescription;

    // Update features list
    const featuresList = document.getElementById('featuresList');
    if (featuresList) {
        featuresList.innerHTML = currentProduct.features
            .map(feature => `<li>${feature}</li>`)
            .join('');
    }

    // Render thumbnails
    renderThumbnails();

    // Render related products
    renderRelatedProducts();

    // Initialize interactions
    initProductInteractions();
}

/**
 * Render thumbnail images
 */
function renderThumbnails() {
    const thumbnailsContainer = document.getElementById('thumbnails');

    if (!thumbnailsContainer) return;

    const images = currentProduct.images || [currentProduct.image];

    thumbnailsContainer.innerHTML = images.map((img, index) => `
        <div class="thumbnail" onclick="updateMainImage('${img}')">
            <img src="${img}" alt="Product view ${index + 1}">
        </div>
    `).join('');
}

/**
 * Update main product image
 */
function updateMainImage(imageUrl) {
    const mainImage = document.getElementById('productImage');
    if (mainImage) {
        mainImage.src = imageUrl;
        mainImage.style.filter = 'blur(0px)';
        mainImage.style.opacity = '1';
    }

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.style.borderColor = 'transparent';
    });

    event.target.closest('.thumbnail').style.borderColor = '#2563eb';
}

/**
 * Render related products
 */
function renderRelatedProducts() {
    const container = document.getElementById('relatedProducts');

    if (!container) return;

    const allProducts = getProducts();
    const related = allProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    container.innerHTML = related.map(product => `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
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

    initBlurHoverAnimations();
}

/**
 * Initialize product interactions (quantity, add to cart, etc)
 */
function initProductInteractions() {
    // Quantity controls
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            if (current > 1) {
                quantityInput.value = current - 1;
                selectedQuantity = current - 1;
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            quantityInput.value = current + 1;
            selectedQuantity = current + 1;
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('change', () => {
            const value = parseInt(quantityInput.value);
            if (value < 1) quantityInput.value = 1;
            selectedQuantity = parseInt(quantityInput.value);
        });
    }

    // Add to cart button
    const addToCartBtn = document.querySelector('.btn-primary.btn-lg');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }

    // Initialize tabs
    initProductTabs();
}

/**
 * Add product to cart
 */
function addToCart() {
    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: selectedQuantity,
        image: currentProduct.image,
        addedAt: new Date().toISOString()
    };

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === currentProduct.id);

    if (existingItem) {
        existingItem.quantity += selectedQuantity;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Show confirmation
    showNotification(`✓ Added ${selectedQuantity} ${currentProduct.name} to cart!`);

    // Log event
    trackAddToCart(currentProduct, selectedQuantity);
}

/**
 * Track add to cart event
 */
function trackAddToCart(product, quantity) {
    let cartEvents = JSON.parse(localStorage.getItem('cartEvents') || '[]');
    cartEvents.push({
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        price: product.price,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('cartEvents', JSON.stringify(cartEvents));
}

/**
 * Show notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 6px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.4s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

/**
 * Initialize product tabs
 */
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Hide all tabs
            tabContents.forEach(tab => tab.style.display = 'none');

            // Activate clicked button
            button.classList.add('active');

            // Show corresponding tab
            const tabName = button.getAttribute('data-tab');
            const tabContent = document.getElementById(tabName);
            if (tabContent) {
                tabContent.style.display = 'block';
                tabContent.style.animation = 'fadeIn 0.5s ease';
            }
        });
    });
}

/**
 * Initialize page
 */
function initializeProductDetail() {
    renderProductDetails();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProductDetail);
} else {
    initializeProductDetail();
}
