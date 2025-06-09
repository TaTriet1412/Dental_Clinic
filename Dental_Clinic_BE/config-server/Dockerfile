# Dùng image JDK nhỏ gọn
FROM openjdk:23-jdk-slim

# Cài curl và jq
RUN apt-get update && apt-get install -y curl jq

# Tạo thư mục app bên trong container
WORKDIR /app

# Copy file jar từ target vào container
COPY target/*.jar app.jar

# Mở port (tuỳ cổng bạn dùng)
EXPOSE 8088

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]