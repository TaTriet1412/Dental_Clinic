SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE category
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name TEXT(200) NOT NULL ,
  description LONGTEXT NOT NULL,
  note LONGTEXT NOT NULL,
  able BIT NOT NULL DEFAULT 1,    
  created_at DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE material
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  name TEXT(200) NOT NULL ,
  quantity INT NOT NULL check(quantity>=0),
  unit TEXT(50) NOT NULL,
  func LONGTEXT NOT NULL,
  mfg_date DATE NOT NULL,
  able BIT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  img VARCHAR(200) NOT NULL,
  CONSTRAINT fk_material_category FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE material_log
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  message LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  material_id BIGINT NOT NULL,
  CONSTRAINT fk_material_material_log FOREIGN KEY (material_id) REFERENCES material(id)
);

CREATE TABLE fixed_material
(
  id BIGINT PRIMARY KEY,
  CONSTRAINT fk_material_fixed FOREIGN KEY (id) REFERENCES material(id)
);

CREATE TABLE consumable_material
(
  id BIGINT PRIMARY KEY,
  CONSTRAINT fk_material_consumable FOREIGN KEY (id) REFERENCES material(id)
);


CREATE TABLE ingredient
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name TEXT(200) NOT NULL ,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  able BIT NOT NULL DEFAULT 1
);


CREATE TABLE ingredient_consumable_material
(
  ingredient_id BIGINT NOT NULL,
  con_mat_id BIGINT NOT NULL,
  PRIMARY KEY (ingredient_id,con_mat_id),
  CONSTRAINT fk_ingre FOREIGN KEY (ingredient_id) REFERENCES ingredient(id),
  CONSTRAINT fk_consumable FOREIGN KEY (con_mat_id) REFERENCES consumable_material(id)
);

CREATE TABLE medicine
(
  id BIGINT PRIMARY KEY,
  cared_actor TEXT(200) NOT NULL,
  cost INT NOT NULL check(cost>=0),
  price INT NOT NULL check(price>=0),
  instruction LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  able BIT NOT NULL DEFAULT 1,
  CONSTRAINT fk_medicine_consumable FOREIGN KEY (id) REFERENCES consumable_material(id)
);

INSERT INTO category (name, description, note) VALUES
('Mũi cạo', 'Dụng cụ dùng để cạo vôi răng và làm sạch mảng bám', 'Dùng cho các dịch vụ vệ sinh răng miệng định kỳ, áp dụng cho khách hàng trên 18 tuổi'),
('Kềm', 'Dụng cụ nha khoa dùng để kẹp và giữ các vật liệu', 'Dùng trong các thủ thuật như nhổ răng, gắn chỉnh nha, hoặc giữ vật liệu trám'),
('Nạy', 'Dụng cụ dùng để nạy và tách các vật liệu trong quá trình điều trị', 'Thường dùng trong các thủ thuật nhổ răng hoặc loại bỏ vật liệu cũ'),
('Gương nha khoa', 'Dụng cụ dùng để quan sát bên trong khoang miệng', 'Dùng trong tất cả các thủ thuật nha khoa để kiểm tra và quan sát chi tiết'),
('Thám trâm', 'Dụng cụ dùng để thăm dò và kiểm tra các vùng khó tiếp cận', 'Dùng để kiểm tra sâu răng, túi nướu, hoặc các vấn đề khác trong khoang miệng'),
('Nạo ngà', 'Dụng cụ dùng để nạo và làm sạch ngà răng', 'Dùng trong các thủ thuật điều trị sâu răng hoặc chuẩn bị bề mặt trám'),
('Kẹp', 'Dụng cụ dùng để kẹp và giữ các vật liệu trong quá trình điều trị', 'Dùng trong các thủ thuật như gắn chỉnh nha, trám răng, hoặc nhổ răng'),
('Bay trám', 'Dụng cụ dùng để trám và định hình vật liệu trám', 'Dùng trong các thủ thuật trám răng để đảm bảo vật liệu trám được định hình chính xác'),
('Cây đo túi nướu', 'Dụng cụ dùng để đo độ sâu của túi nướu', 'Dùng trong chẩn đoán và điều trị bệnh nha chu'),
('Đèn', 'Dụng cụ dùng để chiếu sáng trong quá trình điều trị', 'Dùng trong tất cả các thủ thuật nha khoa để cung cấp ánh sáng trực tiếp vào vùng điều trị'),
('Ống chích', 'Dụng cụ dùng để tiêm thuốc hoặc vật liệu vào vùng điều trị', 'Dùng trong các thủ thuật gây tê hoặc bơm vật liệu trám'),
('Composite đặc', 'Vật liệu dùng để trám răng, có độ đặc cao', 'Dùng trong các thủ thuật trám răng để phục hồi răng bị sâu hoặc vỡ'),
('Composite lỏng', 'Vật liệu dùng để trám răng, có độ lỏng cao', 'Dùng trong các thủ thuật trám răng để phục hồi răng với độ chính xác cao'),
('Bonding', 'Chất kết dính dùng để gắn vật liệu trám vào răng', 'Dùng trong các thủ thuật trám răng để đảm bảo độ bám dính của vật liệu trám'),
('Cọ Bond', 'Dụng cụ dùng để quét chất kết dính lên bề mặt răng', 'Dùng trong các thủ thuật trám răng để phân phối đều chất kết dính'),
('Bông gòn', 'Vật liệu dùng để thấm và làm sạch trong quá trình điều trị', 'Dùng trong tất cả các thủ thuật nha khoa để thấm dịch và làm sạch vùng điều trị'),
('Mũi khoan', 'Dụng cụ dùng để khoan và làm sạch răng', 'Dùng trong các thủ thuật trám răng hoặc điều trị tủy để loại bỏ mô răng bị hư hỏng'),
('Sealer trám bít', 'Chất dùng để trám bít ống tủy', 'Dùng trong các thủ thuật nội nha để đảm bảo ống tủy được bít kín hoàn toàn'),
('Cone', 'Vật liệu dùng để trám bít ống tủy', 'Dùng trong các thủ thuật nội nha để lấp đầy ống tủy sau khi làm sạch'),
('Chất làm sạch và khử khuẩn', 'Chất dùng để làm sạch và khử khuẩn ống tủy', 'Dùng trong các thủ thuật nội nha để đảm bảo ống tủy không còn vi khuẩn'),
('Trâm', 'Dụng cụ dùng để làm sạch và định hình ống tủy', 'Dùng trong các thủ thuật nội nha để loại bỏ mô tủy và định hình ống tủy'),
('Spongel', 'Vật liệu dùng để cầm máu trong quá trình điều trị', 'Dùng trong các thủ thuật nha chu hoặc nhổ răng để kiểm soát chảy máu'),
('Mũi đánh bóng', 'Dụng cụ dùng để đánh bóng bề mặt răng', 'Dùng trong các thủ thuật nha chu để làm bóng bề mặt răng sau khi cạo vôi'),
('Chổi đánh bóng', 'Dụng cụ dùng để đánh bóng bề mặt răng', 'Dùng trong các thủ thuật nha chu để làm bóng bề mặt răng sau khi cạo vôi'),
('Sò đánh bóng', 'Dụng cụ dùng để đánh bóng bề mặt răng', 'Dùng trong các thủ thuật nha chu để làm bóng bề mặt răng sau khi cạo vôi'),
('Chỉ khẩu', 'Chỉ dùng để khâu vết thương trong quá trình nhổ răng', 'Dùng trong các thủ thuật nhổ răng để đóng vết thương và hỗ trợ quá trình lành thương'),
('Mũi tê', 'Dụng cụ dùng để gây tê trong quá trình nhổ răng', 'Dùng trong các thủ thuật nhổ răng để giảm đau cho bệnh nhân'),
('Chất trám', 'Vật liệu dùng để trám răng cho trẻ em', 'Dùng trong các thủ thuật trám răng sữa hoặc răng vĩnh viễn cho trẻ em'),
('Kháng sinh', 'Thuốc dùng để điều trị nhiễm khuẩn', 'Dùng trong các trường hợp nhiễm trùng răng miệng hoặc sau các thủ thuật nhổ răng, điều trị tủy'),
('Giảm đau - Hạ sốt', 'Thuốc dùng để giảm đau và hạ sốt', 'Dùng để giảm đau sau các thủ thuật nha khoa hoặc khi bệnh nhân có dấu hiệu sốt'),
('Chống viêm', 'Thuốc dùng để chống viêm', 'Dùng trong các trường hợp viêm nướu, viêm tủy, hoặc sau các thủ thuật nha khoa');

