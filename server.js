
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const frontendDir = path.resolve(__dirname, "..");

// Middleware
app.use(cors());
app.use(express.json());

// Order storage file
const ordersFile = path.join(__dirname, "orders.json");

// Product data
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

// Create orders file if it doesn't exist
if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, "[]");
}

// Read saved orders
function readOrders() {
    return JSON.parse(fs.readFileSync(ordersFile, "utf8"));
}

// Save orders
function saveOrders(orders) {
    fs.writeFileSync(
        ordersFile,
        JSON.stringify(orders, null, 2)
    );
}

// Serve the frontend from the same origin as the API.
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(frontendDir, "style.css"));
});

app.get("/script.js", (req, res) => {
    res.sendFile(path.join(frontendDir, "script.js"));
});

// Get all products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// Get a single product
app.get("/api/products/:id", (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// Create an order
app.post("/api/orders", (req, res) => {

    const { name, email, phone, address, payment, items } = req.body;

    // Validate customer details
    if (!name || !email || !phone || !address || !payment) {
        return res.status(400).json({
            message: "All customer details are required"
        });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            message: "Order must contain products"
        });
    }

    // Validate each cart item using server product data
    const orderItems = [];

    for (const item of items) {

        const product = products.find(
            p => p.id === Number(item.id)
        );

        const quantity = Number(item.quantity);

        if (!product || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Invalid product or quantity"
            });
        }

        orderItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    // Calculate price on the server
    const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const orders = readOrders();

    const order = {
        orderId: Date.now(),
        name,
        email,
        phone,
        address,
        payment,
        items: orderItems,
        total,
        createdAt: new Date().toISOString()
    };

    orders.push(order);

    saveOrders(orders);

    res.status(201).json({
        message: "Order placed successfully",
        orderId: order.orderId,
        total: order.total
    });
});

// Get all orders (demo/admin endpoint)
app.get("/api/orders", (req, res) => {
    res.json(readOrders());
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
