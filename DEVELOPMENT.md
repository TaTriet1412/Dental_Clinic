# Development Guide - Dental Clinic Microservices

## Hướng dẫn phát triển với Hot Reload cho các microservices

### ⚠️ QUAN TRỌNG: Khởi động Infrastructure Services trước

Trước khi bắt đầu development mode, bạn **BẮT BUỘC** phải khởi động các infrastructure services vì development services phụ thuộc vào chúng.

#### Bước 0: Khởi động Infrastructure Services

```bash
cd Dental_Clinic_BE

# 1. Start infrastructure services (BẮT BUỘC)
docker-compose up -d config-server service-registry zipkin redis

# 2. Start databases
docker-compose up -d auth_db material_db dentist_db payment_db

** docker compose up api-gateway (Sau khi đã up service cần dev)

# 3. Kiểm tra health của infrastructure (Đợi 30-60 giây)
curl http://localhost:8088/actuator/health  # Config Server
curl http://localhost:8761/actuator/health  # Service Registry
curl http://localhost:9411/actuator/health  # Zipkin

# 4. Kiểm tra tất cả services đã sẵn sàng
docker-compose ps
```

**Tại sao cần infrastructure services?**
- **Config Server** (port 8088) - Cung cấp cấu hình cho tất cả services
- **Service Registry** (port 8761) - Eureka server để services đăng ký và tìm kiếm nhau  
- **Database containers** - MySQL instances cho từng service
- **Redis** (port 6379) - Cache và session storage
- **Zipkin** (port 9411) - Distributed tracing

### Bước 1: Khởi động Development Mode

#### 1. Khởi động development mode cho một service:

```bash
# Phương pháp 1: Sử dụng script 
# Linux/Mac:
./dev-mode.sh auth-service

# Windows:
dev-mode.bat auth-service

# Phương pháp 2: Sử dụng docker-compose trực tiếp (Khuyến nghị)
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml build auth-service

docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d auth-service
```

**Các services có thể chạy development mode:**
- `auth-service` (Port: 8081)
- `material-service` (Port: 8083)
- `dental-service` (Port: 8082)
- `patient-service` (Port: 8086)
- `dentist-service` (Port: 8084)
- `prescription-service` (Port: 8085)
- `schedule-service` (Port: 8087)
- `payment-service` (Port: 8089)

#### 2. Development workflow:

##### A. Mở IntelliJ IDEA:

1. **Import project từ service folder:**
   ```
   File → Open → Select "Dental_Clinic_BE/auth-service" folder
   ```

2. **Configure JDK 23:**
   - File → Project Structure → Project Settings → Project
   - Project SDK: Choose JDK 23
   - Project language level: 23

3. **Wait for Maven indexing:**
   - IntelliJ sẽ tự động download dependencies
   - Đợi cho đến khi indexing hoàn tất

##### B. Edit code:

1. **Mở file AuthController.java:**
   ```java
   // Đường dẫn: src/main/java/com/dental_clinic/auth_service/Controller/AuthController.java
   ```

2. **Thực hiện thay đổi, ví dụ:**
   ```java
   @PostMapping("/login")
   public ApiResponse<Object> loginUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
       // Thêm log để test hot reload
       System.out.println("🔥 HOT RELOAD WORKING: Login request received at " + LocalDateTime.now());
       System.out.println("📧 User ID: " + loginRequest.getUserId());
       
       if (bindingResult.hasErrors()) {
           System.out.println("❌ Validation errors: " + bindingResult.getAllErrors().toString());
           throw new AppException(ErrorCode.INVALID_REQUEST, bindingResult.getAllErrors().toString());
       }
       
       User account = authService.tryLogin(loginRequest.getUserId(), loginRequest.getPassword());
       
       if (account != null) {
           System.out.println("✅ Login successful for user: " + account.getId());
           // ...existing code...
       } else {
           System.out.println("❌ Login failed for user: " + loginRequest.getUserId());
           // ...existing code...
       }
   }
   ```

##### C. Save file (Ctrl+S):

1. **Spring DevTools sẽ tự động detect changes**
2. **Container sẽ restart trong 5-10 giây**
3. **Theo dõi quá trình restart:**
   ```bash
   # Xem logs real-time
   docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f auth-service
   
   # Khi thấy dòng này có nghĩa là restart thành công:
   # "Started AuthServiceApplication in X.XXX seconds"
   ```

##### D. Test changes:

1. **Test API endpoint:**
   ```bash
   # Sử dụng curl
   curl -X POST http://localhost:8081/auth/login \
     -H "Content-Type: application/json" \
     -d '{"userId": "test@example.com", "password": "password123"}'
   
   # Hoặc sử dụng Postman:
   # URL: http://localhost:8081/auth/login
   # Method: POST
   # Body: {"userId": "test@example.com", "password": "password123"}
   ```

2. **Kiểm tra logs:**
   ```bash
   docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f auth-service
   ```

3. **Verify hot reload đã hoạt động:**
   - Logs sẽ hiển thị message bạn vừa thêm
   - Timestamp sẽ được update theo real-time

#### 3. Multiple services development:

```bash
# Start multiple services in dev mode (SAU KHI infrastructure đã chạy)
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d auth-service material-service dental-service

# View logs of all dev services
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f

# View logs of specific services
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f auth-service material-service

# Check status of all services
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml ps
```

**Lưu ý khi develop multiple services:**
- Mỗi service sẽ có port LiveReload riêng (35729, 35730, 35731, ...)
- Có thể mở multiple IntelliJ windows cho từng service
- Changes ở mỗi service sẽ restart independently

#### 4. Return to production mode:

```bash
# Stop specific service development mode
./stop-dev.sh auth-service

# Stop all development services và return to production
./stop-dev.sh all

# Manual way - Stop development mode
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml down

# Start production mode
docker-compose up -d
```

### Bước 2: IntelliJ IDEA Configuration

#### 1. Import project:

1. **Open IntelliJ IDEA**
2. **File → Open → Select auth-service folder**
   ```
   Đường dẫn: D:\College\Year3\SOA\Application\Dental_Clinic\Dental_Clinic_BE\auth-service
   ```
3. **Import as Maven project**
   - Chọn "Import Maven project automatically"
   - Wait for dependencies download

#### 2. Configure Run Configuration (Optional - để chạy local nếu cần):

1. **Run → Edit Configurations**
2. **Add Application (+)**
   - Name: `Auth Service Local`
   - Main class: `com.dental_clinic.auth_service.AuthServiceApplication`
   - VM options: `-Dspring.profiles.active=dev -Dfile.encoding=UTF-8`
   - Program arguments: (để trống)
   - Working directory: `$MODULE_WORKING_DIR$`

3. **Environment variables:**
   ```
   SPRING_PROFILES_ACTIVE=dev
   SERVER_PORT=8081
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/auth_db
   ```

#### 3. Enable auto-build:

1. **File → Settings → Build, Execution, Deployment → Compiler**
2. **Check "Build project automatically"**
3. **Apply → OK**

4. **Enable auto-reload (Advanced):**
   - Press `Ctrl+Shift+A` (Find Action)
   - Type: "Registry"
   - Find: `compiler.automake.allow.when.app.running`
   - Check the checkbox
   - Restart IntelliJ

#### 4. Configure Code Style (Optional):

1. **File → Settings → Editor → Code Style → Java**
2. **Set indent: 4 spaces**
3. **Line separator: Unix and macOS (\n)**

#### 5. Useful IntelliJ Shortcuts:

```
Ctrl+F9        - Build project (trigger hot reload)
Ctrl+Shift+F9  - Compile current file
Ctrl+F5        - Reload from disk
Ctrl+Alt+Y     - Synchronize files
Shift+F10      - Run current configuration
Shift+F9       - Debug current configuration
```

### Bước 3: Complete Development Workflow

#### Recommended workflow (từ đầu đến cuối):

```bash
# 1. Start infrastructure (BƯỚC ĐẦU TIÊN)
cd Dental_Clinic_BE
docker-compose up -d config-server service-registry zipkin redis auth_db

# 2. Wait for health checks (30-60 giây)
echo "Waiting for infrastructure to be ready..."
sleep 60

# 3. Verify infrastructure health
curl http://localhost:8088/actuator/health
curl http://localhost:8761/actuator/health

# 4. Start development service
./dev-mode.sh auth-service

# 5. Open IntelliJ và import project
# 6. Develop → Save → Test → Repeat
# 7. Stop development mode khi xong
./stop-dev.sh auth-service
```

### Troubleshooting Development Mode

#### 1. Infrastructure not ready errors:

```bash
# Service không start được do infrastructure chưa sẵn sàng
# Solution: Đợi và kiểm tra health

# Kiểm tra config server
curl http://localhost:8088/actuator/health

# Kiểm tra service registry  
curl http://localhost:8761/actuator/health

# Restart infrastructure nếu cần
docker-compose restart config-server service-registry
```

