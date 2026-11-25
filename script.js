
const API_URL = "/api";

// Product list loaded from backend
let products = [];
let cart = [];

// Load products from backend
async function loadProducts() {

    try {

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        products = await response.json();

        displayProducts();

    } catch (error) {

        document.getElementById("products").innerHTML =
            "<p>Cannot connect to backend server.</p>";

        console.error(error);
    }
}

// Display products
function displayProducts() {

    const search = document.getElementById("search")
        .value.toLowerCase();

    const category = document.getElementById("category").value;

    const filtered = products.filter(product => {

        return product.name.toLowerCase().includes(search) &&
            (category === "All" ||
             product.category === category);

    });

    const container = document.getElementById("products");

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    filtered.forEach(product => {

        container.innerHTML += `
            <div class="product">

                <img src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='https://placehold.co/300x200?text=Product'">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p>${product.category}</p>

                    <div class="price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </div>

                    <button class="add-btn"
                        onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>
            </div>
        `;
    });
}

// Add to cart
function addToCart(id) {

    const item = cart.find(product => product.id === id);

    if (item) {
        item.quantity++;
    } else {

        const product = products.find(p => p.id === id);

        cart.push({...product, quantity: 1});
    }

    updateCart();
}

// Update cart
function updateCart() {

    const cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <strong>${item.name}</strong>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <div>

                    <button onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    ${item.quantity}

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                    <button class="remove"
                        onclick="removeItem(${item.id})">
                        Remove
                    </button>

                </div>
            </div>
        `;
    });

    document.getElementById("total").textContent =
        total.toLocaleString("en-IN");

    document.getElementById("cartCount").textContent = count;
}

// Change quantity
function changeQuantity(id, change) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeItem(id);
    } else {
        updateCart();
    }
}

// Remove item
function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();
}

// Toggle cart
function toggleCart() {

    const section = document.getElementById("cartSection");

    section.style.display =
        section.style.display === "block" ? "none" : "block";

    updateCart();
}

// Open checkout
function openCheckout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    document.getElementById("checkout").style.display = "block";

    document.getElementById("checkout").scrollIntoView({
        behavior: "smooth"
    });
}

// Submit order to backend
document.getElementById("checkoutForm").addEventListener(
    "submit", async function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const orderData = {

            name: document.getElementById("customerName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            payment: document.getElementById("payment").value,

            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))
        };

        try {

            const response = await fetch(`${API_URL}/orders`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(orderData)

            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Order failed");
            }

            alert(
                "Order placed successfully!\n" +
                "Order ID: " + result.orderId +
                "\nTotal: ₹" + result.total
            );

            cart = [];

            updateCart();

            document.getElementById("checkoutForm").reset();

            document.getElementById("checkout").style.display = "none";

            document.getElementById("cartSection").style.display = "none";

        } catch (error) {

            alert("Unable to place order: " + error.message);

            console.error(error);
        }
    }
);

// Search
document.getElementById("search").addEventListener(
    "input", displayProducts
);

// Category filter
document.getElementById("category").addEventListener(
    "change", displayProducts
);

// Load products when website starts
loadProducts();