INSERT INTO material (category_id, name, quantity, unit, func, mfg_date, img) VALUES
-- Vật liệu cố định
(1, 'Mũi cạo vôi', 10, 'Cái', 'Cạo vôi răng bám trên răng', '2024-09-01', 'template/blank_material.png'),
(2, 'Kềm 150', 10, 'Cái', 'Nhổ răng', '2024-09-01', 'template/blank_material.png'),
(2, 'Kềm 151', 10, 'Cái', 'Nhổ răng', '2024-09-01', 'template/blank_material.png'),
(2, 'Kềm 50', 10, 'Cái', 'Nhổ răng', '2024-09-01', 'template/blank_material.png'),
(2, 'Kềm 51', 10, 'Cái', 'Nhổ răng', '2024-09-01', 'template/blank_material.png'),
(3, 'Nạy 1', 12, 'Cái', 'Nạy răng', '2024-09-01', 'template/blank_material.png'),
(3, 'Nạy 2', 12, 'Cái', 'Nạy răng', '2024-09-01', 'template/blank_material.png'),
(3, 'Nạy 3', 12, 'Cái', 'Nạy răng', '2024-09-01', 'template/blank_material.png'),
(4, 'Gương nha khoa', 6, 'Cái', 'Soi răng', '2024-09-01', 'template/blank_material.png'),
(5, 'Thám trâm', 9, 'Cái', 'Định vị tủy răng', '2024-09-01', 'template/blank_material.png'),
(6, 'Nạo ngà', 21, 'Cái', 'Lấy mô ngà sâu, tủy răng và xi-măng trám tạm', '2024-09-01', 'template/blank_material.png'),
(7, 'Kẹp', 8, 'Cái', 'Gắp các vật liệu nha khoa hỗ trợ trong các thủ thuật', '2024-09-01', 'template/blank_material.png'),
(8, 'Bay trám', 8, 'Cái', 'Công cụ sử dụng để thực hiện quá trình trám răng hoặc điều trị nha khoa', '2024-09-01', 'template/blank_material.png'),
(9, 'Cây đo túi nướu', 8, 'Cái', 'Dùng trong quá trình thăm khám nha chu, đo túi nướu', '2024-09-01', 'template/blank_material.png'),
(10, 'Đèn quang trùng hợp', 8, 'Cái', 'Hỗ trợ các quá trình như: trám răng, tạo cầu, hay lấp đầy khoảng trống giữa các răng', '2024-09-01', 'template/blank_material.png'),
(11, 'Ống chích sắt', 8, 'Cái', 'Dùng để hút chất lỏng, nước bọt', '2024-09-01', 'template/blank_material.png'),

