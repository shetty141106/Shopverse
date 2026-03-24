#!/bin/bash

cd "$(dirname "$0")"

# Set environment variables
export DB_URL="jdbc:mysql://mysql.railway.internal:3306/railway"
export DB_USERNAME="root"
export DB_PASSWORD="yFsMWyuIqfsWLLfumVuqQovBkAatKHmv"
export PORT="8080"

echo "=========================================="
echo "Shopverse Ecommerce Server"
echo "=========================================="
echo "Java Version:"
java -version

echo ""
echo "Building and running the application..."
echo "Database: MySQL at localhost:3306/shopverse"
echo "Server Port: 8080"
echo "API will be available at: http://localhost:8080"
echo "Static files will be served from: http://localhost:8080/index.html"
echo ""
echo "=========================================="

# Run the Spring Boot application
./mvnw spring-boot:run -DskipTests
