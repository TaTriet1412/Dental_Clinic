CREATE DATABASE dentist;
USE dentist;

CREATE TABLE faculty(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name TEXT(200) NOT NULL,
	description LONGTEXT NOT NULL
);

CREATE TABLE dentist(
	id BIGINT PRIMARY KEY,
    spectialty TEXT(200) NOT NULL,
    experienceYear int NOT NULL
);

INSERT INTO faculty (name, description) VALUES
('Nha chu', 'Chuyên về phòng ngừa, chẩn đoán và điều trị các bệnh liên quan đến nướu và các cấu trúc nâng đỡ răng.'),
('Chữa răng và nội nha', 'Chuyên về điều trị các bệnh lý tủy răng (lấy tủy) và phục hồi hình dạng, chức năng răng bị tổn thương (trám răng).'),
('Tổng quát', 'Thực hiện khám, chẩn đoán tổng quát, vệ sinh răng miệng, trám răng cơ bản và các điều trị nha khoa phổ thông khác.'),
('Phục Hình', 'Chuyên về phục hồi và thay thế răng bị mất hoặc hư tổn nặng bằng các giải pháp như mão răng, cầu răng, răng giả tháo lắp, và implant.'),
('Răng trẻ em', 'Chuyên về chăm sóc sức khỏe răng miệng toàn diện cho trẻ em từ sơ sinh đến tuổi vị thành niên.'),
('Nhổ răng và tiểu phẩu', 'Chuyên về thực hiện nhổ răng (bao gồm răng khôn) và các tiểu phẫu thuật đơn giản trong khoang miệng.');

INSERT INTO dentist (id, specialty, experienceYear) VALUES
(4, 'Răng trẻ em', 2),          
(5, 'Phục Hình', 20),        
(6, 'Nha chu', 10),           
(7, 'Chữa răng và nội nha', 5),
(8, 'Tổng quát', 12),         
(9, 'Tổng quát', 1),           
(10, 'Nhổ răng và tiểu phẩu', 8),
(11, 'Răng trẻ em', 1),        
(12, 'Phục Hình', 15),         
(13, 'Chữa răng và nội nha', 7), 
(14, 'Nha chu', 9),          
(15, 'Tổng quát', 4);         