-- Vật liệu tiêu hao (Không phải thuốc)
-- Chữa răng
(12, 'Composite đặc màu A2', 2, 'liều', 'Tái tạo và phục hình răng', '2024-09-01', 'template/blank_material.png'),
(12, 'Composite đặc màu A3', 2, 'liều', 'Tái tạo và phục hình răng', '2024-09-01', 'template/blank_material.png'),
(12, 'Composite đặc màu A3.5', 2, 'liều', 'Tái tạo và phục hình răng', '2024-09-01', 'template/blank_material.png'),
(12, 'Composite đặc màu A4', 2, 'liều', 'Tái tạo và phục hình răng', '2024-09-01', 'template/blank_material.png'),
(12, 'Composite đặc màu ngà', 2, 'liều', 'Tái tạo và phục hình răng', '2024-09-01', 'template/blank_material.png'),
(12, 'Composite đặc màu men tự nhiên', 2, 'liều', 'Tái tạo và phục hình răng', '2024-09-01', 'template/blank_material.png'),
(13, 'Composite lỏng màu A2', 2, 'liều', 'Cải thiện các khuyết điểm trên men răng hoặc trám lót', '2024-09-01', 'template/blank_material.png'),
(13, 'Composite lỏng màu A3', 2, 'liều', 'Cải thiện các khuyết điểm trên men răng hoặc trám lót', '2024-09-01', 'template/blank_material.png'),
(13, 'Composite lỏng màu A3.5', 2, 'liều', 'Cải thiện các khuyết điểm trên men răng hoặc trám lót', '2024-09-01', 'template/blank_material.png'),
(13, 'Composite lỏng màu A4', 2, 'liều', 'Cải thiện các khuyết điểm trên men răng hoặc trám lót', '2024-09-01', 'template/blank_material.png'),
(13, 'Composite lỏng màu ngà', 2, 'liều', 'Cải thiện các khuyết điểm trên men răng hoặc trám lót', '2024-09-01', 'template/blank_material.png'),
(13, 'Composite lỏng màu men tự nhiên', 2, 'liều', 'Cải thiện các khuyết điểm trên men răng hoặc trám lót', '2024-09-01', 'template/blank_material.png'),
(14, 'Bonding', 5, 'chai', 'Dán tuyệt vời trên men và ngà', '2024-09-01', 'template/blank_material.png'),
(15, 'Cọ bond', 5, 'hộp', 'Dùng để bôi keo gắn composit, axit etching, thuốc tẩy trắng răng', '2024-09-01', 'template/blank_material.png'),
(16, 'Bông gòn 1kg', 50, 'cuộn', 'Cô lập răng khi trám, gắn răng hoặc tẩy trắng hoặc cách ly cả cung răng', '2024-09-01', 'template/blank_material.png'),
(17, 'Mũi khoan kim cương', 5, 'mũi', 'Trám răng, chữa tủy, phục hình', '2024-09-01', 'template/blank_material.png'),

-- Nội nha
(18, 'Sealer trám bít', 5, 'mũi', 'Phóng thích flour, hỗ trợ phòng ngừa sâu răng', '2024-09-01', 'template/blank_material.png'),
(19, 'Cone giấy', 15, 'hộp', 'Thấm hút hoàn toàn đến hết chiều dài ống tủy', '2024-09-01', 'template/blank_material.png'),
(19, 'Cone chính', 15, 'hộp', 'Dùng trám bít ống tủy, vạch đánh dấu chiều dài giúp dễ dàng kiểm soát chóp chân răng', '2024-09-01', 'template/blank_material.png'),
(20, 'NaOCL', 15, 'hộp', 'Làm sạch và khử khuẩn', '2024-09-01', 'template/blank_material.png'),
(20, 'Nacl', 15, 'hộp', 'Làm sạch và khử khuẩn', '2024-09-01', 'template/blank_material.png'),
(20, 'EDTA', 15, 'hộp', 'Làm sạch và khử khuẩn', '2024-09-01', 'template/blank_material.png'),
(21, 'Trâm tay', 5, 'cây', 'Giúp nâng cao hiệu quả làm sạch và tạo hình ống tủy', '2024-09-01', 'template/blank_material.png'),
(21, 'Trâm máy', 5, 'cây', 'Giúp nâng cao hiệu quả làm sạch và tạo hình ống tủy', '2024-09-01', 'template/blank_material.png'),

-- Nha chu
(22, 'Spongel', 5, 'hộp', 'Tăng cường khả năng làm đông máu của cơ thể, lấp đầy và che kín lỗ răng sau khi nhổ, hỗ trợ sát trùng, tiêu diệt vi khuẩn', '2024-09-01', 'template/blank_material.png'),
(23, 'Mũi đánh bóng', 40, 'cây', 'Đánh bóng bề mặt men răng và các phục hồi, tái tạo nét thẩm mỹ và chức năng cho răng', '2024-09-01', 'template/blank_material.png'),
(24, 'Chổi đánh bóng', 45, 'cây', 'Đánh và mài bóng răng cho bệnh nhân sau trám', '2024-09-01', 'template/blank_material.png'),
(25, 'Sò đánh bóng', 5, 'hộp', 'Hỗ trợ đánh bóng sau trám răng cao cấp', '2024-09-01', 'template/blank_material.png'),

-- Nhổ răng
(26, 'Chỉ khâu', 45, 'hộp', 'Đảm bảo vết thương được đóng chặt chẽ, ngăn vi khuẩn và tác nhân gây nhiễm trùng xâm nhập', '2024-09-01', 'template/blank_material.png'),
(27, 'Thuốc tê', 65, 'hộp', 'Gây tê tại chỗ và gây tê vùng cho người lớn và trẻ em', '2024-09-01', 'template/blank_material.png'),

