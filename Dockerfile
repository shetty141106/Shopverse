FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

# Build project
RUN ./mvnw clean package -DskipTests

# 🔥 DEBUG: print target folder
RUN echo "==== TARGET CONTENT ===="
RUN ls -l target

EXPOSE 8080

# 🔥 Safe run (no wildcard issue)
CMD ["sh", "-c", "java -jar $(find target -name '*.jar' | head -n 1)"]