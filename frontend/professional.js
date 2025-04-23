// Cart functionality
const cartLink = document.querySelector('.cart-link');
const cartModal = document.querySelector('.cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const orderButton = document.getElementById('order-button');

let cart = [];

// Toggle cart visibility
function toggleCart(isOpen) {
    cartModal.classList.toggle('show-cart', isOpen);
}

// Add event listeners for cart
cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleCart(true);
});

closeCartBtn.addEventListener('click', () => {
    toggleCart(false);
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        toggleCart(false);
    }
});

// Add to cart functionality
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="product-details">
                <div class="product-name">${item.name}</div>
                <div class="product-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="controls">
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(li);
    });
    
    totalPrice.innerHTML = `
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
    `;
    
    // Update cart count
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Update item quantity
function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(id);
        return;
    }
    
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Place order
orderButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Here you would typically send the order to a server
    alert('Order placed successfully!');
    cart = [];
    updateCart();
    toggleCart(false);
});

// Search functionality
const searchForm = document.querySelector('.search-bar');
const searchInput = searchForm.querySelector('input');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    
    // Here you would typically filter products based on the search query
    console.log('Searching for:', query);
});

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value.trim();
    
    if (email) {
        // Here you would typically send the email to a server
        alert('Thank you for subscribing!');
        newsletterForm.reset();
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Testimonial slider
const testimonialSlider = document.querySelector('.testimonial-slider');
let isDown = false;
let startX;
let scrollLeft;

testimonialSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    testimonialSlider.classList.add('active');
    startX = e.pageX - testimonialSlider.offsetLeft;
    scrollLeft = testimonialSlider.scrollLeft;
});

testimonialSlider.addEventListener('mouseleave', () => {
    isDown = false;
    testimonialSlider.classList.remove('active');
});

testimonialSlider.addEventListener('mouseup', () => {
    isDown = false;
    testimonialSlider.classList.remove('active');
});

testimonialSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - testimonialSlider.offsetLeft;
    const walk = (x - startX) * 2;
    testimonialSlider.scrollLeft = scrollLeft - walk;
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .category-card, .product-card, .testimonial-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
}); 