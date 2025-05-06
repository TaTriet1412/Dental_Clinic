# Dùng image JDK nhỏ gọn
FROM openjdk:20-jdk-slim

# Tạo thư mục app bên trong container
WORKDIR /app

# Copy file jar từ target vào container
COPY target/api-gateway-0.0.1-SNAPSHOT.jar app.jar

# Mở port (tuỳ cổng bạn dùng)
EXPOSE 8060

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
