const API_URL = "https://shopverseultra.onrender.com/api";
const path = window.location.pathname;

// ================= UTILITY FUNCTIONS =================
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize navbar and cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    updateCartCount();
});
function logout(){
    localStorage.clear();
    alert("Logged out successfully");
    window.location.href = "login.html";
}
// ================= NAVBAR =================
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const authLink = document.getElementById("auth-link");
    const adminLink = document.getElementById("admin-link");

    if (!authLink || !adminLink) return;

    if (user) {
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.onclick = (e) => { e.preventDefault(); logout(); };
        authLink.innerHTML = '';
        authLink.appendChild(logoutLink);

        if (user.role === "ADMIN") {
            const adminLink_elem = document.createElement('a');
            adminLink_elem.href = "admin.html";
            adminLink_elem.textContent = 'Admin';
            adminLink.innerHTML = '';
            adminLink.appendChild(adminLink_elem);
        } else {
            adminLink.innerHTML = "";
        }
    } else {
        const loginLink = document.createElement('a');
        loginLink.href = "login.html";
        loginLink.textContent = 'Login';
        authLink.innerHTML = '';
        authLink.appendChild(loginLink);
        adminLink.innerHTML = "";
    }
    updateCartCount();
}



// ================= ADMIN =================
function checkAdminAccess(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
        alert("Login first!");
        window.location.href = "login.html";
        return;
    }

    if(user.role?.toUpperCase() !== "ADMIN"){
        alert("Access denied!");
        window.location.href = "user.html";
    }
}

function loadAdminName(){
    const user = JSON.parse(localStorage.getItem("user"));
    const el = document.getElementById("admin-name");

    if(el && user){
        el.innerText = user.name || "Admin";
    }
}

// ================= PRODUCTS =================
async function loadProducts(keyword = "") {

    const container = document.getElementById("product-list");
    if (!container) return;

    container.innerHTML = "Loading products...";

    let url = "https://shopverseultra.onrender.com/api/products";

    try {
        console.log("Fetching:", url);

        const res = await fetch(url);

        if (!res.ok) {
            console.error("API failed:", res.status);
            container.innerHTML = "Failed to load products";
            return;
        }

        let products = await res.json();

        if (!Array.isArray(products)) {
            console.error("Invalid response:", products);
            container.innerHTML = "Error loading products";
            return;
        }

        // 🔥 CLIENT SIDE SEARCH (IMPORTANT)
        if (keyword && keyword.trim() !== "") {
            products = products.filter(p =>
                p.name.toLowerCase().includes(keyword.toLowerCase())
            );
        }

        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = "No products found";
            return;
        }
products.forEach(p => {

    const safeImage = p.imageUrl && p.imageUrl.startsWith("http")
    ? p.imageUrl
    : "https://res.cloudinary.com/dc7udh4me/image/upload/v1/sample.jpg";
    const safeName = p.name || "No Name";

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
       <img src="${safeImage}" 
     onerror="this.src='https://res.cloudinary.com/dc7udh4me/image/upload/v1/sample.jpg'">
        <h3>${safeName}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id}); event.stopPropagation();">
            Add to Cart
        </button>
    `;

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        window.location.href = `product.html?id=${p.id}`;
    });

    container.appendChild(card);
});

    } catch (err) {
        console.error("Error:", err);
        container.innerHTML = "Server error";
    }
}

async function loadProductDetails() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    try {
        const res = await fetch(`https://shopverseultra.onrender.com/api/products/${id}`);
        if (!res.ok) {
            console.error("API failed:", res.status);
            return;
        }

        const product = await res.json();

        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-price").innerText = "₹" + product.price;
        document.getElementById("product-desc").innerText = product.description || "No description";
document.getElementById("product-image").src =
    product.imageUrl && product.imageUrl.startsWith("http")
        ? product.imageUrl
        : "https://res.cloudinary.com/dc7udh4me/image/upload/v1/sample.jpg";

        document.getElementById("add-to-cart-btn").onclick = function() {
            addToCart(product.id);
        };

    } catch (error) {
        console.error("Error loading product:", error);
    }
}

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}
let selectedCategory = "all";

