const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.getElementById('main-header');
const cartButton = document.getElementById('cart-button');
const mobileCartButton = document.getElementById('mobile-cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const continueShoppingBtn = document.getElementById('continue-shopping');
const clearCartBtn = document.getElementById('clear-cart');
const cartItems = document.getElementById('cart-items');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartFooter = document.getElementById('cart-footer');
const subtotalAmount = document.getElementById('subtotal-amount');
const cartCount = document.querySelectorAll('.cart-count');
const bestSellersContainer = document.getElementById('best-sellers-container');
const recommendedContainer = document.getElementById('recommended-container');
const bestSellersPrev = document.getElementById('best-sellers-prev');
const bestSellersNext = document.getElementById('best-sellers-next');
const recommendedPrev = document.getElementById('recommended-prev');
const recommendedNext = document.getElementById('recommended-next');
const currentYear = document.getElementById('current-year');

// Initialize current year in footer
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Mobile Menu Toggle
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Scroll Header Effect
window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.initListeners();
        this.updateCartUI();
    }

    initListeners() {
        // Cart toggle
        if (cartButton) cartButton.addEventListener('click', () => this.toggleCart());
        if (mobileCartButton) mobileCartButton.addEventListener('click', () => this.toggleCart());
        if (closeCart) closeCart.addEventListener('click', () => this.toggleCart());
        if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', () => this.toggleCart());
        
        // Clear cart
        if (clearCartBtn) clearCartBtn.addEventListener('click', () => this.clearCart());
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productData = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseFloat(e.target.dataset.price),
                    image: e.target.dataset.image,
                    quantity: 1
                };
                
                this.addToCart(productData);
                this.showAddedFeedback(button);
            });
        });
        
        // Close cart when clicking outside
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    this.toggleCart();
                }
            });
        }
        
        // Prevent scrolling when cart is open
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cartModal && cartModal.classList.contains('active')) {
                this.toggleCart();
            }
        });
    }
    
    toggleCart() {
        if (cartModal) {
            cartModal.classList.toggle('active');
            document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
        }
    }
    
    addToCart(product) {
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            this.items[existingItemIndex].quantity += 1;
        } else {
            this.items.push(product);
        }
        
        this.saveCart();
        this.updateCartUI();
    }
    
    removeFromCart(productId) {
        const existingItemIndex = this.items.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            if (this.items[existingItemIndex].quantity > 1) {
                this.items[existingItemIndex].quantity -= 1;
            } else {
                this.items.splice(existingItemIndex, 1);
            }
            
            this.saveCart();
            this.updateCartUI();
        }
    }
    
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    updateCartUI() {
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count badges
        cartCount.forEach(badge => {
            badge.textContent = totalItems;
        });
        
        // Update cart items list
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.items.length === 0) {
                if (emptyCartMessage) emptyCartMessage.style.display = 'flex';
                if (cartFooter) cartFooter.style.display = 'none';
            } else {
                if (emptyCartMessage) emptyCartMessage.style.display = 'none';
                if (cartFooter) cartFooter.style.display = 'block';
                
                this.items.forEach(item => {
                    const li = document.createElement('li');
                    li.classList.add('cart-item');
                    
                    li.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                            <div class="cart-item-controls">
                                <div class="quantity-controls">
                                    <button class="quantity-button decrease" data-id="${item.id}">
                                        <i class="icon-minus"></i>
                                    </button>
                                    <span class="quantity-display">${item.quantity}</span>
                                    <button class="quantity-button increase" data-id="${item.id}">
                                        <i class="icon-plus"></i>
                                    </button>
                                </div>
                                <div class="cart-item-total">
                                    ${this.formatPrice(item.price * item.quantity)}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    cartItems.appendChild(li);
                    
                    // Add event listeners to quantity buttons
                    li.querySelector('.decrease').addEventListener('click', () => {
                        this.removeFromCart(item.id);
                    });
                    
                    li.querySelector('.increase').addEventListener('click', () => {
                        this.addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            quantity: 1
                        });
                    });
                });
            }
        }
        
        // Update subtotal
        if (subtotalAmount) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            subtotalAmount.textContent = this.formatPrice(total);
        }
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    }
    
    showAddedFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="icon-check"></i><span>Added</span>';
        button.classList.add('added');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('added');
        }, 1500);
    }
}

// Horizontal Scroll Controls
function initScrollControls(container, prevButton, nextButton) {
    if (!container || !prevButton || !nextButton) return;
    
    const checkScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        
        prevButton.disabled = scrollLeft <= 0;
        nextButton.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
    };
    
    const scroll = (direction) => {
        const scrollAmount = container.clientWidth * 0.8;
        const targetScrollLeft = direction === 'left' 
            ? container.scrollLeft - scrollAmount 
            : container.scrollLeft + scrollAmount;
        
        container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
    };
    
    prevButton.addEventListener('click', () => scroll('left'));
    nextButton.addEventListener('click', () => scroll('right'));
    container.addEventListener('scroll', checkScroll);
    
    // Initial check
    checkScroll();
    
    // Also check on window resize
    window.addEventListener('resize', checkScroll);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize shopping cart
    const cart = new ShoppingCart();
    
    // Initialize horizontal scroll controls
    initScrollControls(bestSellersContainer, bestSellersPrev, bestSellersNext);
    initScrollControls(recommendedContainer, recommendedPrev, recommendedNext);
    
    // Smooth scroll to top when the page loads
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Image loading animation
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
    
    // Animate sections on scroll
    const observeElements = document.querySelectorAll('.info-box, .product-card, .info-box-container, .category-buttons');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observeElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Handle the 404 page if it exists
if (document.querySelector('.not-found')) {
    console.error('404 Error: User attempted to access non-existent route:', window.location.pathname);
}