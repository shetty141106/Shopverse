FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# 🔥 IMPORTANT: use PORT env variable
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=$PORT"]