-- Răng trẻ em
(28, 'Formocresol', 15, 'hộp', 'Sử dụng chủ yếu trong quá trình điều trị tủy để làm sạch và khử trùng ống tủy', '2024-09-01', 'template/blank_material.png'),
(28, 'ZnO', 6, 'hộp', 'Xi măng trám bít tạm thời', '2024-09-01', 'template/blank_material.png'),
(28, 'MTA', 5, 'hộp', 'Xi măng sinh học có khả năng kích thích sự hình thành xương và mô răng', '2024-09-01', 'template/blank_material.png'),
(28, 'GIC', 5, 'hộp', 'Xi măng có khả năng giải phóng fluoride, giúp bảo vệ răng khỏi sâu răng', '2024-09-01', 'template/blank_material.png'),

-- Thuốc
(29, 'Amoxicillin 500mg', 500, 'viên', 'Thuốc kháng sinh tạm thời', '2024-09-01', 'template/blank_material.png'),
(29, 'Amoxicillin 625mg', 350, 'viên', 'Thuốc kháng sinh tạm thời', '2024-09-01', 'template/blank_material.png'),
(29, 'Amoxicillin 875mg', 500, 'viên', 'Thuốc kháng sinh tạm thời', '2024-09-01', 'template/blank_material.png'),
(29, 'Amoxicillin 1000mg', 300, 'viên', 'Thuốc kháng sinh tạm thời', '2024-09-01', 'template/blank_material.png'),
(29, 'Metronidazole 200mg', 500, 'viên', 'Thuốc kháng sinh tạm thời', '2024-09-01', 'template/blank_material.png'),
(29, 'Metronidazole 500mg', 400, 'viên', 'Thuốc kháng sinh tạm thời', '2024-09-01', 'template/blank_material.png'),
(29, 'Cephalexin 500mg', 500, 'viên', 'Thuốc kháng sinh tạm thời', '2024-09-01', 'template/blank_material.png'),
(30, 'Paracetamol 500mg', 800, 'viên', 'Thuốc giảm đau, hạ sốt tạm thời', '2024-09-01', 'template/blank_material.png'),
(30, 'Aspirin 100mg', 500, 'viên', 'Thuốc giảm đau, hạ sốt tạm thời', '2024-09-01', 'template/blank_material.png'),
(30, 'Ibuprofen 400mg', 600, 'viên', 'Thuốc giảm đau, hạ sốt tạm thời', '2024-09-01', 'template/blank_material.png'),
(30, 'Naproxen 500mg', 500, 'viên', 'Thuốc giảm đau, hạ sốt tạm thời', '2024-09-01', 'template/blank_material.png'),
(31, 'Dexamethason 0.5mg', 500, 'ống', 'Thuốc chống viêm tạm thời', '2024-09-01', 'template/blank_material.png');

INSERT INTO fixed_material (id) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16);

INSERT INTO consumable_material (id) VALUES
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31),
(32),
(33),
(34),
(35),
(36),
(37),
(38),
(39),
(40),
(41),
(42),
(43),
(44),
(45),
(46),
(47),
(48),
(49),
(50),
(51),
(52),
(53),
(54),
(55),
(56),
(57),
(58),
(59),
(60),
(61),
(62);

