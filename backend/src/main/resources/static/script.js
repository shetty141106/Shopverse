const API_URL = "http://localhost:8080/api/products";


// ================= NAVBAR =================
function updateNavbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    const authLink = document.getElementById("auth-link");
    const adminLink = document.getElementById("admin-link");

    // ✅ ADD THIS CHECK
    if (!authLink || !adminLink) return;

    if (user) {
        authLink.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;

        if (user.role === "ADMIN") {
            adminLink.innerHTML = `<a href="admin.html">Admin</a>`;
        } else {
            adminLink.innerHTML = "";
        }
    } else {
        authLink.innerHTML = `<a href="login.html">Login</a>`;
        adminLink.innerHTML = "";
    }
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
async function loadStats(){
    try{
        const productsRes = await authFetch("http://localhost:8080/api/products");
        const products = await productsRes.json();

        const ordersRes = await authFetch("http://localhost:8080/api/admin/orders");
        const orders = await ordersRes.json();

        document.getElementById("total-products").innerText = products.length;
        document.getElementById("total-orders").innerText = orders.length;

    } catch(e){
        console.log("Stats error:", e);
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
    if(!container) return;

    container.innerHTML = "Loading products...";

    let url = API_URL;

    // 🔥 ONLY SEARCH (NO CATEGORY)
    if(keyword && keyword.trim() !== ""){
        url = `${API_URL}/search?keyword=${keyword}`;
    }

    const res = await authFetch(url);
    if (!res) return;   // 🔥 ADD THIS
    if (!res.ok) {
        console.error("API failed:", res.status);
        return;
    }

    const products = await res.json();
    if (!Array.isArray(products)) {
        console.error("Invalid response:", products);
        container.innerHTML = "Error loading products";
        return;
    }

    container.innerHTML = "";

    if(products.length === 0){
        container.innerHTML = "No products found";
        return;
    }

    products.forEach(p => {
        container.innerHTML += `
    <div class="card" onclick="viewProduct(${p.id})">
        <img src="http://localhost:8080/uploads/${p.image}" alt="product">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id}); event.stopPropagation();">Add to Cart</button>
    </div>`;
    });
}

async function loadProductDetails() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    try {
        const res = await authFetch(`http://localhost:8080/api/products/${id}`);
        if (!res.ok) {
            console.error("API failed:", res.status);
            return;
        }

        const product = await res.json();

        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-price").innerText = "₹" + product.price;
        document.getElementById("product-desc").innerText = product.description || "No description";

        document.getElementById("product-image").src =
            `http://localhost:8080/uploads/${product.image}`;

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

}



async function loadAdminProducts(){
    const table = document.getElementById("admin-products-body");
    if(!table) return;

    // ✅ FIX: use table instead of container
    table.innerHTML = "<tr><td colspan='5'>Loading products...</td></tr>";

    const res = await authFetch(API_URL);
    if (!res.ok) {
        console.error("API failed:", res.status);
        return;
    }

    const products = await res.json();

    table.innerHTML = "";

    if(products.length === 0){
        table.innerHTML = "<tr><td colspan='5'>No products available</td></tr>";
        return;
    }

    products.forEach(p => {
        table.innerHTML += `
        <tr>
            <td><img src="http://localhost:8080/uploads/${p.image}" width="50" alt="product"></td>
            <td>${p.name}</td>
            <td>₹${p.price}</td>
            <td><button onclick="editProduct(${p.id}, '${p.name}', ${p.price})">Edit</button></td>
            <td><button onclick="deleteProduct(${p.id})">Delete</button></td>
        </tr>`;
    });
}


async function loadAdminOrders(){

    const res = await authFetch("http://localhost:8080/api/admin/orders");
    if (!res.ok) {
        console.error("Orders API failed:", res.status);
        return;
    }
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

    const res = await authFetch(`http://localhost:8080/api/admin/orders/${orderId}/status`,
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

    if (!token) {
        window.location.href = "login.html";
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

        if (res.status === 401 || res.status === 403) {
            localStorage.clear();
            alert("Session expired. Login again.");
            window.location.href = "login.html";
            return null;
        }

        return res;
    });
}
async function deleteProduct(id){
    await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
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

async function addProduct() {
    try {
        const name = document.querySelector("#product-name").value;
        const price = document.querySelector("#product-price").value;
        const fileInput = document.querySelector("#product-image");


        if (!name || !price || !fileInput.files[0]) {
            alert("All fields required!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("image", fileInput.files[0]);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (res.ok) {
            alert("Product added successfully ✅");

            // reload products
            loadAdminProducts();

            // clear form
            document.querySelector("#product-name").value = "";
            document.querySelector("#product-price").value = "";
            fileInput.value = "";

        } else {
            alert("Failed to add product ❌");
        }

    } catch (error) {
        console.error("Add product error:", error);
    }
}

// ================= CART =================
async function addToCart(productId){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return alert("Login first");

    await authFetch("http://localhost:8080/api/cart/add", {
        method: "POST",

        body: JSON.stringify({
            userId: user.id,
            productId,
            quantity: 1
        })
    });

    updateCartCount();
}
function searchProducts() {
    const keyword = document.getElementById("searchInput").value;
    loadProducts(keyword);
}

async function placeOrder(event){
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return alert("Login first");

    const res = await authFetch(`http://localhost:8080/api/orders/place?userId=${user.id}`,
        { method: "POST" }
    );

    if(res.ok){
        alert("Order placed successfully!");
        window.location.href = "user.html?refresh=true";
    } else {
        alert("Failed to place order");
    }
}

async function loadCartFromBackend(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    const res = await authFetch(`http://localhost:8080/api/cart/user/${user.id}`);
    if (!res.ok) {
        console.error("Cart API failed:", res.status);
        return;
    }

    const items = await res.json();

    const container = document.querySelector(".cart-items");
    if(!container) return;


    container.innerHTML = "";

    let total = 0;

    items.forEach(item => {
        total += item.price * item.quantity;

        container.innerHTML += `
        <div>
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <p>Qty: ${item.quantity}</p>
        </div>`;
    });

    const totalBox = document.querySelector(".cart-summary p");
    if(totalBox) totalBox.innerText = "Total: ₹" + total;
}

async function updateCartCount(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    const res = await authFetch(`http://localhost:8080/api/cart/user/${user.id}`);
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

    const res = await authFetch(`http://localhost:8080/api/cart/user/${user.id}`);
    const items = await res.json();

    let count = 0;
    items.forEach(i => count += i.quantity);

    const box = document.getElementById("cart-count-box");
    if(box) box.innerText = count;
}

// ================= ORDERS =================
async function loadOrders(){

    const path = window.location.pathname;

    let url = "";

    if(path.includes("admin.html")){
        url = "http://localhost:8080/api/admin/orders";
    } else {
        const user = JSON.parse(localStorage.getItem("user"));
        url = `http://localhost:8080/api/orders/${encodeURIComponent(user.email)}`;
    }

    const res = await authFetch(url);
    if (!res.ok) {
        console.error("Orders fetch failed:", res.status);
        return;
    }
    const orders = await res.json();

    // ================= ADMIN TABLE =================
    if(path.includes("admin.html")){

        const table = document.querySelector("#ordersTable tbody");
        if(!table) return;

        table.innerHTML = "";

        orders.forEach(order => {
            table.innerHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.userEmail}</td>
                    <td>₹${order.totalAmount}</td>

                    <td>
                        <span style="
                            padding:5px 10px;
                            border-radius:8px;
                            color:white;
                            background:
                                ${order.status === "PLACED" ? "gray" :
                order.status === "SHIPPED" ? "blue" :
                    order.status === "DELIVERED" ? "green" : "red"};
                        ">
                            ${order.status}
                        </span>
                    </td>

                    <td>
                        <select id="status-${order.id}">
                            <option value="PLACED" ${order.status==="PLACED"?"selected":""}>PLACED</option>
                            <option value="SHIPPED" ${order.status==="SHIPPED"?"selected":""}>SHIPPED</option>
                            <option value="DELIVERED" ${order.status==="DELIVERED"?"selected":""}>DELIVERED</option>
                            <option value="CANCELLED" ${order.status==="CANCELLED"?"selected":""}>CANCELLED</option>
                        </select>

                        ${
                (order.status === "DELIVERED" || order.status === "CANCELLED")
                    ? `<button disabled>Locked</button>`
                    : `<button onclick="updateStatus(${order.id})">Update</button>`
            }
                    </td>
                </tr>
            `;
        });
    }

    // ================= USER PAGE =================
    else {

        const container = document.getElementById("order-list");
        if(!container) return;

        container.innerHTML = "";

        orders.forEach(order => {
            container.innerHTML += `
                <div class="order-card">
                    <h3>Order #${order.id}</h3>
                    <p>Total: ₹${order.totalAmount}</p>
                    <p>Status: ${order.status}</p>
                </div>
            `;
        });
    }
}


async function registerUser(event){
    event.preventDefault();

    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const role = document.getElementById("reg-role").value;

    const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email, password, role })
    });

    if(res.ok){
        alert("Registration successful!");
        window.location.href = "login.html";
    } else {
        alert("Registration failed!");
    }
}
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
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
            `http://localhost:8080/api/orders/${encodeURIComponent(user.email)}`
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
    const res = await authFetch(API_URL);
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
window.onload = function(){



    const hash = window.location.hash;

    if(hash === "#orders"){
        setTimeout(() => {
            document.getElementById("order-section").scrollIntoView();
        }, 300);
    }
    updateNavbar();
    const params = new URLSearchParams(window.location.search);

    if(params.get("refresh")){
        loadOrdersSummary();
    }
    document.addEventListener("DOMContentLoaded", updateNavbar);
    const path = window.location.pathname;

// 🔐 Protect ALL pages except login/register
    if (!path.includes("login.html") && !path.includes("register.html")) {
        checkAuth();
    }
    if(path.includes("admin.html")){
        checkAdminAccess();
        loadAdminName();
        loadAdminProducts();
        loadStats();
        loadOrders();
        loadChart();
    }
    if(path.includes("login.html")){
        redirectIfLoggedIn();
    }

    // ✅ SHOP PAGE
    if(path.includes("shop.html")){
        loadProducts();

        const searchInput = document.getElementById("searchInput");
        if(searchInput){
            searchInput.addEventListener("input", searchProducts);
        }
    }

// ✅ PRODUCT PAGE (🔥 FIXED)
    if(path.includes("product.html")){
        console.log("Product page detected");
        loadProductDetails();
    }




    if(path.includes("user.html")){
        checkAuth();          // 🔐 ADD THIS
        loadCartCountBox();
        loadOrdersSummary();
    }

    if(path.includes("cart.html")){
        checkAuth();          // 🔐 ADD THIS
        loadCartFromBackend();
        updateCartCount();
    }
    if(path.includes("orders.html")){
        checkAuth();          // 🔐 ADD THIS
        loadOrders();
    }

};