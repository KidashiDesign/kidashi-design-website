// ============================================
// SHOP PAGE FUNCTIONALITY
// ============================================

let currentFilters = {
    categories: ['all'],
    maxPrice: 2000,
    sortBy: 'featured'
};

/**
 * Render products based on current filters
 */
function renderShopProducts() {
    const container = document.getElementById('shopProducts');

    if (!container) return;

    let products = getProducts();

    // Apply category filter
    if (!currentFilters.categories.includes('all')) {
        products = products.filter(p =>
            currentFilters.categories.includes(p.category)
        );
    }

    // Apply price filter
    products = filterByPrice(products, currentFilters.maxPrice);

    // Apply sorting
    products = sortProducts(products, currentFilters.sortBy);

    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px;">
                <h3>No products found</h3>
                <p style="color: #6b7280; margin-top: 10px;">Try adjusting your filters</p>
            </div>
        `;
        return;
    }

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
 * Initialize category filters
 */
function initCategoryFilters() {
    const checkboxes = document.querySelectorAll('.filter-group:first-of-type .checkbox input');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.value === 'all') {
                // If "all" is selected, deselect others
                if (e.target.checked) {
                    checkboxes.forEach(cb => {
                        if (cb.value !== 'all') cb.checked = false;
                    });
                    currentFilters.categories = ['all'];
                }
            } else {
                // Uncheck "all" if any other category is selected
                const allCheckbox = Array.from(checkboxes).find(cb => cb.value === 'all');
                if (allCheckbox && e.target.checked) {
                    allCheckbox.checked = false;

                    // Get all selected categories
                    currentFilters.categories = Array.from(checkboxes)
                        .filter(cb => cb.checked && cb.value !== 'all')
                        .map(cb => cb.value);
                }
            }

            // If no category is selected, select "all"
            if (currentFilters.categories.length === 0) {
                const allCheckbox = Array.from(checkboxes).find(cb => cb.value === 'all');
                if (allCheckbox) allCheckbox.checked = true;
                currentFilters.categories = ['all'];
            }

            renderShopProducts();
        });
    });
}

/**
 * Initialize price range filter
 */
function initPriceFilter() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (!priceRange || !priceValue) return;

    priceRange.addEventListener('input', (e) => {
        const value = e.target.value;
        priceValue.textContent = value;
        currentFilters.maxPrice = parseInt(value);
        renderShopProducts();
    });
}

/**
 * Initialize sort functionality
 */
function initSortBy() {
    const sortSelect = document.getElementById('sortBy');

    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
        currentFilters.sortBy = e.target.value;
        renderShopProducts();
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.search-input');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;

        if (query.length === 0) {
            renderShopProducts();
            return;
        }

        const results = searchProducts(query);
        const container = document.getElementById('shopProducts');

        container.innerHTML = results.map(product => `
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

        initBlurHoverAnimations();
    });
}

/**
 * Get URL parameters
 */
function getURLParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

/**
 * Handle URL parameters (e.g., ?category=audio)
 */
function handleURLParameters() {
    const categoryParam = getURLParameter('category');

    if (categoryParam && categoryParam !== 'all') {
        currentFilters.categories = [categoryParam];

        // Update checkbox
        const checkbox = document.querySelector(`input[value="${categoryParam}"]`);
        if (checkbox) {
            checkbox.checked = true;

            // Uncheck "all"
            const allCheckbox = document.querySelector('input[value="all"]');
            if (allCheckbox) allCheckbox.checked = false;
        }
    }
}

/**
 * Initialize all shop filters and functionality
 */
function initializeShop() {
    renderShopProducts();
    initCategoryFilters();
    initPriceFilter();
    initSortBy();
    initSearch();
    handleURLParameters();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShop);
} else {
    initializeShop();
}
