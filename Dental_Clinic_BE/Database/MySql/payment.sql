CREATE TABLE bill (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- ID duy nhất của khoa
    patient_id VARCHAR(100) NOT NULL,
    prescription_id VARCHAR(100) NOT NULL,
    total_price INT NOT NULL DEFAULT 0,
    prescription_price INT NOT NULL DEFAULT 0,
    services_total_price INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- paid, confirmed, cancelled
    note VARCHAR(200) DEFAULT '' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bill_service (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bill_id BIGINT NOT NULL,
    service_id VARCHAR(100) NOT NULL,
    service_cost INT NOT NULL DEFAULT 0,
    quantity_service INT NOT NULL DEFAULT 0,
    service_price INT NOT NULL DEFAULT 0,
    FOREIGN KEY (bill_id) REFERENCES bill(id)
);

CREATE TABLE payment_transaction  (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bill_id BIGINT,
    amount_paid INT NOT NULL DEFAULT 0,
    payment_method VARCHAR(100) DEFAULT 'vnpay',
    status VARCHAR(50) NOT NULL, -- pending, success, fail
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bill(id)
);

INSERT INTO bill (patient_id,prescription_id,  prescription_price,services_total_price,total_price,status) VALUES
('6808553414a0ffdab3568451','6805a20dd5d13ed977cf4a5d',3750,500000,503750,'paid'),
('6808553414a0ffdab3568451','6805a20dd5d13ed977cf4a5e',3600,500000,503600,'paid'),
('6808553414a0ffdab3568451','6805a20dd5d13ed977cf4a5f',8250,600000,608250,'paid'),
('6808553414a0ffdab3568452','6805a20dd5d13ed977cf4a60',1000,700000,701000,'paid'),
('6808553414a0ffdab3568452','6805a20dd5d13ed977cf4a61',1500,900000,901500,'paid');

INSERT INTO bill_service (bill_id, service_id, service_cost, quantity_service, service_price) VALUES
(1, '67d21ee9a1ca2058200656de', 300000, 1, 500000),
(2, '67d21ee9a1ca2058200656df', 400000, 1, 500000),
(3, '67d21ee9a1ca2058200656e0', 500000, 1, 600000),
(4, '67d21ee9a1ca2058200656e1', 600000, 1, 700000),
(5, '67d21ee9a1ca2058200656e2', 800000, 1, 900000);

INSERT INTO payment_transaction (bill_id, amount_paid, payment_method, status) VALUES
(1, 503750, 'vnpay', 'success'),
(2, 503600, 'vnpay', 'success'),
(3, 608250, 'vnpay', 'success'),
(4, 701000, 'vnpay', 'success'),
(5, 901500, 'vnpay', 'success');
