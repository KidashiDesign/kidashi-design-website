# Commerce X - Premium Tech Shop

A modern, responsive e-commerce website for high-quality tech gadgets and accessories with elegant blur-hover animations and full product management functionality.

## Features

### 🎨 Design & Animations
- **Blur-to-Focus Effect**: Products are blurred by default; hover to see them clearly
- **Smooth Animations**: Staggered product load, parallax effects, and smooth transitions
- **Responsive Design**: Mobile-first approach, optimized for all screen sizes
- **Modern UI**: Clean, minimal design focused on product presentation

### 🛍️ E-Commerce Functionality
- **Product Catalog**: Browse all tech products with categories and filtering
- **Advanced Filtering**: Filter by category and price range
- **Search**: Real-time product search functionality
- **Sorting**: Sort by price, newest, or featured products
- **Product Details**: Comprehensive product pages with specs and related items
- **Shopping Cart**: Add products to cart with localStorage persistence

### 🎯 Pages
- **Home/Landing**: Hero section with featured products
- **Shop**: Full product catalog with filters
- **Product Detail**: Detailed product information with images and specifications
- **Contact**: Contact form and support information
- **Upload**: Product photo upload interface for admins

### 💾 Data Management
- **localStorage**: Persistent storage for cart, products, and user data
- **Product Upload**: Admin interface to add custom products with photos
- **Analytics**: Track page views, product clicks, and cart events

## File Structure

```
shop/
├── index.html              # Landing page
├── shop.html              # Shop/catalog page
├── contact.html           # Contact page
├── pages/
│   └── product.html       # Product detail page
├── uploads/
│   └── upload.html        # Product upload interface
├── css/
│   ├── styles.css         # Main stylesheet
│   └── animations.css     # Animation effects
├── js/
│   ├── products.js        # Product database & functions
│   ├── animations.js      # Animation initialization
│   ├── main.js            # Landing page functionality
│   ├── shop.js            # Shop page filters/sorting
│   └── product-detail.js  # Product detail page
└── README.md
```

## Usage

### Viewing the Shop
1. Open `index.html` in a web browser
2. Browse products on the landing page or navigate to `/shop`
3. Use filters to narrow down products
4. Click on any product to view details
5. Add products to cart

### Adding Products
1. Go to `/uploads/upload.html`
2. Drag and drop or select product images (PNG recommended for transparency)
3. Fill in product details (name, category, price, description)
4. Click "Save Product"
5. Products appear in your shop immediately

### Viewing Analytics
Analytics data is stored in localStorage:
- `pageViews`: Track of visited pages
- `productClicks`: Count of product card clicks
- `cartEvents`: Track of items added to cart
- `subscribers`: Newsletter email subscribers
- `contacts`: Contact form submissions

## Animation Details

### Blur-Hover Effect
- **Default State**: Products display with 8px blur filter and 0.6 opacity
- **Hover State**: Blur effect clears (0px) and opacity becomes 1 (full clarity)
- **Mobile**: Touch events trigger the same effect
- **Timing**: 0.4s cubic-bezier animation for smooth transition

### Staggered Product Load
Products appear one by one with a 0.1s delay between each item, creating a wave effect from left to right.

### Smooth Scroll
All anchor links implement smooth scroll behavior with 0.3s duration.

## Customization

### Changing Product Data
Edit `js/products.js` to modify the `PRODUCTS` array:
```javascript
{
    id: 1,
    name: "Product Name",
    category: "technology",
    price: 59.99,
    // ... other properties
}
```

### Adjusting Blur Values
In `css/animations.css`, modify the blur amount:
```css
.product-image img {
    filter: blur(8px);  /* Change 8px to desired value */
}
```

### Changing Animation Speed
Modify transition durations in `css/animations.css`:
```css
transition: filter 0.4s ease;  /* Change 0.4s to desired speed */
```

## Features

### Product Upload
- Upload transparent PNG images
- Auto-save to localStorage
- Instant product availability
- Support for multiple images per product

### Shopping Cart
- Add/remove items
- Persist across browser sessions
- Track cart events for analytics

### Contact Form
- Save inquiries to localStorage
- Email validation
- Subject categorization

### Newsletter
- Email subscription tracking
- Unique email validation
- 10% discount code incentive

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Lazy loading for images
- Efficient CSS animations
- Optimized localStorage usage
- Minimal JavaScript bundle

## Future Enhancements
- [ ] Real backend integration
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Email notifications
- [ ] User accounts
- [ ] Wishlist functionality
- [ ] Product reviews system
- [ ] Admin dashboard
- [ ] Order tracking

## License
Commerce X © 2024. All rights reserved.

## Support
For questions or issues, use the contact form on `/contact.html`
