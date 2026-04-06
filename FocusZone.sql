-- FocusZone MySQL database schema
-- Run this file in your MySQL client to create the database and seed initial data.

DROP DATABASE IF EXISTS focuszone;
CREATE DATABASE focuszone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE focuszone;

CREATE TABLE customers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  membership ENUM('Basic', 'Premium', 'Enterprise') NOT NULL DEFAULT 'Basic',
  last_visit DATE,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  history JSON NOT NULL DEFAULT (JSON_ARRAY())
) ENGINE=InnoDB;

CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  type ENUM('Private Office', 'Meeting Room', 'Hot Desk', 'Conference Hall') NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  status ENUM('available', 'occupied', 'maintenance', 'reserved') NOT NULL DEFAULT 'available'
) ENGINE=InnoDB;

CREATE TABLE room_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(36) NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_price_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_room_price_room (room_id)
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  room_id VARCHAR(36) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('active', 'upcoming', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NULL,
  customer_id VARCHAR(36) NULL,
  date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  category ENUM('Income', 'Expense') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('Card', 'Cash', 'Transfer') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_transactions_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO customers (id, name, email, phone, age, gender, membership, last_visit, balance, history) VALUES
  ('c1', 'Lina Ahmed', 'lina.ahmed@example.com', '+201234567890', 28, 'Female', 'Premium', '2026-03-20', 150.00, JSON_ARRAY(JSON_OBJECT('id', 'h1', 'date', '2026-03-20', 'action', 'Day pass', 'duration', '4h', 'cost', 45.00))),
  ('c2', 'Omar Hassan', 'omar.hassan@example.com', '+201234567891', 34, 'Male', 'Basic', '2026-03-18', 30.00, JSON_ARRAY()),
  ('c3', 'Sara Youssef', 'sara.youssef@example.com', '+201234567892', 31, 'Female', 'Enterprise', '2026-03-22', 320.00, JSON_ARRAY(JSON_OBJECT('id', 'h2', 'date', '2026-03-22', 'action', 'Meeting room booking', 'duration', '3h', 'cost', 120.00)));

INSERT INTO rooms (id, name, type, capacity, status) VALUES
  ('r1', 'Focus Room 1', 'Private Office', 4, 'available'),
  ('r2', 'Collab Hall', 'Meeting Room', 12, 'reserved'),
  ('r3', 'Hot Desk Zone', 'Hot Desk', 10, 'available');

INSERT INTO room_prices (room_id, price_per_hour, price_per_day) VALUES
  ('r1', 80.00, 480.00),
  ('r2', 180.00, 1080.00),
  ('r3', 35.00, 210.00);

INSERT INTO bookings (id, customer_id, room_id, start_time, end_time, status, total_amount) VALUES
  ('b1', 'c1', 'r1', '2026-04-01 09:00:00', '2026-04-01 13:00:00', 'completed', 320.00);

INSERT INTO transactions (id, booking_id, customer_id, date, description, category, amount, method) VALUES
  ('t1', 'b1', 'c1', '2026-04-01', 'Focus Room 1 booking for Lina Ahmed', 'Income', 320.00, 'Card');

CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  room_id VARCHAR(36) NOT NULL,
  booking_id VARCHAR(36) NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NULL,
  status ENUM('active', 'closed') NOT NULL DEFAULT 'active',
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE items (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category ENUM('Drink', 'Snack', 'Office Supply', 'Service') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE session_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL UNIQUE,
  room_amount DECIMAL(10,2) NOT NULL,
  items_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  method ENUM('Cash', 'Card', 'Transfer') NOT NULL,
  status ENUM('pending', 'paid', 'refunded') NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

ALTER TABLE transactions
  ADD COLUMN session_id VARCHAR(36) NULL AFTER booking_id,
  ADD CONSTRAINT fk_transactions_session
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;

ALTER TABLE customers DROP COLUMN history;

INSERT INTO items (id, name, price, stock, category) VALUES
  ('i1', 'Water Bottle', 5.00, 50, 'Drink'),
  ('i2', 'Coffee', 15.00, 30, 'Drink'),
  ('i3', 'Chocolate Bar', 10.00, 20, 'Snack');