function filterProducts(category) {
    selectedCategory = category;
    loadProducts();
}



async function loadAdminProducts(){
    const table = document.getElementById("admin-products-body");
    if(!table) return;

    // ✅ FIX: use table instead of container
    table.innerHTML = "<tr><td colspan='5'>Loading products...</td></tr>";

    const res = await authFetch(`${API_URL}/products`);
    if (!res.ok) {
        console.error("API failed:", res.status);
        return;
    }

    if (!res || !res.ok) {
    console.error("API failed:", res?.status);
    return;
}

const products = await res.json();

    table.innerHTML = "";

    if(products.length === 0){
        table.innerHTML = "<tr><td colspan='5'>No products available</td></tr>";
        return;
    }

    products.forEach(p => {
        const row = document.createElement('tr');
        const safeImage = p.imageUrl || "https://via.placeholder.com/50";
        const safeName = escapeHtml(p.name);
        row.innerHTML = `
        <td><img src="${safeImage}" width="50" alt="product"></td>
        <td>${safeName}</td>
        <td>₹${p.price}</td>
        <td><button onclick="editProduct(${p.id}, '${safeName}', ${p.price})">Edit</button></td>
        <td><button onclick="if(confirm('Delete this product?')) deleteProduct(${p.id})">Delete</button></td>
        `;
        table.appendChild(row);
    });
}


async function loadAdminOrders(){

    const res = await authFetch("https://shopverseultra.onrender.com/api/admin/orders");
   if (!res || !res.ok) return;

const orders = await res.json();

    const container = document.getElementById("order-list");

    if(!container) return;

    container.innerHTML = "";

    orders.forEach(order => {

        container.innerHTML += `
        <div class="order-card">
            <h3>Order #${order.id}</h3>
            <p>Total: ₹${order.totalAmount}</p>

            <p>Status: ${order.status}</p>

            <!-- 🔥 DROPDOWN -->
            <select onchange="updateOrderStatus(${order.id}, this.value)">
                <option ${order.status==="PLACED"?"selected":""}>PLACED</option>
                <option ${order.status==="SHIPPED"?"selected":""}>SHIPPED</option>
                <option ${order.status==="DELIVERED"?"selected":""}>DELIVERED</option>
            </select>
        </div>
        `;
    });
}

async function updateStatus(orderId){

    const status = document.getElementById(`status-${orderId}`).value;

    const res = await authFetch(`https://shopverseultra.onrender.com/api/admin/orders/${orderId}/status`,
        {
            method: "PUT",
            body: JSON.stringify({ status })
        }
    );

    if(res.ok){
        alert("Status Updated ✅");
        loadOrders();
    } else {
        alert("Failed to update ❌");
    }
}

function authFetch(url, options = {}) {

    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

if (!token) {
    console.error("No token found");
    return Promise.reject("No token");
}

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            ...(options.headers || {})
        }
    }).then(res => {

        if (res.status === 401) {
    localStorage.clear();
    alert("Session expired. Login again.");
    window.location.href = "login.html";
    return null;
}

if (res.status === 403) {
    console.error("Access denied (403)");
    return res; // 🔥 DO NOT logout
}

        return res;
    });
}
async function deleteProduct(id){
    await authFetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    loadAdminProducts();
}

async function editProduct(id, oldName, oldPrice){
    const name = prompt("Name", oldName);
    const price = prompt("Price", oldPrice);

    if(!name || !price) return;

    await authFetch(`${API_URL}/${id}`, {
        method: "PUT",

        body: JSON.stringify({ name, price })
    });

    loadAdminProducts();
}

