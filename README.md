# 🛒 ShopVerse – Full Stack E-Commerce Platform

<p align="center">
  <b>A modern full-stack e-commerce platform built with Spring Boot & JavaScript</b><br/>
  Secure • Scalable • Production Ready 🚀
</p>

---

## 🚀 Live Demo

- 🌐 Frontend (Netlify): https://shopverse14.netlify.app/  
- ⚙️ Backend (Render): https://shopverseultra.onrender.com

---

## 📌 Overview

ShopVerse is a full-stack e-commerce web application that enables users to browse products, manage carts, and place orders securely.

It follows a **modern microservice-like architecture** where frontend and backend are deployed separately.

---

## 🏗️ Architecture

Frontend (Netlify) → API Calls → Backend (Render) → Database (MySQL)

---

## ✨ Features

### 👤 User
- Secure Login & Registration (JWT)
- Browse Products
- Add to Cart
- Place Orders
- View Order History

### 🛍️ Product
- Dynamic Product Listing
- Product Details
- Image Upload (Cloudinary)

### 🔐 Security
- JWT Authentication
- Spring Security
- Protected APIs

### ⚙️ Admin
- Add / Update / Delete Products
- Manage Orders

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT

### Frontend
- HTML
- CSS
- JavaScript
- Fetch API

### Database
- MySQL

### Cloud
- Cloudinary

### Deployment
- Frontend → Netlify  
- Backend → Render  

---

# 📂 Project Structure

ShopVerse/
│
├── backend/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/shopverse/backend/
│ │ │ │ ├── config/
│ │ │ │ ├── controller/
│ │ │ │ ├── dto/
│ │ │ │ ├── model/
│ │ │ │ ├── repository/
│ │ │ │ ├── security/
│ │ │ │ ├── service/
│ │ │ │ └── Application.java
│ │ │
│ │ │ ├── resources/
│ │ │ │ ├── application.properties
│ │ │ │ └── templates/
│ │ │
│ │ │ └── test/
│ │
│ │ └── pom.xml
│ │
│ ├── Dockerfile
│ ├── docker-compose.yml
│ └── .gitignore
│
├── frontend/
│ ├── images/
│ ├── index.html
│ ├── login.html
│ ├── register.html
│ ├── shop.html
│ ├── product.html
│ ├── cart.html
│ ├── checkout.html
│ ├── orders.html
│ ├── user.html
│ ├── admin.html
│ ├── success.html
│ ├── script.js
│ └── style.css
│

 
---

## ⚙️ Setup Instructions

### 🔧 Prerequisites
- Java 17+
- Maven
- MySQL
---

### ▶️ Run Backend

```bash
git clone https://github.com/yourusername/shopverse.git
cd backend
mvn clean install
mvn spring-boot:run
spring.datasource.url=jdbc:mysql://localhost:3306/shopverse
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update

---

# 🌐 FRONTEND SETUP

- Open `frontend/index.html` in your browser  
- OR deploy the frontend using **Netlify**

---

# 🔑 API ENDPOINTS

## 🔐 AUTHENTICATION
- `POST /api/auth/register`
- `POST /api/auth/login`

## 🛍️ PRODUCTS
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

## 🛒 CART
- `POST /api/cart/add`
- `GET /api/cart`

## 📦 ORDERS
- `POST /api/orders`
- `GET /api/orders`

---

# 🔐 AUTHENTICATION FLOW

1. User logs in  
2. JWT token is generated  
3. Token is stored in **localStorage**  
4. Token is sent in request headers:

---

# ⚠️ CHALLENGES FACED

- ❌ CORS issues between Netlify & Render  
- ❌ 403 Forbidden errors during deployment  
- ❌ JWT authentication debugging  
- ❌ Cloudinary image upload integration  

---

# 🚀 FUTURE ENHANCEMENTS

- 💳 Payment Gateway Integration (Razorpay / Stripe)  
- ❤️ Wishlist Feature  
- 🔍 Advanced Search & Filters  
- 📱 Fully Responsive UI  
- 📊 Admin Dashboard  

---

# 📚 LEARNING OUTCOMES

- 💻 Full Stack Development  
- 🔗 REST API Design  
- 🔐 Authentication & Security  
- ☁️ Deployment (Netlify + Render)  
- 🛠️ Debugging real-world problems  

---

# 👨‍💻 AUTHOR

**Mokshith Shetty**  
Computer Engineering Student  
Aspiring Full Stack Developer 🚀  

---

# ⭐ SHOW YOUR SUPPORT

If you like this project, please give it a ⭐ on GitHub!

---

# 📄 LICENSE

This project is for educational purposes.

---
