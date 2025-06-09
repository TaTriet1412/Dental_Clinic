SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE role(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name TEXT(200) NOT NULL
);

CREATE TABLE user(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    name TEXT(200) NOT NULL,
    address TEXT(300) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    birthday DATE NOT NULL,
    salary INT NOT NULL check(salary>= 0),
    created_at DATETIME NOT NULL DEFAULT NOW(),
    last_login DATETIME DEFAULT NULL,
    gender BIT NOT NULL,
    img VARCHAR(200) DEFAULT 'template/blank_user.png',
    is_active BIT NOT NULL DEFAULT 0,
    is_ban BIT NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO `role` ( `name`) VALUES
('ADMIN'),
('RECEPTIONIST'),
('DENTIST'),
('ASSISTANT');


INSERT INTO `user` ( `name`, `email`, `address`,`password`, `phone`, `birthday`, `role_id`, `salary`, `gender`) VALUES
('Tạ Triết', 'tatriet16@gmail.com','15 Phạm Hùng, Hòa Thành, Tây Ninh' , '123', '0908828181', '2004-10-06', '1', 10000000,  b'1');

-- Insert receptionists
INSERT INTO `user` ( `name`, `email`, `address`,`password`, `phone`, `birthday`, `role_id`, `salary`, `gender`) VALUES
('Đinh Phát Phát', 'phatphat@gmail.com', '154 Phạm Ngũ Lão, Thành Thái, Gò Vấp', '123', '0908832142', '2004-11-28', 2, 23000000, b'1'),
('Đăng Văn Trọng', 'dvv@gmail.com', '182 Tạ Quang Bữu, Phường 9, Quận 10', '123', '0893842173', '2004-01-02', 2, 22000000, b'1');

-- Insert dentists
INSERT INTO `user` ( `name`, `email`, `address`,`password`, `phone`, `birthday`, `role_id`, `salary`, `gender`) VALUES
('Lâm Đình Kiêm', 'lamvak@gmail.com', 'Tây Ninh', '123', '09023511284', '2003-01-02', 3, 9000000, b'1'),
('Hoa Hồ Quốc Đại', 'hoadai@gmail.com', 'Kiên Giang', '123', '09092815226', '1998-07-02', 3, 8700000, b'1'),
('Bùi Xuân Huấn', 'buixhuan@gmail.com', 'Trà Vinh', '123', '09062715216', '2010-11-11', 3, 8000000, b'1'),
('Linh Văn Sơn', 'linhnui@gmail.com', 'Thanh Hoá', '123', '09028365206', '2014-03-14', 3, 8000000, b'1'),
('Tạ Minh Triết', 'taminhtriet16@gmail.com', 'An Giang', '123', '09024635227', '1980-01-21', 3, 9300000, b'1'),
('Hoa Yến Anh', 'anhvippro@gmail.com', 'Tân Biên', '123', '09022915228', '1990-01-01', 3, 9400000, b'0'),
('Trần Thị Mai', 'maitran@gmail.com', 'Hà Nội', '123', '09123456789', '1995-05-10', 3, 8500000, b'0'),
('Nguyễn Văn Bình', 'binhnguyenvan@gmail.com', 'Đà Nẵng', '123', '09876543210', '1988-12-25', 3, 9200000, b'1'),
('Lê Thị Thu Thảo', 'thaole@gmail.com', 'Cần Thơ', '123', '09031122334', '2000-08-15', 3, 7800000, b'0'),
('Phạm Minh Hoàng', 'hoangpham@gmail.com', 'Hải Phòng', '123', '09778899001', '1992-02-28', 3, 9100000, b'1'),
('Vũ Ngọc Lan', 'lanvu.ngoc@gmail.com', 'Nghệ An', '123', '09445566778', '1999-10-05', 3, 8200000, b'0'),
('Đặng Hùng Dũng', 'dung.danghung@gmail.com', 'Bình Dương', '123', '09667788990', '1985-04-19', 3, 9500000, b'1');

-- Insert assistants
INSERT INTO `user` ( `name`, `email`, `address`,`password`, `phone`, `birthday`, `role_id`, `salary`, `gender`) VALUES
('Thiết Kiến Công Chúa', 'congchuaslay@gmail.com', '291 Phố Đi Bộ, Nguyễn Huệ, Quận 1', '123', '0893320167', '2004-04-12', 4, 3000000, b'1'),
('Cô Văn Nan', 'shinichi@gmail.com', '19 Phố Baker, Phường An Lạc, Bình Dương', '123', '0892930268', '2004-05-12', 4, 2400000, b'1'),
('Đặc Vụ Ngầm', 'aibiet@gmail.com', '12 Lạc long quân, Hàng Chài, Phú Thọ', '123', '0902931823', '2001-01-02', 4, 2200000,b'0'),
('Mai Quốc Khánh', 'khanhvippro@gmail.com', '20 Nguyễn Du, Phường Đồng Khánh, Quận 3', '123', '0902839141', '2004-09-02', 4, 2800000, b'0');