async function loadAdminStats() {
    try {
        // PRODUCTS (PUBLIC API)
        const pRes = await fetch(`${API_URL}/products`);
        const products = await pRes.json();

        document.getElementById("total-products").innerText = products.length;

        // ORDERS (ADMIN API → NEED TOKEN)
        const oRes = await authFetch(`${API_URL}/admin/orders`);

        if (!oRes || !oRes.ok) {
            console.error("Orders API failed:", oRes?.status);
            document.getElementById("total-orders").innerText = "0";
            return;
        }

        const orders = await oRes.json();

        document.getElementById("total-orders").innerText = orders.length;

    } catch (err) {
        console.error("Stats error:", err);
    }
}
async function addProduct() {
    const name = document.querySelector("#product-name").value;
    const price = document.querySelector("#product-price").value;
    const file = document.querySelector("#product-image").files[0];

    if (!name || !price || !file) {
        alert("All fields required!");
        return;
    }

    // 🔥 STEP 1: Upload to Cloudinary
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "shopverse_upload");

    const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dc7udh4me/image/upload",
        { method: "POST", body: data }
    );

    const cloudData = await cloudRes.json();

    const imageUrl = cloudData.secure_url;

    // 🔥 STEP 2: Send to backend
    const token = localStorage.getItem("token");

    const res = await fetch("https://shopverseultra.onrender.com/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            name,
            price,
            imageUrl
        })
    });

    if (res.ok) {
        alert("Product added ✅");
        loadAdminProducts();
    } else {
        alert("Failed ❌");
    }
}
async function updateQuantity(id, newQty, btn) {
    btn.disabled = true;

    const originalText = btn.innerText;
    btn.innerText = "...";

    const qtyElement = document.querySelector(`[data-id="${id}"] .qty`);  // ✅ FIX
    let currentQty = parseInt(qtyElement.innerText);

    if (newQty < 1) {
        btn.disabled = false;
        btn.innerText = originalText;
        return;
    }

    qtyElement.innerText = newQty;
    animateQty(qtyElement);

    try {
        await authFetch(`https://shopverseultra.onrender.com/api/cart/update/${id}`, {  // ✅ FIX
            method: "PUT",
            body: JSON.stringify({ quantity: newQty })
        });

        loadCartFromBackend();

    } catch (err) {
        console.error(err);
        qtyElement.innerText = currentQty;
    }

    btn.disabled = false;
    btn.innerText = originalText;
}
async function removeItem(id, itemDiv){
    try{
        await authFetch(`https://shopverseultra.onrender.com/api/cart/${id}`, {
            method: "DELETE"
        });

        itemDiv.style.opacity = "0";
        setTimeout(() => itemDiv.remove(), 300);

        loadCartFromBackend();

    } catch(err){
        console.error(err);
    }
}

function renderCartItems(items) {
    const container = document.querySelector(".cart-items");
    container.innerHTML = "";

    if (items.length === 0) {
        document.querySelector(".empty-cart").style.display = "block";
        return;
    }

    document.querySelector(".empty-cart").style.display = "none";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item fade-in";
        div.dataset.id = item.id;

        div.innerHTML = `
          <img src="${item.image && item.image.startsWith('http') 
    ? item.image 
    : 'https://res.cloudinary.com/dc7udh4me/image/upload/v1/sample.jpg'}"
    onerror="this.src='https://res.cloudinary.com/dc7udh4me/image/upload/v1/sample.jpg'"> class="cart-img"/>

            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>

                <div class="qty-control">
                    <button class="qty-btn minus">−</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-btn plus">+</button>
                </div>
            </div>

            <button class="remove-btn">🗑</button>
        `;

        container.appendChild(div);
    });
}

function animateQty(el) {
    el.style.transform = "scale(1.3)";
    el.style.transition = "0.2s";

    setTimeout(() => {
        el.style.transform = "scale(1)";
    }, 200);
}



