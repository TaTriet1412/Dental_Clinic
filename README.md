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
Dental_Clinic_BE/<br>
├── auth-service/ (MySQL)<br>
│   ├── src/main/java/com/dental_clinic/auth_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── dental-service/ (MongoDB)<br>
│   ├── src/main/java/com/dental_clinic/dental_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── dentist-service/ (MySQL)<br>
│   ├── src/main/java/com/dental_clinic/dentist_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── material-service/ (MySQL)<br>
│   ├── src/main/java/com/dental_clinic/material_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── patient-service/ (MongoDB)<br>
│   ├── src/main/java/com/dental_clinic/patient_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── payment-service/ (MySQL)<br>
│   ├── src/main/java/com/dental_clinic/payment_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── prescription-service/ (MongoDB)<br>
│   ├── src/main/java/com/dental_clinic/prescription_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── schedule-service/ (MongoDB)<br>
│   ├── src/main/java/com/dental_clinic/schedule_service/...<br>
│   ├── src/main/resources/application.properties (hoặc .yml)<br>
│   └── pom.xml<br>
├── Database/<br>
│   ├── MySql/<br>
│   │   └── dentist.sql  # Script khởi tạo CSDL cho các service liên quan MySQL<br>
│   └── MongoDB/<br>
│       ├── schedule/<br>
│       │   └── json_create_data.js # Script tạo dữ liệu cho schedule-service<br>
│       ├── patient/<br>
│       │   └── json_create_patient.js # Script tạo dữ liệu cho patient-service<br>
│       ├── prescription/<br>
│       │   └── logic_create_prescription.js # Script tạo dữ liệu cho prescription-service<br>
│       └── dental/<br>
│           └── json_create_dental.js # Script tạo dữ liệu cho dental-service (giả định)<br>
└── uploads/             # (Có thể được quản lý bởi từng service hoặc một service chuyên biệt)<br>

*Mỗi microservice (ví dụ: `auth-service`) sẽ có cấu trúc nội bộ tương tự như một dự án Spring Boot tiêu chuẩn:*

## Cấu trúc thư mục của dự án Angular (Frontend)

