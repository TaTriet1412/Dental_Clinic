Đường dẫn đến dự án: https://github.com/TaTriet1412/Dental_Clinic

# Dự Án Phát Triển Phần Mềm Dental_Clinic

## Tổng Quan

Dự án này được xây dựng sử dụng các công nghệ **Docker**, **MySQL**, **Angular**, và **Spring Boot** (trong kiến trúc microservices). Mục tiêu của dự án là minh họa các nguyên tắc phát triển phần mềm hiện đại, mẫu thiết kế và các thực tiễn tốt nhất trong việc xây dựng ứng dụng có thể mở rộng, dễ bảo trì và hiệu quả cho một phòng khám nha khoa.

## Nguyên Tắc Phát Triển Phần Mềm

### 1. **Tách Biệt Các Mối Quan Tâm (Separation of Concerns - SoC)**
- Kiến trúc dự án được thiết kế để đảm bảo các mối quan tâm khác nhau của ứng dụng (ví dụ: giao diện người dùng, logic nghiệp vụ, lưu trữ dữ liệu) được tách biệt thành các lớp riêng biệt.
- **Angular** chịu trách nhiệm về phần giao diện người dùng (UI) và xử lý tương tác với người dùng thông qua các **API**.
- **Spring Boot** quản lý logic nghiệp vụ phía server thông qua nhiều microservices, mỗi service cung cấp các **RESTful API** để giao tiếp với **Angular** hoặc các service khác.
- **MySQL** được sử dụng để lưu trữ dữ liệu, và **Docker** đảm bảo môi trường phát triển và sản xuất đồng nhất.

### 2. **DRY (Don't Repeat Yourself - Đừng Lặp Lại Mình)**
- Dự án tuân theo nguyên tắc DRY bằng cách đảm bảo mã nguồn tái sử dụng và tránh sự lặp lại không cần thiết.
- Các lớp dịch vụ trong mỗi microservice **Spring Boot** được thiết kế để tái sử dụng, và các component trong **Angular** giúp tái sử dụng mã giao diện người dùng.

### 3. **DDD (Domain Driven Design - Thiết kế Hướng Miền)**
- Thay vì bắt đầu từ công nghệ, DDD ưu tiên hiểu sâu về domain (miền vấn đề) của ứng dụng phòng khám nha khoa, sau đó sử dụng ngôn ngữ mô hình hóa để chuyển đổi hiểu biết đó thành một mô hình phần mềm.
- Điều này giúp đảm bảo rằng phần mềm được phát triển đáp ứng chính xác nhu cầu của người dùng và dễ dàng bảo trì, mở rộng trong tương lai.

### 4. **YAGNI (You Aren't Gonna Need It - Bạn Không Cần Nó)**
- Trong quá trình phát triển, chỉ những tính năng thực sự cần thiết mới được triển khai. Điều này giúp giảm thiểu độ phức tạp và thời gian phát triển.
- Chúng tôi tránh việc thêm các tính năng chưa cần thiết vào giai đoạn đầu của dự án.

## Mẫu Thiết Kế (Design Patterns) Áp Dụng

### 1. **Microservices Architecture & RESTful API**
- Dự án sử dụng kiến trúc **Microservices** cho backend, với mỗi service là một ứng dụng Spring Boot độc lập.
- Giao tiếp giữa **Angular** (frontend) và các microservices (backend), cũng như giữa các microservices với nhau (nếu cần), được thực hiện thông qua **RESTful API**. Các endpoint API trong **Spring Boot** nhận và trả dữ liệu (thường là JSON).
- Các phương thức HTTP như **GET**, **POST**, **PUT**, **DELETE**, **PATCH** được sử dụng để thao tác với các tài nguyên.