function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = msg;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}
// ================= CART =================
async function addToCart(productId){

    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return alert("Login first");

    console.log("USER:", user); // debug

    try {
        const res = await authFetch(`${API_URL}/cart/add`, {
            method: "POST",
           body: JSON.stringify({
           productId: productId,
           quantity: 1
    })
        });
        console.log("PRODUCT ID:", productId);
        if(!res){
            alert("Request failed");
            return;
        }

        if(!res.ok){
            const text = await res.text();
            console.error("ERROR:", text);
            alert("Cart error: " + text);
            return;
        }

        alert("Added to cart ✅");
        updateCartCount();

    } catch(err){
        console.error(err);
        alert("Something went wrong");
    }
}

function checkLoginUI() {
    const token = localStorage.getItem("token");

    const loginBtn = document.querySelector("a[href='login.html']");

    if(token){
        if(loginBtn){
            loginBtn.textContent = "Logout";
            loginBtn.onclick = () => {
                localStorage.clear();
                window.location.reload();
            };
        }
    }
}

  
function searchProducts() {
    const keyword = document.getElementById("searchInput").value;
    loadProducts(keyword);
}


   let orderInProgress = false;

async function placeOrder(event){
    event.preventDefault();

    if(orderInProgress) return; // 🚀 prevents double click
    orderInProgress = true;

    const btn = document.querySelector("button[type='submit']");
    btn.disabled = true;

    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){
        btn.disabled = false;
        orderInProgress = false;
        return showToast("Login first");
    }

    try {
        const res = await authFetch(
            `${API_URL}/orders/place?userId=${user.id}`,
            { method: "POST" }
        );

        if(res && (res.status === 200 || res.status === 201)){
            showToast("Order placed successfully!");
            setTimeout(() => window.location.href = "user.html", 1000);
        } else {
            showToast("Order failed ⚠️");
        }

    } catch(err) {
        console.error(err);
        showToast("Error placing order");
    }

    orderInProgress = false;
    btn.disabled = false;
}

async function loadCartFromBackend(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    const res = await authFetch(`https://shopverseultra.onrender.com/api/cart/user/${user.id}`);
    if (!res.ok) {
        console.error("Cart API failed:", res.status);
        return;
    }

    const items = await res.json();

    const container = document.querySelector(".cart-items");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    if(!container) return;

    container.innerHTML = "";

    let total = 0;

    if(items.length === 0){
        document.querySelector(".empty-cart").style.display = "block";

        subtotalEl.innerText = "0";
        totalEl.innerText = "0";

        return;
    }

    document.querySelector(".empty-cart").style.display = "none";

    items.forEach(item => {

        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item fade-in";
        div.dataset.id = item.id;

        div.innerHTML = `
 <img src="${item.image && item.image.startsWith('http') 
    ? item.image 
    : 'https://res.cloudinary.com/dc7udh4me/image/upload/v1/sample.jpg'}"
    onerror="this.src='https://res.cloudinary.com/dc7udh4me/image/upload/v1/sample.jpg'">

    <div class="cart-info">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>

        <div class="qty-control">
            <button class="qty-btn minus">−</button>
            <span class="qty">${item.quantity}</span>
            <button class="qty-btn plus">+</button>
        </div>
    </div>

    <button class="remove-btn">🗑</button>
`;


        container.appendChild(div);
    });

    subtotalEl.innerText = total;
    totalEl.innerText = total;
}

document.addEventListener("click", async (e) => {

    const itemDiv = e.target.closest(".cart-item");
    if(!itemDiv) return;

    const id = itemDiv.dataset.id;
    console.log("CLICKED ID:", id);
    const qtyEl = itemDiv.querySelector(".qty");
    let qty = parseInt(qtyEl.innerText);

    // ➕ INCREASE
    if(e.target.classList.contains("plus")){
        qty++;
        await updateQuantity(id, qty, e.target);
    }

    // ➖ DECREASE
    if(e.target.classList.contains("minus")){
        if(qty > 1){
            qty--;
            await updateQuantity(id, qty, e.target);
        }
    }

    // 🗑 REMOVE
    if(e.target.classList.contains("remove-btn")){
        await removeItem(id, itemDiv);
    }
});