INSERT INTO medicine (id, cared_actor, cost, price, instruction) VALUES
(51, 'Thuốc Amoxicillin chống chỉ định trong các trường hợp sau: Quá mẫn với hoạt chất, với bất kỳ Penicilin nào hoặc với bất kỳ thành phần nào của sản phẩm thuốc. Tiền sử có phản ứng quá mẫn tức thì nghiêm trọng (ví dụ như phản vệ) với một tác nhân beta-lactam khác (ví dụ như Cephalosporin, Carbapenem hoặc Monobactam).', 800, 1000, 'Amoxicillin dạng trihydrat chỉ dùng đường uống, Amoxicillin dạng muối natri chỉ dùng đường tiêm. Hấp thu Amoxicillin không bị ảnh hưởng bởi thức ăn trong dạ dày, do đó có thể uống trước hoặc sau bữa ăn. Bột pha hỗn dịch khi dùng có thể trộn với sữa, nước quả, nước và uống ngay lập tức sau khi trộn.'),
(52, 'Thuốc Amoxicillin chống chỉ định trong các trường hợp sau: Quá mẫn với hoạt chất, với bất kỳ Penicilin nào hoặc với bất kỳ thành phần nào của sản phẩm thuốc. Tiền sử có phản ứng quá mẫn tức thì nghiêm trọng (ví dụ như phản vệ) với một tác nhân beta-lactam khác (ví dụ như Cephalosporin, Carbapenem hoặc Monobactam).', 800, 1000, 'Amoxicillin dạng trihydrat chỉ dùng đường uống, Amoxicillin dạng muối natri chỉ dùng đường tiêm. Hấp thu Amoxicillin không bị ảnh hưởng bởi thức ăn trong dạ dày, do đó có thể uống trước hoặc sau bữa ăn. Bột pha hỗn dịch khi dùng có thể trộn với sữa, nước quả, nước và uống ngay lập tức sau khi trộn.'),
(53, 'Thuốc Amoxicillin chống chỉ định trong các trường hợp sau: Quá mẫn với hoạt chất, với bất kỳ Penicilin nào hoặc với bất kỳ thành phần nào của sản phẩm thuốc. Tiền sử có phản ứng quá mẫn tức thì nghiêm trọng (ví dụ như phản vệ) với một tác nhân beta-lactam khác (ví dụ như Cephalosporin, Carbapenem hoặc Monobactam).', 800, 1000, 'Amoxicillin dạng trihydrat chỉ dùng đường uống, Amoxicillin dạng muối natri chỉ dùng đường tiêm. Hấp thu Amoxicillin không bị ảnh hưởng bởi thức ăn trong dạ dày, do đó có thể uống trước hoặc sau bữa ăn. Bột pha hỗn dịch khi dùng có thể trộn với sữa, nước quả, nước và uống ngay lập tức sau khi trộn.'),
(54, 'Thuốc Amoxicillin chống chỉ định trong các trường hợp sau: Quá mẫn với hoạt chất, với bất kỳ Penicilin nào hoặc với bất kỳ thành phần nào của sản phẩm thuốc. Tiền sử có phản ứng quá mẫn tức thì nghiêm trọng (ví dụ như phản vệ) với một tác nhân beta-lactam khác (ví dụ như Cephalosporin, Carbapenem hoặc Monobactam).', 800, 1000, 'Amoxicillin dạng trihydrat chỉ dùng đường uống, Amoxicillin dạng muối natri chỉ dùng đường tiêm. Hấp thu Amoxicillin không bị ảnh hưởng bởi thức ăn trong dạ dày, do đó có thể uống trước hoặc sau bữa ăn. Bột pha hỗn dịch khi dùng có thể trộn với sữa, nước quả, nước và uống ngay lập tức sau khi trộn.'),
(55, 'Người có tiền sử quá mẫn với Metronidazol hoặc những dẫn chất nitroimidazol khác. Metronidazol cũng chống chỉ định nếu gần đây (trong vòng 2 tuần) người bệnh đã dùng Disulfiram.', 600, 750, 'Trước khi tiến hành bôi thuốc, cần tiến hành vệ sinh răng miệng sạch sẽ. Sau đó bôi thuốc Metrogyl denta lên vùng nha chu bị viêm 2 lần/ ngày. Đối với người lớn, lấy một lượng thuốc vừa đủ và thoa lên vùng nha chu bị viêm. Thực hiện 2 lần/ngày và tùy chỉnh liều theo mức độ bệnh. Việc thay đổi liều lượng cần tham khảo ý kiến của bác sĩ, dược sĩ. Đối với trẻ em, không tự ý bôi thuốc cho trẻ em khi có tổn thương nha chu. Trong thuốc có thể có các thành phần không phù hợp với độ tuổi của trẻ. Do đó, cần tham khảo ý kiến bác sĩ trước khi bôi thuốc cho trẻ em.'),
(56, 'Người có tiền sử quá mẫn với Metronidazol hoặc những dẫn chất nitroimidazol khác. Metronidazol cũng chống chỉ định nếu gần đây (trong vòng 2 tuần) người bệnh đã dùng Disulfiram.', 600, 750, 'Trước khi tiến hành bôi thuốc, cần tiến hành vệ sinh răng miệng sạch sẽ. Sau đó bôi thuốc Metrogyl denta lên vùng nha chu bị viêm 2 lần/ ngày. Đối với người lớn, lấy một lượng thuốc vừa đủ và thoa lên vùng nha chu bị viêm. Thực hiện 2 lần/ngày và tùy chỉnh liều theo mức độ bệnh. Việc thay đổi liều lượng cần tham khảo ý kiến của bác sĩ, dược sĩ. Đối với trẻ em, không tự ý bôi thuốc cho trẻ em khi có tổn thương nha chu. Trong thuốc có thể có các thành phần không phù hợp với độ tuổi của trẻ. Do đó, cần tham khảo ý kiến bác sĩ trước khi bôi thuốc cho trẻ em.'),
(57, 'Cefalexin chống chỉ định ở những bệnh nhân dị ứng với nhóm cephalosporin hoặc với bất kỳ thành phần nào của thuốc. Cefalexin nên được dùng một cách thận trọng cho những bệnh nhân có biểu hiện quá mẫn với các thuốc khác. Cần thận trọng khi dùng cephalosporin cho những bệnh nhân quá mẫn với penicilin, vì có một số bằng chứng về khả năng gây dị ứng chéo một phần giữa penicilin và cephalosporin.', 800, 1000, 'Thuốc được sử dụng đường uống. Người lớn uống 1 - 4 g/ngày chia làm nhiều lần trong ngày. Hầu hết các trường hợp nhiễm trùng sẽ đáp ứng với liều 500 mg mỗi 8 giờ. Liều khuyến cáo hàng ngày cho trẻ em là 25 - 50 mg/kg chia làm nhiều lần trong ngày.'),
(58, 'Chống chỉ định sử dụng paracetamol: Người bệnh dị ứng, mẫn cảm với paracetamol. Người có tiểu sử mắc các bệnh lý về gan, bị tổn thương gan. Người nghiện bia rượu hoặc thường xuyên sử dụng thức uống có cồn và các loại chất kích thích khác. Suy dinh dưỡng nghiêm trọng. Đang sử dụng một số loại thuốc khác có thể gây tương tác thuốc không tốt cho người bệnh.', 1400, 1750, 'Người lớn mỗi lần uống hoặc đặt hậu môn một viên với hàm lượng 325 - 650mg, sử dụng cách nhau 4 - 6 giờ. Nếu dùng thuốc với hàm lượng 1000mg thì thời gian giữa 2 lần dùng thuốc cách nhau 6 đến 8 giờ. Trẻ sơ sinh 10-15mg/kg, mỗi lần dùng cách 6 - 8 giờ (một ngày dùng khoảng 3-4 lần). Trẻ lớn hơn liều dùng giống với trẻ sơ sinh nhưng có thể cho trẻ dùng mỗi lần cách nhau 4 - 6 giờ, tức trong ngày dùng 4-6 lần nhưng kèm theo lời khuyên không dùng quá năm lần trong vòng 24 giờ.'),
(59, 'Chống chỉ định của aspirin: Người có tiền sử dị ứng với aspirin. Người bệnh xuất huyết tiêu hóa. Phụ nữ mang thai trong 3 tháng cuối (tăng nguy cơ chảy máu thai kỳ). Trẻ em dưới 12 tuổi (tăng nguy cơ hội chứng Reye). Người bị rối loạn đông máu. Bệnh nhân mắc bệnh gan, thận, đặc biệt là các trường hợp suy gan hoặc suy thận nặng.', 400, 500, 'Khi uống thuốc, uống cả viên thuốc thay vì bẻ đôi hoặc nghiền nát viên thuốc. Viên nén có lớp phủ đặc biệt giúp dạ dày tiêu hóa và hấp thụ thuốc tốt hơn. Không nhai hoặc nghiền nát thuốc ở dạng viên nén vì như vậy sẽ làm lớp phủ bọc ngoài viên thuốc ngừng hoạt động.'),
(60, 'Ibuprofen thuốc chống chỉ định trong các trường hợp sau: Mẫn cảm với Ibuprofen. Loét dạ dày tá tràng tiến triển. Quá mẫn với aspirin hoặc với các thuốc chống viêm không steroid khác (hen, viêm mũi, nổi mày đay sau khi dùng Aspirin). Người bệnh bị hen hay bị co thắt phế quản, rối loạn chảy máu, bệnh tim mạch, tiền sử loét dạ dày tá tràng, suy gan hoặc suy thận (mức lọc cầu thận dưới 30 ml/phút). Ba tháng cuối của thai kỳ. Trẻ sơ sinh thiếu tháng đang có chảy máu như chảy máu dạ dày, xuất huyết trong sọ và trẻ có giảm tiểu cầu và rối loạn đông máu. Trẻ sơ sinh có nhiễm khuẩn hoặc nghi ngờ nhiễm khuẩn chưa được điều trị. Trẻ sơ sinh thiếu tháng nghi ngờ viêm ruột hoại tử.', 350, 430, 'Người lớn: Liều uống thông thường để giảm đau: 1,2 - 1,8 g/ngày, chia làm nhiều liều nhỏ, tuy nhiên liều duy trì từ 0,6 - 1,2 g/ngày là đã có hiệu quả. Trẻ em thì liều uống thông thường để giảm đau hoặc sốt là 20 - 30 mg/ kg/ngày, chia làm nhiều liều nhỏ.'),
(61, 'Thuốc chống chỉ định với trường hợp: Người có tiền sử mẫn cảm với naproxen và các thuốc chống viêm không steroid khác, những người có tiền sử viêm mũi dị ứng, hen phế quản, nổi mày đay sau khi dùng aspirin, đặc biệt người đã có dị ứng với aspirin. Suy gan nặng. Suy thận nặng. Loét dạ dày - tá tràng. Viêm trực tràng hoặc chảy máu trực tràng. Phụ nữ 3 tháng cuối thai kỳ. Điều trị đau trong thời gian phẫu thuật ghép nối tắt động mạch vành.', 480, 600, 'Người lớn liều thông thường naproxen: 250 – 500 mg/lần x 2 lần/ngày, sáng và chiều; hoặc 250 mg uống buổi sáng và 500 mg uống buổi chiều. Trẻ em 2 – 18 tuổi, liều thông thường 5 – 7,5 mg/kg naproxen, 2 lần/ngày (tối đa 1000 mg/ngày).'),
(62, 'Không dùng Dexamethasone cho các trường hợp sau: Quá mẫn với Dexamethasone hoặc các hợp phần khác của chế phẩm. Nhiễm nấm toàn thân, sốt rét thể não, nhiễm virus tại chỗ hoặc nhiễm khuẩn lao, lậu chưa kiểm soát và khớp bị hủy hoại nặng. Bệnh nhãn khoa do nhiễm virus Herpes simplex; nhiễm nấm hoặc nhiễm khuẩn lao ở mắt.', 960, 1200, 'Người lớn liều ban đầu 0,75-9 mg/ngày, 2-4 lần tùy theo bệnh. Trẻ em liều thuốc uống 0,02-0,3 mg/kg/ngày hoặc 0,6-10 mg/m2/ngày chia 3 - 4 lần.');

