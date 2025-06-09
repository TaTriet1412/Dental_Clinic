# Dùng image JDK nhỏ gọn
FROM openjdk:17-jdk-slim

# Tạo thư mục app bên trong container
WORKDIR /app

# Copy file jar từ target vào container
COPY target/*.jar app.jar

# Tạo cấu trúc thư mục uploads trong container
RUN mkdir -p /app/uploads/material_services

# Copy thư mục uploads từ host vào container (nếu tồn tại)
COPY uploads/ /app/uploads/

# Set system property để nhận biết đang chạy trong Docker
ENV JAVA_OPTS="-Drunning.in.docker=true"


# Mở port (tuỳ cổng bạn dùng)
EXPOSE 8083

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]