async function loadCheckout(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await authFetch(`https://shopverseultra.onrender.com/api/cart/user/${user.id}`);
        if (!res || !res.ok) throw new Error("Failed to load cart");
        
        const items = await res.json();
        const container = document.getElementById("checkout-items-preview");
        const totalEl = document.getElementById("checkout-total");

        let total = 0;
        if (container) container.innerHTML = "";

        items.forEach(item => {
            total += item.price * item.quantity;
            const safeName = escapeHtml(item.name);
            if (container) {
                const p = document.createElement('p');
                p.textContent = `${safeName} × ${item.quantity} = ₹${item.price * item.quantity}`;
                container.appendChild(p);
            }
        });

        if (totalEl) totalEl.innerText = total;

        // Fill in user email
        const emailEl = document.getElementById("checkout-email");
        if (emailEl) emailEl.value = user.email || "";
    } catch(err) {
        console.error("Checkout load error:", err);
        showToast("Error loading checkout");
    }
}

async function updateCartCount(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    const res = await authFetch(`https://shopverseultra.onrender.com/api/cart/user/${user.id}`);
    if (!res.ok) {
        console.error("Cart count failed:", res.status);
        return;
    }

    const items = await res.json();

    let count = 0;
    items.forEach(i => count += i.quantity);

    const el = document.getElementById("cart-count");
    if(el) el.innerText = count;
}

async function loadCartCountBox(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    const res = await authFetch(`https://shopverseultra.onrender.com/api/cart/user/${user.id}`);
    const items = await res.json();

    let count = 0;
    items.forEach(i => count += i.quantity);

    const box = document.getElementById("cart-count-box");
    if(box) box.innerText = count;
}


function updateNavbar() {
    const nav = document.getElementById("nav-links");
    if (!nav) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    let html = `
        <li><a href="index.html">Store</a></li>
        <li><a href="shop.html">Products</a></li>
        <li><a href="cart.html">Cart (<span id="cart-count">0</span>)</a></li>
    `;

    if (token && user) {
        html += `<li><a href="orders.html">Orders</a></li>`;

        if (user.role === "ADMIN") {
            html += `<li><a href="admin.html">Admin</a></li>`;
        }

        html += `<li><a href="#" onclick="logout()">Logout</a></li>`;
    } else {
        html += `<li><a href="login.html">Login</a></li>`;
    }

    nav.innerHTML = html;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}


// ================= ORDERS =================
async function loadOrders() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const container = document.getElementById("orders-container");
    container.innerHTML = "Loading orders...";

    try {
        const res = await authFetch(`${API_URL}/orders/${user.email}`);
        const orders = await res.json();

        container.innerHTML = "";

        orders.forEach(o => {

            let statusClass = "placed";
            let steps = ["active", "", ""];

            if (o.status === "SHIPPED") {
                statusClass = "shipped";
                steps = ["completed", "active", ""];
            }

            if (o.status === "DELIVERED") {
                statusClass = "delivered";
                steps = ["completed", "completed", "active"];
            }

            const card = document.createElement("div");
            card.className = "order-card";

            card.innerHTML = `
                <div class="order-top">
                    <h3>Order #${o.id}</h3>
                    <span class="status ${statusClass}">${o.status}</span>
                </div>

                <p class="price">Total: ₹${o.total}</p>

                <div class="timeline">
                    <div class="step ${steps[0]}">
                        <div class="circle"></div>
                        <div class="label">Placed</div>
                    </div>

                    <div class="step ${steps[1]}">
                        <div class="circle"></div>
                        <div class="label">Shipped</div>
                    </div>

                    <div class="step ${steps[2]}">
                        <div class="circle"></div>
                        <div class="label">Delivered</div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = "Failed to load orders";
    }
}



async function registerUser(event){
    event.preventDefault();

    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const role = document.getElementById("reg-role").value;
    const adminKey = document.getElementById("admin-key").value;

    // 🔐 SECURITY CHECK
    if(role === "ADMIN" && adminKey !== "12345"){
        alert("Invalid admin key!");
        return;
    }

    try{
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name,
                email,
                password,
                role
            })
        });

        if(res.ok){
            alert("Registration successful!");
            window.location.href = "login.html";
        } else {
            const err = await res.text();
            alert("Register failed: " + err);
        }

    } catch(e){
        console.error(e);
        alert("Server error");
    }
}
function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

      fetch("https://shopverseultra.onrender.com/api/auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"   // 🔥 MUST HAVE
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
})
        .then(res => {
            if (!res.ok) {
                throw new Error("Invalid credentials");
            }
            return res.json();
        })
        .then(data => {

            console.log("LOGIN RESPONSE:", data); // 🔥 ADD THIS

            // ✅ CHECK TOKEN EXISTS
            if (!data.token) {
                alert("Login failed: No token received");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful!");

            window.location.href = "index.html";
        })
        .catch(err => {
            alert(err.message);
        });
}


async function loadOrdersSummary(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    try {
        const res = await authFetch(
            `https://shopverseultra.onrender.com/api/orders/${encodeURIComponent(user.email)}`
        );

        if(!res.ok){
            document.getElementById("order-text").innerText = "No orders";
            return;
        }

        const orders = await res.json();

        document.getElementById("order-count").innerText = orders.length;
        document.getElementById("order-text").innerText = "Orders placed";

    } catch(e){
        document.getElementById("order-text").innerText = "Error loading";
    }
}

