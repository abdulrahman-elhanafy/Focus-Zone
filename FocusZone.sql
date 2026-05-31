DROP DATABASE IF EXISTS focuszone;
CREATE DATABASE focuszone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE focuszone;

-- =========================
-- CUSTOMERS
-- =========================
CREATE TABLE customers (
    customer_id         VARCHAR(36) PRIMARY KEY,
    customer_name       VARCHAR(120) NOT NULL,
    customer_email      VARCHAR(150) UNIQUE,
    customer_phone      VARCHAR(30),
    customer_age        INT,
    customer_gender     ENUM('male','female') NOT NULL,
    customer_membership ENUM('daily','weekly','monthly') NOT NULL DEFAULT 'daily',
    customer_last_visit DATE,
    customer_balance    DECIMAL(10,2) DEFAULT 0
) ENGINE=InnoDB;

-- =========================
-- EMPLOYEES
-- =========================
CREATE TABLE employees (
    employee_id        VARCHAR(36) PRIMARY KEY,
    employee_name      VARCHAR(120) NOT NULL,
    employee_email     VARCHAR(150) UNIQUE,
    employee_phone     VARCHAR(30),
    employee_role      ENUM('Manager','Supervisor','Reception','Cashier','HR','Cleaner') NOT NULL,
    employee_salary    DECIMAL(10,2),
    employee_shift     ENUM('Morning','Evening','Night') NOT NULL,
    employee_hire_date DATE,
    employee_status    ENUM('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB;

-- =========================
-- ROOMS
-- =========================
CREATE TABLE rooms (
    room_id       VARCHAR(36) PRIMARY KEY,
    room_name     VARCHAR(120) NOT NULL UNIQUE,
    room_type     ENUM('VIP','Meeting','Office','Gaming') NOT NULL,
    room_capacity INT NOT NULL,
    room_status   ENUM('available','occupied','maintenance','reserved') NOT NULL DEFAULT 'available'
) ENGINE=InnoDB;

-- =========================
-- ROOM PRICES
-- =========================
CREATE TABLE room_prices (
    room_price_id  INT AUTO_INCREMENT PRIMARY KEY,
    room_id        VARCHAR(36) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    price_per_day  DECIMAL(10,2) NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_room (room_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- BOOKINGS
-- =========================
CREATE TABLE bookings (
    booking_id   VARCHAR(36) PRIMARY KEY,
    customer_id  VARCHAR(36) NOT NULL,
    room_id      VARCHAR(36) NOT NULL,
    start_time   DATETIME NOT NULL,
    end_time     DATETIME NOT NULL,
    status       ENUM('confirmed','completed','cancelled') NOT NULL DEFAULT 'confirmed',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id)     REFERENCES rooms(room_id)         ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================
-- SESSIONS
-- =========================
CREATE TABLE sessions (
    session_id  VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    room_id     VARCHAR(36) NOT NULL,
    booking_id  VARCHAR(36) NULL,         -- NULL = walk-in
    start_time  DATETIME NOT NULL,
    end_time    DATETIME NULL,            -- NULL = still active
    status      ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id)     REFERENCES rooms(room_id)         ON DELETE RESTRICT,
    FOREIGN KEY (booking_id)  REFERENCES bookings(booking_id)   ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- ITEMS
-- =========================
CREATE TABLE items (
    item_id       VARCHAR(36) PRIMARY KEY,
    item_name     VARCHAR(120) NOT NULL,
    item_price    DECIMAL(10,2) NOT NULL,
    item_stock    INT NOT NULL DEFAULT 0,
    item_category ENUM('Drinks','Snacks','Food') NOT NULL
) ENGINE=InnoDB;

-- =========================
-- SESSION ITEMS (MISSING — added)
-- =========================
CREATE TABLE session_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    item_id    VARCHAR(36) NOT NULL,
    quantity   INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,    -- price snapshot at purchase time
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id)    REFERENCES items(item_id)       ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE payments (
    payment_id     VARCHAR(36) PRIMARY KEY,
    session_id     VARCHAR(36) NOT NULL UNIQUE,
    room_amount    DECIMAL(10,2) NOT NULL DEFAULT 0,
    items_amount   DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount   DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method ENUM('Cash','Visa','Wallet') NOT NULL,
    payment_status ENUM('Paid','Pending','Cancelled','Refunded') NOT NULL DEFAULT 'Pending',
    paid_at        TIMESTAMP NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================
-- TRANSACTIONS
-- =========================
CREATE TABLE transactions (
    transaction_id          VARCHAR(36) PRIMARY KEY,
    booking_id              VARCHAR(36) NULL,
    session_id              VARCHAR(36) NULL,
    customer_id             VARCHAR(36) NULL,
    transaction_date        DATE NOT NULL,
    transaction_description VARCHAR(255) NOT NULL,
    transaction_category    ENUM('Booking','Expense','Refund') NOT NULL,
    transaction_amount      DECIMAL(10,2) NOT NULL,
    transaction_method      ENUM('Cash','Visa','Wallet') NOT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id)  REFERENCES bookings(booking_id)    ON DELETE SET NULL,
    FOREIGN KEY (session_id)  REFERENCES sessions(session_id)    ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO customers VALUES
('C001','Menna Ashraf','menna@mail.com','0100000001',20,'female','weekly',NOW(),0),
('C002','Ahmed Ali','ahmed@mail.com','0100000002',22,'male','monthly',NOW(),50),
('C003','Mostafa Adam','mostafa@mail.com','0100000003',25,'male','weekly',NOW(),20),
('C004','Sara Mohamed','sara@mail.com','0100000004',21,'female','daily',NOW(),0),
('C005','Youssef Khaled','youssef@mail.com','0100000005',24,'male','monthly',NOW(),100),
('C006','Nour Hany','nour@mail.com','0100000006',23,'female','weekly',NOW(),10),
('C007','Karim Tarek','karim@mail.com','0100000007',26,'male','daily',NOW(),0),
('C008','Hassan Wael','hassan@mail.com','0100000008',27,'male','monthly',NOW(),30),
('C009','Aya Samir','aya@mail.com','0100000009',22,'female','weekly',NOW(),0),
('C010','Ziad Mohamed','ziad@mail.com','0100000010',24,'male','daily',NOW(),15);

INSERT INTO employees VALUES
('E001','Omar Khaled','omar@mail.com','0111111111','Manager',9000,'Morning','2025-01-10','Active'),
('E002','Ali Hossam','ali@mail.com','0111111112','Reception',5000,'Evening','2025-02-15','Active'),
('E003','Nada Ashraf','nada@mail.com','0111111113','Cashier',4500,'Morning','2025-03-01','Active'),
('E004','Mahmoud Tamer','mahmoud@mail.com','0111111114','Supervisor',7000,'Night','2025-01-20','Active'),
('E005','Salma Ahmed','salma@mail.com','0111111115','Reception',4800,'Morning','2025-04-10','Active'),
('E006','Khaled Wael','khaled@mail.com','0111111116','Cleaner',3500,'Night','2025-02-05','Active'),
('E007','Farah Adel','farah@mail.com','0111111117','HR',6500,'Morning','2025-03-12','Active');

INSERT INTO rooms VALUES
('R001','Room 1','VIP',6,'available'),
('R002','Room 2','Meeting',10,'occupied'),
('R003','Room 3','Office',4,'available'),
('R004','Room 4','Gaming',8,'maintenance'),
('R005','Room 5','VIP',5,'available'),
('R006','Room 6','Office',3,'occupied'),
('R007','Room 7','Meeting',12,'available');

INSERT INTO room_prices (room_id,price_per_hour,price_per_day) VALUES
('R001',150,1000),('R002',100,700),('R003',80,500),
('R004',120,850),('R005',170,1200),('R006',90,600),('R007',110,750);

INSERT INTO bookings VALUES
('B001','C001','R001','2026-05-02 10:00:00','2026-05-02 12:00:00','confirmed',300,NOW()),
('B002','C002','R002','2026-05-03 01:00:00','2026-05-03 03:00:00','completed',200,NOW()),
('B003','C003','R003','2026-05-04 02:00:00','2026-05-04 05:00:00','confirmed',240,NOW()),
('B004','C004','R004','2026-05-05 04:00:00','2026-05-05 06:00:00','cancelled',0,NOW()),
('B005','C005','R005','2026-05-06 03:00:00','2026-05-06 07:00:00','confirmed',680,NOW()),
('B006','C006','R006','2026-05-07 05:00:00','2026-05-07 08:00:00','completed',270,NOW()),
('B007','C007','R007','2026-05-08 06:00:00','2026-05-08 09:00:00','confirmed',330,NOW()),
('B008','C008','R003','2026-05-09 02:00:00','2026-05-09 05:00:00','confirmed',240,NOW()),
('B009','C009','R005','2026-05-10 01:00:00','2026-05-10 04:00:00','completed',510,NOW()),
('B010','C010','R007','2026-05-11 03:00:00','2026-05-11 06:00:00','confirmed',330,NOW());

INSERT INTO sessions VALUES
('S001','C001','R001','B001',NOW(),NULL,'active'),
('S002','C002','R002','B002',NOW(),NOW(),'completed'),
('S003','C003','R003','B003',NOW(),NULL,'active'),
('S004','C004','R004','B004',NOW(),NOW(),'cancelled'),
('S005','C005','R005','B005',NOW(),NULL,'active'),
('S006','C006','R006','B006',NOW(),NOW(),'completed'),
('S007','C007','R007','B007',NOW(),NULL,'active'),
('S008','C008','R003','B008',NOW(),NULL,'active'),
('S009','C009','R005','B009',NOW(),NOW(),'completed'),
('S010','C010','R007','B010',NOW(),NULL,'active');

INSERT INTO items VALUES
('I001','Coffee',35,50,'Drinks'),
('I002','Tea',20,40,'Drinks'),
('I003','Water',10,100,'Drinks'),
('I004','Chips',25,60,'Snacks'),
('I005','Burger',80,30,'Food'),
('I006','Pizza',120,20,'Food'),
('I007','Energy Drink',45,35,'Drinks');

INSERT INTO payments VALUES
('P001','S001',300,70,370,'Cash','Paid',NOW()),
('P002','S002',200,20,220,'Visa','Paid',NOW()),
('P003','S003',240,30,270,'Cash','Pending',NOW()),
('P004','S004',0,50,50,'Cash','Cancelled',NOW()),
('P005','S005',680,80,760,'Visa','Paid',NOW()),
('P006','S006',270,120,390,'Cash','Paid',NOW()),
('P007','S007',330,45,375,'Wallet','Paid',NOW()),
('P008','S008',240,40,280,'Cash','Paid',NOW()),
('P009','S009',510,35,545,'Visa','Paid',NOW()),
('P010','S010',330,45,375,'Wallet','Pending',NOW());

INSERT INTO transactions
(transaction_id,booking_id,session_id,customer_id,transaction_date,
transaction_description,transaction_category,transaction_amount,transaction_method)
VALUES
('T001','B001','S001','C001',CURDATE(),'Room booking payment','Booking',370,'Cash'),
('T002','B002','S002','C002',CURDATE(),'Meeting room payment','Booking',220,'Visa'),
('T003','B003','S003','C003',CURDATE(),'Office booking payment','Booking',270,'Cash'),
('T004','B004','S004','C004',CURDATE(),'Cancelled booking','Booking',50,'Cash'),
('T005','B005','S005','C005',CURDATE(),'VIP room payment','Booking',760,'Visa'),
('T006','B006','S006','C006',CURDATE(),'Office room payment','Booking',390,'Cash'),
('T007','B007','S007','C007',CURDATE(),'Meeting booking payment','Booking',375,'Wallet'),
('T008','B008','S008','C008',CURDATE(),'Office room booking','Booking',280,'Cash'),
('T009','B009','S009','C009',CURDATE(),'VIP booking payment','Booking',545,'Visa'),
('T010','B010','S010','C010',CURDATE(),'Meeting room payment','Booking',375,'Wallet');