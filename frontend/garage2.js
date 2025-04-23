// Get references to cart elements
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartLink = document.getElementById("cart-link");
const closeCartBtn = document.getElementById("close-cart");
const orderButton = document.getElementById("order-button");

// Function to get user-specific cart key
function getUserCartKey() {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    return user ? `cart_${user._id}` : "cart";
}

// Load cart from local storage or initialize an empty cart
let cart = JSON.parse(localStorage.getItem(getUserCartKey())) || [];

// Function to toggle cart open state
function toggleCartOpen(isOpen) {
    if (isOpen) {
        cartModal.classList.add("show-cart");
        document.body.classList.add("cart-open");
    } else {
        cartModal.classList.remove("show-cart");
        document.body.classList.remove("cart-open");
    }
}

// Open cart function
cartLink.addEventListener("click", (event) => {
    event.preventDefault();
    toggleCartOpen(true);
    updateCartUI();
});

// Close cart function
closeCartBtn.addEventListener("click", () => {
    toggleCartOpen(false);
});

// Close cart when clicking outside
document.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        toggleCartOpen(false);
    }
});

// Function to save cart to local storage
function saveCart() {
    localStorage.setItem(getUserCartKey(), JSON.stringify(cart));
}

// Function to add items to cart
function addToCart(productName, productPrice, productImage) {
    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    toggleCartOpen(true);
}

// Function to remove items from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// Function to update the cart UI
function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your Cart is empty</p>";
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement("li");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="product-details">
                    <div class="product-name">${item.name}</div>
                    <div class="product-price">₹${item.price}</div>
                </div>
                <div class="controls">
                    <div class="quantity-controls">
                        <button class="decrease-btn" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-btn" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartLink.innerHTML = `<img src="images/zCart.png" alt="Cart" height="20px">Cart (${totalItems})`;

    // Update total price and show "Order" button
    updateTotalPrice();
}

function updateTotalPrice() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartFooter = document.getElementById("cart-footer");

    cartFooter.innerHTML = "";

    if (cart.length > 0) {
        const priceElement = document.createElement("p");
        priceElement.id = "total-price";
        priceElement.innerText = `Total: ₹${total.toFixed(2)}`;
        cartFooter.appendChild(priceElement);

        const orderBtn = document.createElement("button");
        orderBtn.id = "order-button";
        orderBtn.innerText = "Order Now";
        orderBtn.addEventListener("click", () => {
            // Save cart items to localStorage for the payment page
            localStorage.setItem("cartItems", JSON.stringify(cart));
            // Redirect to payment page
            window.location.href = "payment.html";
        });
        cartFooter.appendChild(orderBtn);
    }
}

// Attach event listeners to "Add to Cart" buttons
document.querySelectorAll(".cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const productBox = button.parentElement;
        const productName = productBox.querySelector("h5").innerText;
        const productPrice = productBox.querySelector(".product-price")?.innerText.replace("₹", "").trim() || "0";
        const productImage = productBox.querySelector("img").src;

        addToCart(productName, productPrice, productImage);
    });
});

// Attach event listeners to quantity controls
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("decrease-btn")) {
        const index = event.target.getAttribute("data-index");
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
    } else if (event.target.classList.contains("increase-btn")) {
        const index = event.target.getAttribute("data-index");
        cart[index].quantity += 1;
        saveCart();
        updateCartUI();
    } else if (event.target.classList.contains("remove-btn")) {
        const index = event.target.getAttribute("data-index");
        removeFromCart(index);
    }
});