// ================= CHART =================
let chartInstance = null;

async function loadChart(){
    const res = await authFetch(`${API_URL}/products`);
   if (!res || !res.ok) return;

const products = await res.json();
    const labels = products.map(p => p.name);
    const data = products.map(p => p.price);

    if(chartInstance){
        chartInstance.destroy();
    }

    chartInstance = new Chart(document.getElementById("productChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Product Prices",
                data: data
            }]

        }
    });
}


function checkAuth(){
    const token = localStorage.getItem("token");

    if(!token){
        alert("Please login first");
        window.location.href = "login.html";
    }
}

function redirectIfLoggedIn(){
    const token = localStorage.getItem("token");

    if(token){
        window.location.href = "index.html";
    }
}

function goToOrders(){
    window.location.href = "orders.html";
}

// ================= INIT =================
window.onload = function() {

    const path = window.location.pathname;

    updateNavbar();

    if(
        path.includes("cart") ||
        path.includes("orders") ||
        path.includes("user") ||
        path.includes("admin")
    ){
        checkAuth();
    }

    if(path.includes("admin.html")){
        checkAdminAccess();
        loadAdminName();
        loadAdminStats();
        
        loadAdminProducts();
        loadOrders();
        loadChart();
    }

    if(path.includes("login.html")){
        redirectIfLoggedIn();
    }

    if(path.includes("shop.html") || path.includes("index.html") || path === "/"){
        loadProducts();
    }

    if(path.includes("product.html")){
        loadProductDetails();   // ✅ FIXED
    }

    if(path.includes("user.html")){
        checkAuth();
        loadCartCountBox();
        loadOrdersSummary();
    }

    if(path.includes("cart.html")){
        checkAuth();
        loadCartFromBackend();
        updateCartCount();
    }
    if(path.includes("checkout.html")){
        checkAuth();
         loadCheckout();   // 🔥 ADD THIS
}

    if(path.includes("orders.html")){
        checkAuth();
        loadOrders();
    }

    const searchInput = document.getElementById("searchInput");
if(searchInput){
    searchInput.addEventListener("input", searchProducts);
}
};

   

document.addEventListener("click", (e) => {

    if(e.target.classList.contains("checkout-btn")){

        const user = JSON.parse(localStorage.getItem("user"));

        if(!user){
            alert("Login first");
            window.location.href = "login.html";
            return;
        }

        // 👉 Go to checkout page
        window.location.href = "checkout.html";
    }
});


document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".checkout-form");

    if(form){
        form.addEventListener("submit", placeOrder);
    }

});
checkLoginUI();