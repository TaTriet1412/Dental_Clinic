-- Tạo cơ sở dữ liệu
CREATE DATABASE dentist;
USE dentist;

-- Bảng faculty (Khoa)
CREATE TABLE faculty (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name TEXT(200) NOT NULL,
    description LONGTEXT NOT NULL
);

-- Bảng dentist (Bác sĩ nha khoa)
CREATE TABLE dentist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    specialty TEXT(200) NOT NULL,
    experienceYear INT NOT NULL,
    facId BIGINT NOT NULL,
    FOREIGN KEY (facId) REFERENCES faculty(id)
);

-- Dữ liệu mẫu cho bảng faculty
INSERT INTO faculty (name, description) VALUES
('Nha chu', 'Chuyên về phòng ngừa, chẩn đoán và điều trị các bệnh liên quan đến nướu và các cấu trúc nâng đỡ răng.'),
('Chữa răng và nội nha', 'Chuyên về điều trị các bệnh lý tủy răng (lấy tủy) và phục hồi hình dạng, chức năng răng bị tổn thương (trám răng).'),
('Tổng quát', 'Thực hiện khám, chẩn đoán tổng quát, vệ sinh răng miệng, trám răng cơ bản và các điều trị nha khoa phổ thông khác.'),
('Phục Hình', 'Chuyên về phục hồi và thay thế răng bị mất hoặc hư tổn nặng bằng các giải pháp như mão răng, cầu răng, răng giả tháo lắp, và implant.'),
('Răng trẻ em', 'Chuyên về chăm sóc sức khỏe răng miệng toàn diện cho trẻ em từ sơ sinh đến tuổi vị thành niên.'),
('Nhổ răng và tiểu phẩu', 'Chuyên về thực hiện nhổ răng (bao gồm răng khôn) và các tiểu phẫu thuật đơn giản trong khoang miệng.');

-- Dữ liệu mẫu cho bảng dentist
INSERT INTO dentist (specialty, experienceYear, facId) VALUES
('Răng trẻ em', 2, 5),          
('Phục Hình', 20, 4),        
('Nha chu', 10, 1),           
('Chữa răng và nội nha', 5, 2),
('Tổng quát', 12, 3),         
('Tổng quát', 1, 3),           
('Nhổ răng và tiểu phẩu', 8, 6),
('Răng trẻ em', 1, 5),        
('Phục Hình', 15, 4),         
('Chữa răng và nội nha', 7, 2), 
('Nha chu', 9, 1),          
('Tổng quát', 4, 3);