INSERT INTO ingredient (name) VALUES
('Bisphenol A Glycidyl Methacrylate (BISGMA)'),
('Urethane Dimethacrylate (UDMA)'),
('Polyceram Bán Tinh Thể (PEX)'),
('Nhựa Silica'),
('Silicon Dioxide'),
('Aluminium Oxide'),
('Barium'),
('Zirconium Oxide'),
('Borosilicate'),
('Barium Aluminium Silicate Glasses'),
('Chất Nối (Silane)'),
('Ethanol'),
('Monomer'),
('Hạt Độn Nano'),
('Fluor'),
('PVC'),
('Bông Tự Nhiên'),
('Thép Không Gỉ'),
('Bột Kim Cương'),
('Formaldehyde'),
('Iodoform'),
('Hydrocortisone'),
('Prednisolone'),
('Cone Gutta'),
('Cone GGT'),
('NaOCl'),
('NaCl'),
('[CH2N (CH2CO2H)2]2'),
('Bông Xốp Collagen'),
('Gelatin'),
('Colloidal Bạc'),
('Nhựa PTE'),
('Amalgam'),
('Composite'),
('Sứ Mũi Đánh Bóng'),
('Sợi Cước Y Tế'),
('Canxi Cacbonat'),
('Glycerin'),
('Natri Hydroxymethyl Cellulose'),
('Nilon'),
('Lidocaine Hydrochloride'),
('Epinephrine'),
('Thuốc Co Mạch'),
('Formaldehyde USP'),
('Cresol USP'),
('Oxide Tricalcium'),
('Oxide Bismute'),
('Tricalcium Aluminate'),
('Tricalcium Silicate'),
('Oxide Silicate'),
('Axit Acrylic'),
('Bột Thủy Tinh Mịn'),
('Amoxicillin Trihydrate'),
('Metronidazole'),
('Cephalexin'),
('Acetaminophen'),
('Acid Acetylsalicylic (ASA)'),
('Ibuprofen'),
('Naproxem'),
('Dexamethason');

