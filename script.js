
// Product Database

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        price: 1999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 4,
        name: "Backpack",
        category: "Accessories",
        price: 999,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    },
    {
        id: 5,
        name: "Camera",
        category: "Electronics",
        price: 12999,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"
    },
    {
        id: 6,
        name: "Sunglasses",
        category: "Accessories",
        price: 799,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    }
];

// Shopping Cart

let cart = [];

// Display Products

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

// Add Product to Cart

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

// Update Cart

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

// Change Quantity

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

// Remove Product

function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();
}

// Show / Hide Cart

function toggleCart() {

    const section = document.getElementById("cartSection");

    section.style.display =
        section.style.display === "block" ? "none" : "block";

    updateCart();
}

// Checkout

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

// Place Order

document.getElementById("checkoutForm").addEventListener(
    "submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const name =
            document.getElementById("customerName").value;

        const total =
            document.getElementById("total").textContent;

        const payment =
            document.getElementById("payment").value;

        alert(
            "Order Placed Successfully!\n\n" +
            "Customer: " + name +
            "\nTotal Amount: ₹" + total +
            "\nPayment: " + payment +
            "\nThank you for shopping with ShopEase!"
        );

        cart = [];

        updateCart();

        document.getElementById("checkoutForm").reset();

        document.getElementById("checkout").style.display = "none";

        document.getElementById("cartSection").style.display = "none";

    }
);

// Search and Category Events

document.getElementById("search").addEventListener(
    "input", displayProducts
);

document.getElementById("category").addEventListener(
    "change", displayProducts
);

// Initial Display

displayProducts();