### 2. **Service Layer Pattern**
- Mỗi microservice **Spring Boot** sử dụng mẫu thiết kế **Service Layer** để tổ chức mã nguồn một cách rõ ràng và dễ bảo trì. Lớp **Service** xử lý các nghiệp vụ và logic ứng dụng, tương tác với **Repository** để truy xuất hoặc lưu trữ dữ liệu trong **MySQL**.
- Các controller trong **Spring Boot** nhận yêu cầu, gọi đến các service để thực hiện các nghiệp vụ, và trả kết quả dưới dạng phản hồi JSON.

### 3. **Repository Pattern**
- Mẫu thiết kế **Repository** được sử dụng trong các microservices **Spring Boot** (thường thông qua Spring Data JPA) để tương tác với cơ sở dữ liệu, giúp tách biệt logic truy cập dữ liệu khỏi các lớp dịch vụ.

## Thực Tiễn Phát Triển Phần Mềm

### 1. **DevOps và Continuous Integration**
- Dự án này áp dụng các thực tiễn DevOps để đảm bảo việc triển khai liên tục và tự động. **Docker** được sử dụng để đóng gói ứng dụng và đảm bảo môi trường phát triển đồng nhất.
- Các công cụ tích hợp liên tục (CI) có thể được sử dụng để tự động kiểm tra, xây dựng và triển khai ứng dụng.

### 2. **Testing**
- **JUnit** và **Mockito** (hoặc các framework tương tự) được sử dụng trong **Spring Boot** để thực hiện kiểm thử đơn vị, giúp đảm bảo các chức năng phía server hoạt động chính xác.
- **Karma** và **Jasmine** (hoặc các framework tương tự) được sử dụng trong **Angular** để thực hiện kiểm thử đơn vị cho các component và service, đảm bảo tính ổn định của giao diện người dùng.

### 3. **Containerization và Môi Trường Phát Triển Đồng Nhất**
- Sử dụng **Docker** để tạo môi trường phát triển và sản xuất đồng nhất, giúp đảm bảo ứng dụng hoạt động giống nhau trên mọi hệ thống. Docker Compose có thể được sử dụng để dễ dàng quản lý các container cho các microservices **Spring Boot** và **MySQL**.

### 4. **Quản Lý Phiên Bản**
- **Git** được sử dụng để quản lý mã nguồn, đảm bảo quy trình phát triển tuân thủ các thực tiễn quản lý mã nguồn chuẩn.

## Công Nghệ Sử Dụng

- **Docker**: Dùng để container hóa ứng dụng và tạo môi trường phát triển đồng nhất.
- **MySQL**: Cơ sở dữ liệu quan hệ dùng để lưu trữ dữ liệu của ứng dụng (ví dụ: material-service, dentist-service, payment-service, auth-service).
- **MongoDB**: Cơ sở dữ liệu NoSQL dạng document, được sử dụng cho các service cần lưu trữ dữ liệu linh hoạt và có cấu trúc thay đổi (ví dụ: schedule-service, patient-service, prescription-service, dental-service).
- **Angular**: Framework JavaScript cho việc phát triển giao diện người dùng và tương tác với các **Spring Boot API**.
- **Spring Boot**: Framework Java cho việc phát triển các microservices back-end mạnh mẽ, cung cấp **RESTful API**.
- **Redis**: CSDL mã nguồn mở, hoạt động trên bộ nhớ (in-memory database), có thể được sử dụng cho caching, session management, hoặc các tác vụ yêu cầu hiệu suất cao. (Đề cập trong README gốc, giả định vẫn sử dụng).