INSERT INTO ingredient_consumable_material (ingredient_id, con_mat_id) VALUES
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(3, 17),
(3, 18),
(3, 19),
(3, 20),
(3, 21),
(3, 22),
(4, 17),
(4, 18),
(4, 19),
(4, 20),
(4, 21),
(4, 22),
(2, 23),
(2, 24),
(2, 25),
(2, 26),
(2, 27),
(2, 28),
(5, 23),
(5, 24),
(5, 25),
(5, 26),
(5, 27),
(5, 28),
(6, 23),
(6, 24),
(6, 25),
(6, 26),
(6, 27),
(6, 28),
(7, 23),
(7, 24),
(7, 25),
(7, 26),
(7, 27),
(7, 28),
(8, 23),
(8, 24),
(8, 25),
(8, 26),
(8, 27),
(8, 28),
(9, 23),
(9, 24),
(9, 25),
(9, 26),
(9, 27),
(9, 28),
(10, 23),
(10, 24),
(10, 25),
(10, 26),
(10, 27),
(10, 28),
(11, 23),
(11, 24),
(11, 25),
(11, 26),
(11, 27),
(11, 28),
(8, 48),
(12, 29),
(13, 29),
(14, 29),
(15, 29),
(16, 30),
(17, 30),
(17, 31),
(18, 32),
(19, 32),
(18, 39),
(18, 40),
(20, 33),
(21, 33),
(22, 33),
(23, 33),
(24, 34),
(25, 35),
(26, 36),
(27, 37),
(28, 38),
(29, 41),
(30, 41),
(31, 41),
(32, 42),
(33, 42),
(34, 42),
(35, 42),
(36, 43),
(37, 44),
(38, 44),
(39, 44),
(38, 47),
(40, 45),
(41, 46),
(42, 46),
(43, 46),
(44, 47),
(45, 47),
(46, 49),
(47, 49),
(48, 49),
(49, 49),
(50, 49),
(51, 50),
(52, 50),
(53, 51),
(53, 52),
(53, 53),
(53, 54),
(54, 55),
(54, 56),
(55, 57),
(56, 58),
(57, 59),
(58, 60),
(59, 61),
(60, 62);


-- Logs for fixed materials (tools and equipment - số lượng thường không thay đổi)
INSERT INTO material_log (material_id, message) VALUES
-- Mũi cạo vôi (ID 1 - Số lượng 10)
(1, 'Nhập kho: +10, tổng 10'),

-- Kềm 150 (ID 2 - Số lượng 10)
(2, 'Nhập kho: +10, tổng 10'),

-- Kềm 151 (ID 3 - Số lượng 10)
(3, 'Nhập kho: +10, tổng 10'),

-- Kềm 50 (ID 4 - Số lượng 10)
(4, 'Nhập kho: +10, tổng 10'),

-- Kềm 51 (ID 5 - Số lượng 10)
(5, 'Nhập kho: +10, tổng 10'),

-- Nạy 1 (ID 6 - Số lượng 12)
(6, 'Nhập kho: +12, tổng 12'),

-- Nạy 2 (ID 7 - Số lượng 12)
(7, 'Nhập kho: +12, tổng 12'),

-- Nạy 3 (ID 8 - Số lượng 12)
(8, 'Nhập kho: +12, tổng 12'),

-- Gương nha khoa (ID 9 - Số lượng 6)
(9, 'Nhập kho: +6, tổng 6'),

-- Thám trâm (ID 10 - Số lượng 9)
(10, 'Nhập kho: +9, tổng 9'),

-- Nạo ngà (ID 11 - Số lượng 21)
(11, 'Nhập kho: +21, tổng 21'),

-- Kẹp (ID 12 - Số lượng 8)
(12, 'Nhập kho: +8, tổng 8'),

-- Bay trám (ID 13 - Số lượng 8)
(13, 'Nhập kho: +8, tổng 8'),

-- Cây đo túi nướu (ID 14 - Số lượng 8)
(14, 'Nhập kho: +8, tổng 8'),

-- Đèn quang trùng hợp (ID 15 - Số lượng 8)
(15, 'Nhập kho: +8, tổng 8'),

-- Ống chích sắt (ID 16 - Số lượng 8)
(16, 'Nhập kho: +8, tổng 8');

-- Logs for consumable materials (vật liệu tiêu hao)
INSERT INTO material_log (material_id, message) VALUES
-- Composite đặc màu A2 (ID 17 - Số lượng 2)
(17, 'Nhập kho: +2, tổng 2'),

