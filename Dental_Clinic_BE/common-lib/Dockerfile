# Dùng image JDK 20 nhỏ gọn
FROM openjdk:17-jdk-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file JAR từ thư mục target vào container
COPY target/*.jar app.jar

# Mở port mà ứng dụng sẽ chạy (Giả sử ứng dụng Spring Boot chạy trên port 8080)
EXPOSE 8080

# Lệnh để chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]