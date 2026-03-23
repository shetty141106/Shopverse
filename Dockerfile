# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# ❌ remove fixed expose
# EXPOSE 8080

# ✅ use dynamic port
ENV PORT=8080

ENTRYPOINT ["java","-jar","app.jar"]