-- Composite đặc màu A3 (ID 18 - Số lượng 2)
(18, 'Nhập kho: +2, tổng 2'),

-- Composite đặc màu A3.5 (ID 19 - Số lượng 2)
(19, 'Nhập kho: +2, tổng 2'),

-- Composite đặc màu A4 (ID 20 - Số lượng 2)
(20, 'Nhập kho: +2, tổng 2'),

-- Composite đặc màu ngà (ID 21 - Số lượng 2)
(21, 'Nhập kho: +2, tổng 2'),

-- Composite đặc màu men tự nhiên (ID 22 - Số lượng 2)
(22, 'Nhập kho: +2, tổng 2'),

-- Composite lỏng màu A2 (ID 23 - Số lượng 2)
(23, 'Nhập kho: +2, tổng 2'),

-- Composite lỏng màu A3 (ID 24 - Số lượng 2)
(24, 'Nhập kho: +2, tổng 2'),

-- Composite lỏng màu A3.5 (ID 25 - Số lượng 2)
(25, 'Nhập kho: +2, tổng 2'),

-- Composite lỏng màu A4 (ID 26 - Số lượng 2)
(26, 'Nhập kho: +2, tổng 2'),

-- Composite lỏng màu ngà (ID 27 - Số lượng 2)
(27, 'Nhập kho: +2, tổng 2'),

-- Composite lỏng màu men tự nhiên (ID 28 - Số lượng 2)
(28, 'Nhập kho: +2, tổng 2'),

-- Bonding (ID 29 - Số lượng 5)
(29, 'Nhập kho: +5, tổng 5'),

-- Cọ bond (ID 30 - Số lượng 5)
(30, 'Nhập kho: +5, tổng 5'),

-- Bông gòn 1kg (ID 31 - Số lượng 50)
(31, 'Nhập kho: +50, tổng 50'),

-- Mũi khoan kim cương (ID 32 - Số lượng 5)
(32, 'Nhập kho: +5, tổng 5'),

-- Sealer trám bít (ID 33 - Số lượng 5)
(33, 'Nhập kho: +5, tổng 5'),

-- Cone giấy (ID 34 - Số lượng 15)
(34, 'Nhập kho: +15, tổng 15'),

-- Cone chính (ID 35 - Số lượng 15)
(35, 'Nhập kho: +15, tổng 15'),

-- NaOCL (ID 36 - Số lượng 15)
(36, 'Nhập kho: +15, tổng 15'),

-- Nacl (ID 37 - Số lượng 15)
(37, 'Nhập kho: +15, tổng 15'),

-- EDTA (ID 38 - Số lượng 15)
(38, 'Nhập kho: +15, tổng 15'),

-- Trâm tay (ID 39 - Số lượng 5)
(39, 'Nhập kho: +5, tổng 5'),

-- Trâm máy (ID 40 - Số lượng 5)
(40, 'Nhập kho: +5, tổng 5'),

-- Spongel (ID 41 - Số lượng 5)
(41, 'Nhập kho: +5, tổng 5'),

-- Mũi đánh bóng (ID 42 - Số lượng 40)
(42, 'Nhập kho: +40, tổng 40'),

-- Chổi đánh bóng (ID 43 - Số lượng 45)
(43, 'Nhập kho: +45, tổng 45'),

-- Sò đánh bóng (ID 44 - Số lượng 5)
(44, 'Nhập kho: +5, tổng 5'),

-- Chỉ khâu (ID 45 - Số lượng 45)
(45, 'Nhập kho: +45, tổng 45'),

-- Thuốc tê (ID 46 - Số lượng 65)
(46, 'Nhập kho: +65, tổng 65'),

-- Formocresol (ID 47 - Số lượng 15)
(47, 'Nhập kho: +15, tổng 15'),

-- ZnO (ID 48 - Số lượng 6)
(48, 'Nhập kho: +6, tổng 6'),

-- MTA (ID 49 - Số lượng 5)
(49, 'Nhập kho: +5, tổng 5'),

-- GIC (ID 50 - Số lượng 5)
(50, 'Nhập kho: +5, tổng 5'),

-- Amoxicillin 500mg (ID 51 - Số lượng 500)
(51, 'Nhập kho: +500, tổng 500'),

-- Amoxicillin 625mg (ID 52 - Số lượng 350)
(52, 'Nhập kho: +350, tổng 350'),

-- Amoxicillin 875mg (ID 53 - Số lượng 500)
(53, 'Nhập kho: +500, tổng 500'),

-- Amoxicillin 1000mg (ID 54 - Số lượng 300)
(54, 'Nhập kho: +300, tổng 300'),

-- Metronidazole 200mg (ID 55 - Số lượng 500)
(55, 'Nhập kho: +500, tổng 500'),

-- Metronidazole 500mg (ID 56 - Số lượng 400)
(56, 'Nhập kho: +400, tổng 400'),

-- Cephalexin 500mg (ID 57 - Số lượng 500)
(57, 'Nhập kho: +500, tổng 500'),

-- Paracetamol 500mg (ID 58 - Số lượng 800)
(58, 'Nhập kho: +800, tổng 800'),

-- Aspirin 100mg (ID 59 - Số lượng 500)
(59, 'Nhập kho: +500, tổng 500'),

-- Ibuprofen 400mg (ID 60 - Số lượng 600)
(60, 'Nhập kho: +600, tổng 600'),

-- Naproxen 500mg (ID 61 - Số lượng 500)
(61, 'Nhập kho: +500, tổng 500'),

-- Dexamethason 0.5mg (ID 62 - Số lượng 500)
(62, 'Nhập kho: +500, tổng 500');
