# Dùng image JDK nhỏ gọn
FROM openjdk:23-jdk-slim

# Tạo thư mục app bên trong container
WORKDIR /app

# Copy file jar từ target vào container
COPY target/dentist-service-0.0.1-SNAPSHOT.jar app.jar

# Mở port (tuỳ cổng bạn dùng)
EXPOSE 8084

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