## Cấu trúc thư mục của dự án Spring Boot (Backend - Microservices)
```
Dental_Clinic_BE/
├── auth-service/ (MySQL)
│   ├── src/main/java/com/dental_clinic/auth_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── dental-service/ (MongoDB)
│   ├── src/main/java/com/dental_clinic/dental_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── dentist-service/ (MySQL)
│   ├── src/main/java/com/dental_clinic/dentist_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── material-service/ (MySQL)
│   ├── src/main/java/com/dental_clinic/material_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── patient-service/ (MongoDB)
│   ├── src/main/java/com/dental_clinic/patient_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── payment-service/ (MySQL)
│   ├── src/main/java/com/dental_clinic/payment_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── prescription-service/ (MongoDB)
│   ├── src/main/java/com/dental_clinic/prescription_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── schedule-service/ (MongoDB)
│   ├── src/main/java/com/dental_clinic/schedule_service/...
│   ├── src/main/resources/application.properties (hoặc .yml)
│   └── pom.xml
├── Database/
│   ├── MySql/
│   │   └── dentist.sql  # Script khởi tạo CSDL cho các service liên quan MySQL
│   └── MongoDB/
│       ├── schedule/
│       │   └── json_create_data.js # Script tạo dữ liệu cho schedule-service
│       ├── patient/
│       │   └── json_create_patient.js # Script tạo dữ liệu cho patient-service
│       ├── prescription/
│       │   └── logic_create_prescription.js # Script tạo dữ liệu cho prescription-service
│       └── dental/
│           └── json_create_dental.js # Script tạo dữ liệu cho dental-service (giả định)
└── uploads/             # (Có thể được quản lý bởi từng service hoặc một service chuyên biệt)
```
*Mỗi microservice (ví dụ: `auth-service`) sẽ có cấu trúc nội bộ tương tự như một dự án Spring Boot tiêu chuẩn:*

## Cấu trúc thư mục của dự án Angular (Frontend)
```
Dental_Clinic_FE/dental_clinic/  # Thư mục gốc của dự án Angular
├── src/
│   ├── app/
│   │   ├── core/                # Services, Guards, Interceptors, Constants cốt lõi.
│   │   │   ├── constants/       # (ví dụ: routes.constant.ts)
│   │   │   ├── guards/          # Guards cho routing.
│   │   │   ├── interceptors/    # HTTP Interceptors.
│   │   │   └── services/        # Services dùng chung (AuthService, SnackBarService, etc.).
│   │   ├── Modules/             # Các feature modules theo vai trò người dùng.
│   │   │   ├── admin/           # Module cho vai trò Quản trị viên.
│   │   │   │   ├── default-ui/  # Layout chung cho Admin (header, sidebar, footer).
│   │   │   │   └── views/       # Các components là view/page của Admin.
│   │   │   ├── dentist/         # Module cho vai trò Nha sĩ.
│   │   │   │   ├── default-ui/  # Layout chung cho Dentist.
│   │   │   │   └── views/       # Các views/pages của Dentist.
│   │   │   ├── receptionist/    # Module cho vai trò Lễ tân.
│   │   │   │   ├── default-ui/  # Layout chung cho Receptionist.
│   │   │   │   └── views/       # Các views/pages của Receptionist.
│   │   │   └── user/            # Module cho người dùng/khách (ví dụ: login, register, trang chủ công khai).
│   │   │       └── views/       # Các views/pages của User.
│   │   ├── share/               # Components, DTOs, Pipes, Directives dùng chung giữa các modules.
│   │   │   ├── components/      # Các UI components tái sử dụng (ví dụ: custom modal, loader).
│   │   │   └── dto/             # Data Transfer Objects.
│   │   │       ├── request/     # DTOs cho request payloads.
│   │   │       └── response/    # DTOs cho response data.
│   │   ├── app-routing.module.ts # Module quản lý routing chính của ứng dụng.
│   │   ├── app.component.html   # Template HTML cho component gốc (app-root).
│   │   ├── app.component.scss   # Styles SCSS/CSS cho component gốc.
│   │   ├── app.component.ts     # Logic TypeScript cho component gốc.
│   │   └── app.module.ts        # Module gốc của ứng dụng Angular.
│   ├── assets/                  # Chứa các tài nguyên tĩnh như hình ảnh, fonts, etc.
│   ├── environments/            # Chứa các file cấu hình cho các môi trường khác nhau (development, production).
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html               # File HTML gốc của ứng dụng, nơi Angular render.
│   ├── main.ts                  # Điểm khởi đầu (bootstrap) của ứng dụng Angular.
│   └── styles.scss              # File SCSS/CSS global cho toàn bộ ứng dụng.
├── .editorconfig                # Cấu hình coding style cho editor.
├── .gitignore                   # Chỉ định các file/folder được Git bỏ qua.
├── angular.json                 # Cấu hình workspace và project của Angular CLI.
├── package.json                 # Liệt kê dependencies và scripts của dự án (npm/yarn).
├── proxy.conf.json              # Cấu hình proxy cho Angular development server (để giải quyết CORS khi gọi API).
├── tsconfig.app.json            # Cấu hình TypeScript riêng cho phần ứng dụng.
├── tsconfig.json                # Cấu hình TypeScript gốc cho toàn bộ project.
└── tsconfig.spec.json           # Cấu hình TypeScript cho các file test.
```
## Các Bước Cần Thiết Để Chạy Ứng Dụng Trên Máy Tính Cục Bộ