#### 2. Hot reload không hoạt động:

```bash
# Kiểm tra DevTools có được load không
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs auth-service | grep -i devtools

# Restart development container
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml restart auth-service

# Rebuild development image
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml build --no-cache auth-service
```

#### 3. Connection refused errors:

```bash
# Kiểm tra service đã start chưa
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml ps

# Kiểm tra port đã được expose chưa
docker port auth_service_dev

# Kiểm tra health của dependencies
curl http://localhost:8761/eureka/apps  # Service Registry
curl http://localhost:8088/actuator/health  # Config Server
```

#### 4. Database connection issues:

```bash
# Kiểm tra database containers
docker-compose ps | grep mysql

# Test database connection
docker exec -it auth_mysql mysql -u root -prootpassword -e "SHOW DATABASES;"

# Restart database nếu cần
docker-compose restart auth_db
```

#### 5. Memory issues:

```bash
# Tăng memory cho Docker Desktop
# Docker Desktop → Settings → Resources → Memory: 4GB+

# Kiểm tra memory usage
docker stats auth_service_dev
```

#### 6. File permission issues (Linux/Mac):

```bash
# Fix file permissions
sudo chown -R $USER:$USER ./auth-service/target
chmod -R 755 ./auth-service/target
```

### Development Tips

#### 1. Efficient Development Workflow:

```bash
# Quick start script
#!/bin/bash
echo "🚀 Starting Dental Clinic Development Environment..."

# Start infrastructure
docker-compose up -d config-server service-registry zipkin redis auth_db

# Wait for health
echo "⏳ Waiting for infrastructure..."
sleep 45

# Start development service
./dev-mode.sh auth-service

echo "✅ Development environment ready!"
```

#### 2. Debugging Production Issues:

```bash
# So sánh behavior giữa dev và prod
# Dev mode:
curl http://localhost:8081/auth/health

# Prod mode:
docker-compose exec auth-service curl http://localhost:8081/auth/health
```

#### 3. Database Changes:

- **Development mode sử dụng same database như production**
- **Thay đổi schema sẽ affect cả team**
- **Coordinate với team trước khi thay đổi database**

#### 4. Best Practices:

1. **Always start infrastructure trước khi start development services**
2. **Always test trong production mode trước khi commit**
3. **Use meaningful commit messages**
4. **Run tests trước khi push:**
   ```bash
   cd auth-service
   mvn test
   ```
5. **Clean up unused code và imports**
6. **Follow project coding standards**

### Port Reference cho Development:

| Service | Dev Port | Prod Port | LiveReload | Database Port |
|---------|----------|-----------|------------|---------------|
| auth-service | 8081 | 8081 | 35729 | 3306 |
| dental-service | 8082 | 8082 | 35731 | - |
| material-service | 8083 | 8083 | 35730 | 3308 |
| dentist-service | 8084 | 8084 | 35733 | 3307 |
| prescription-service | 8085 | 8085 | 35734 | - |
| patient-service | 8086 | 8086 | 35732 | - |
| schedule-service | 8087 | 8087 | 35735 | - |
| payment-service | 8089 | 8089 | 35736 | 3309 |

**Infrastructure Services:**
- Config Server: 8088
- Service Registry: 8761
- Zipkin: 9411
- Redis: 6379

### Quick Commands Reference:

```bash
# Infrastructure
docker-compose up -d config-server service-registry zipkin redis  # Start infrastructure
docker-compose up -d auth_db material_db dentist_db payment_db    # Start databases

# Development Mode
./dev-mode.sh [service-name]                    # Start dev mode
./stop-dev.sh [service-name]                    # Stop dev mode
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f [service]  # View logs
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml ps                 # Check status

# Production Mode
docker-compose up -d                            # Start all services
docker-compose down                             # Stop all services
docker-compose logs -f [service]                # View logs
docker-compose ps                               # Check status

# Health Checks
curl http://localhost:8088/actuator/health      # Config Server
curl http://localhost:8761/actuator/health      # Service Registry
curl http://localhost:9411/actuator/health      # Zipkin
```

### ⚠️ Common Mistakes to Avoid:

1. **Không start infrastructure trước** → Services sẽ fail to start
2. **Không đợi health checks** → Connections sẽ bị refused
3. **Start tất cả services cùng lúc** → Memory issues
4. **Quên stop development mode** → Port conflicts
5. **Không check logs khi có lỗi** → Khó debug

Happy coding! 🚀