Dental_Clinic_FE/dental_clinic/  # Thư mục gốc của dự án Angular<br>
├── src/<br>
│   ├── app/<br>
│   │   ├── core/                # Services, Guards, Interceptors, Constants cốt lõi.<br>
│   │   │   ├── constants/       # (ví dụ: routes.constant.ts)<br>
│   │   │   ├── guards/          # Guards cho routing.<br>
│   │   │   ├── interceptors/    # HTTP Interceptors.<br>
│   │   │   └── services/        # Services dùng chung (AuthService, SnackBarService, etc.).<br>
│   │   ├── Modules/             # Các feature modules theo vai trò người dùng.<br>
│   │   │   ├── admin/           # Module cho vai trò Quản trị viên.<br>
│   │   │   │   ├── default-ui/  # Layout chung cho Admin (header, sidebar, footer).<br>
│   │   │   │   └── views/       # Các components là view/page của Admin.<br>
│   │   │   ├── dentist/         # Module cho vai trò Nha sĩ.<br>
│   │   │   │   ├── default-ui/  # Layout chung cho Dentist.<br>
│   │   │   │   └── views/       # Các views/pages của Dentist.<br>
│   │   │   ├── receptionist/    # Module cho vai trò Lễ tân.<br>
│   │   │   │   ├── default-ui/  # Layout chung cho Receptionist.<br>
│   │   │   │   └── views/       # Các views/pages của Receptionist.<br>
│   │   │   └── user/            # Module cho người dùng/khách (ví dụ: login, register, trang chủ công khai).<br>
│   │   │       └── views/       # Các views/pages của User.<br>
│   │   ├── share/               # Components, DTOs, Pipes, Directives dùng chung giữa các modules.<br>
│   │   │   ├── components/      # Các UI components tái sử dụng (ví dụ: custom modal, loader).<br>
│   │   │   └── dto/             # Data Transfer Objects.<br>
│   │   │       ├── request/     # DTOs cho request payloads.<br>
│   │   │       └── response/    # DTOs cho response data.<br>
│   │   ├── app-routing.module.ts # Module quản lý routing chính của ứng dụng.<br>
│   │   ├── app.component.html   # Template HTML cho component gốc (app-root).<br>
│   │   ├── app.component.scss   # Styles SCSS/CSS cho component gốc.<br>
│   │   ├── app.component.ts     # Logic TypeScript cho component gốc.<br>
│   │   └── app.module.ts        # Module gốc của ứng dụng Angular.<br>
│   ├── assets/                  # Chứa các tài nguyên tĩnh như hình ảnh, fonts, etc.<br>
│   ├── environments/            # Chứa các file cấu hình cho các môi trường khác nhau (development, production).<br>
│   │   ├── environment.ts<br>
│   │   └── environment.prod.ts<br>
│   ├── index.html               # File HTML gốc của ứng dụng, nơi Angular render.<br>
│   ├── main.ts                  # Điểm khởi đầu (bootstrap) của ứng dụng Angular.<br>
│   └── styles.scss              # File SCSS/CSS global cho toàn bộ ứng dụng.<br>
├── .editorconfig                # Cấu hình coding style cho editor.<br>
├── .gitignore                   # Chỉ định các file/folder được Git bỏ qua.<br>
├── angular.json                 # Cấu hình workspace và project của Angular CLI.<br>
├── package.json                 # Liệt kê dependencies và scripts của dự án (npm/yarn).<br>
├── proxy.conf.json              # Cấu hình proxy cho Angular development server (để giải quyết CORS khi gọi API).<br>
├── tsconfig.app.json            # Cấu hình TypeScript riêng cho phần ứng dụng.<br>
├── tsconfig.json                # Cấu hình TypeScript gốc cho toàn bộ project.<br>
└── tsconfig.spec.json           # Cấu hình TypeScript cho các file test.<br>

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
- **IntelliJ IDEA**: Dự án sử dụng IntelliJ IDEA để phát triển ứng dụng Spring Boot. Tải và cài đặt IntelliJ từ
  [JetBrains]
  (https://www.jetbrains.com/idea/).
- **Git**: Cài đặt Git để quản lý mã nguồn. Tải Git từ
  [Git]
  (https://git-scm.com/).
- **Docker**: Cài đặt Docker để chạy Server. Tải Docker từ
  [Docker]
  (https://www.docker.com/products/docker-desktop/).

### 2. **Thiết lập CSDL**

1.  **MySQL**
    *   Mở terminal và chạy lệnh để kéo image MySQL: `docker pull mysql:latest` (hoặc phiên bản cụ thể).
    *   Chạy container MySQL: `docker run --name dental-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=your_strong_password -d mysql:latest`
        *   Thay `your_strong_password` bằng mật khẩu của bạn.
    *   Kiểm tra container: `docker ps`.
    *   Tạo database: Kết nối vào MySQL instance (ví dụ, sử dụng MySQL Workbench hoặc DBeaver) và chạy script SQL từ `Dental_Clinic_BE/Database/MySql/dentist.sql` (hoặc các file .sql tương ứng cho từng service như `material.sql`, `dentist.sql`, `payment.sql`, `auth.sql`) để tạo schema và các bảng cần thiết.

2.  **MongoDB**
    *   Mở terminal và chạy lệnh để kéo image MongoDB: `docker pull mongo:latest`.
    *   Chạy container MongoDB: `docker run --name dental-mongo -p 27017:27017 -d mongo:latest`
    *   Kiểm tra container: `docker ps`.
    *   Tạo databases và collections:
        *   Kết nối vào MongoDB instance (ví dụ, sử dụng MongoDB Compass hoặc `mongosh`).
        *   Đối với mỗi service sử dụng MongoDB (schedule, patient, prescription, dental), tạo database tương ứng (ví dụ: `schedule_db`, `patient_db`, `prescription_db`, `dental_db`).
        *   Trong mỗi database, chạy các script `.js` tương ứng từ thư mục `Dental_Clinic_BE/Database/MongoDB/` để tạo collections và chèn dữ liệu mẫu (ví dụ: `json_create_data.js` cho `schedule_db`).
        *   Lưu ý: Cấu hình `spring.data.mongodb.uri` và `spring.data.mongodb.database` trong file `application.properties` hoặc `application.yml` của mỗi service MongoDB để trỏ đến đúng instance và database. Ví dụ, cho `dental-service`:
            ```yaml
            spring:
              data:
                mongodb:
                  uri: mongodb://localhost:27017 # Hoặc URI của MongoDB Atlas nếu dùng cloud
                  database: dental_db # Tên database cho dental-service
            ```
            Tương tự cho các service khác sử dụng MongoDB, thay `database` bằng tên database tương ứng.

3.  **Redis** (Nếu sử dụng cho caching, OTP, etc.)
    *   Mở terminal hoặc command prompt và chạy lệnh sau để kéo hình ảnh Redis từ Docker Hub: `docker pull redis:latest`
    *   Chạy lệnh sau để khởi chạy một container Redis mới: `docker run -d --name myredis12 -p 6379:6379 redis:latest`
    *   Kiểm tra xem container Redis đã chạy thành công, sử dụng lệnh: `docker ps`

### 3. **Chạy Phần Backend (Spring Boot)**

1. Mở **IntelliJ IDEA**.
2. Chọn **Open** và điều hướng đến thư mục chứa mã nguồn của dự án Spring Boot (thư mục `com.peaceful_land` > `BackEnd`).
3. IntelliJ sẽ tự động nhận diện dự án và tải các phụ thuộc
4. Dưa vào file application.yaml để cấu hình mysql tương thích (chạy database trong workbench với tên spring_commerce, file được cung cấp trong folder Model của com.triet.spring_commerce) *Lưu ý username và password là "root"
5. Bấm nút "Start" sau khi cấu hình thành công

### 4. **Chạy Phần Frontend (Angular)**
1. Mở terminal, cd đến thư mục root của Frontend `com.peaceful_land` > `FrontEnd` > `peaceful-land`
2. Cài đặt tất cả các phụ thuộc cần thiết cho dự án Angular bằng cách chạy lệnh sau (npm install)
3. Chạy ứng dụng (npm start)

### 5. **Kiểm tra kết nối Backend và Frontend **
1. Truy cập http://localhost:4200 trong trình duyệt. Đây là giao diện người dùng của ứng dụng Angular.
2. Ứng dụng Angular sẽ gửi các yêu cầu HTTP đến http://localhost:8080 (backend) để lấy hoặc gửi dữ liệu.
3. Kiểm tra xem các chức năng trong ứng dụng có hoạt động như mong đợi hay không, ví dụ: đăng nhập, hiển thị danh sách sản phẩm,...