Để chạy ứng dụng trên máy tính cục bộ, bạn cần thực hiện các bước dưới đây cho cả phần **backend** (Spring Boot) và **frontend** (Angular).

### 1. **Cài Đặt Môi Trường Phát Triển**

Đảm bảo rằng môi trường phát triển của bạn đã cài đặt các công cụ sau:

#### Các Công Cụ Cần Cài Đặt:

- **JDK 11 hoặc cao hơn**: Dự án Spring Boot yêu cầu Java Development Kit (JDK) phiên bản 11 trở lên. Bạn có thể tải JDK từ
  [Oracle]
  (https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
  hoặc
  [OpenJDK]
  (https://openjdk.java.net/).
- **Maven**: Dự án sử dụng Maven để quản lý phụ thuộc. Tải và cài đặt Maven từ
  [Maven]
  (https://maven.apache.org/).
- **Node.js và npm**: Angular yêu cầu Node.js và npm. Truy cập
  [Node.js]
  (https://nodejs.org/) và tải phiên bản LTS.
- **Git**: Cài đặt Git để quản lý mã nguồn. Tải Git từ
  [Git]
  (https://git-scm.com/).
- **Docker và Docker Compose**: Cài đặt Docker để chạy toàn bộ hệ thống Backend. Tải Docker từ
  [Docker]
  (https://www.docker.com/products/docker-desktop/).

### 2. **Clone Repository**

```bash
git clone https://github.com/TaTriet1412/Dental_Clinic
cd Dental_Clinic
```

### 3. **Cấu hình quyền cho file cấu hình MySQL (Windows)**

Để tránh lỗi về quyền khi sử dụng file cấu hình `mysql-utf8.cnf` với Docker, hãy chạy lệnh sau (lưu ý thay đổi đường dẫn cho phù hợp với máy của bạn):

```bash
docker run --rm -v "<đường_dẫn_đến_thư_mục_MySql_trên_máy_bạn>:/data" busybox sh -c "chmod 644 /data/mysql-utf8.cnf"
```

**Chú ý:**
- Thay `<đường_dẫn_đến_thư_mục_MySql_trên_máy_bạn>` bằng đường dẫn thư mục chứa file `mysql-utf8.cnf` trên máy tính cá nhân của bạn.
- Ví dụ: Nếu trên máy bạn là `D:\MyProject\Database\MySql` thì lệnh sẽ là:
  ```bash
  docker run --rm -v "D:\MyProject\Dental_Clinic\Dental_Clinic_BE\Database\MySql:/data" busybox sh -c "chmod 644 /data/mysql-utf8.cnf"
  ```
- Đảm bảo file `mysql-utf8.cnf` đã tồn tại trong thư mục đó trước khi chạy lệnh.

### 4. **Chạy Phần Backend (Microservices với Docker Compose)**

1. Mở terminal và điều hướng đến thư mục chứa mã nguồn Backend:
   ```bash
   cd Dental_Clinic_BE
   ```

2. Build tất cả các Docker images cho microservices:
   ```bash
   docker-compose build
   ```

3. Khởi động toàn bộ hệ thống backend (tất cả microservices, databases, và infrastructure services):
   ```bash
   docker-compose up -d
   ```

4. Kiểm tra trạng thái các containers:
   ```bash
   docker-compose ps
   ```

5. Xem logs của các services (nếu cần):
   ```bash
   # Xem logs của tất cả services
   docker-compose logs -f
   
   # Xem logs của một service cụ thể
   docker-compose logs -f auth-service
   ```

6. Dừng hệ thống khi không sử dụng:
   ```bash
   docker-compose down
   ```

**Các Services sẽ được khởi động:**
- **Config Server**: http://localhost:8088
- **Service Registry (Eureka)**: http://localhost:8761
- **API Gateway**: http://localhost:8060
- **Auth Service**: http://localhost:8081
- **Dental Service**: http://localhost:8082
- **Material Service**: http://localhost:8083
- **Dentist Service**: http://localhost:8084
- **Prescription Service**: http://localhost:8085
- **Patient Service**: http://localhost:8086
- **Schedule Service**: http://localhost:8087
- **Payment Service**: http://localhost:8089
- **Zipkin (Tracing)**: http://localhost:9411
- **Redis**: localhost:6379
- **MySQL Databases**: 
  - Auth DB: localhost:3306
  - Dentist DB: localhost:3307
  - Material DB: localhost:3308
  - Payment DB: localhost:3309

### 5. **Chạy Phần Frontend (Angular)**

1. Mở terminal mới và điều hướng đến thư mục Frontend:
   ```bash
   cd Dental_Clinic_FE/dental_clinic
   ```

2. Cài đặt tất cả các phụ thuộc cần thiết cho dự án Angular:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Chạy ứng dụng Angular:
   ```bash
   npm start
   ```

### 6. **Kiểm tra kết nối Backend và Frontend**

1. Truy cập http://localhost:4200 trong trình duyệt để xem giao diện người dùng Angular.
2. Ứng dụng Angular sẽ gửi các yêu cầu HTTP đến http://localhost:8060 (API Gateway) để giao tiếp với các microservices backend.
3. Kiểm tra Service Registry tại http://localhost:8761 để xem tất cả microservices đã đăng ký thành công.
4. Kiểm tra distributed tracing tại http://localhost:9411 để theo dõi requests qua các services.

### 7. **Troubleshooting**

Nếu gặp vấn đề, hãy kiểm tra:

1. **Logs của containers:**
   ```bash
   docker-compose logs [service-name]
   ```

2. **Trạng thái health của services:**
   - Truy cập http://localhost:8761 để kiểm tra Service Registry
   - Kiểm tra health endpoints: http://localhost:[port]/actuator/health

3. **Restart services nếu cần:**
   ```bash
   docker-compose restart [service-name]
   ```

4. **Rebuild và restart toàn bộ hệ thống:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### 8. **Development Mode (Khuyến nghị)**

Để phát triển một service cụ thể với hot reload:

1. **Setup development environment:**
   ```bash
   cd Dental_Clinic_BE
   
   # Tạo docker-compose.dev.yaml với cấu hình hot reload
   # Copy từ template được cung cấp
   ```

2. **Start development mode cho service cụ thể:**
   ```bash
   # Ví dụ: phát triển auth-service
   docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d auth-service
   ```

3. **Development workflow:**
   - Mở IntelliJ IDEA/VS Code
   - Edit code trong `auth-service/src`
   - Save file (Ctrl+S)
   - Spring DevTools tự động reload container
   - Test changes tại http://localhost:8081

4. **Return to production mode:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

**Lợi ích:**
- ✅ Thay đổi code được phản ánh ngay lập tức
- ✅ Không cần rebuild Docker images
- ✅ Giữ được consistency với infrastructure
- ✅ Team có thể làm việc parallel trên các services khác nhau