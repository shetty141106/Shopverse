# Shopverse Backend

This is the backend of an e-commerce application built using Spring Boot.
It provides REST APIs for authentication, products, cart, and orders.

---

## Features

* User registration and login (JWT based authentication)
* View and search products
* Add items to cart
* Update and remove cart items
* Place orders
* View user orders
* Basic admin support for managing products and orders

---

## Tech Stack

* Java
* Spring Boot
* Spring Security (JWT)
* Spring Data JPA
* MySQL
* Maven

---

## Project Structure

* `controller` → API endpoints
* `service` → business logic
* `repository` → database access
* `model` → entity classes
* `dto` → request/response objects
* `security` → JWT handling
* `config` → security and CORS setup

---

## Setup

1. Clone the repository
2. Configure database in `application.properties`
3. Run the project using:

```
mvn spring-boot:run
```

---

## Frontend

The frontend is built using HTML, CSS, and JavaScript .

---
