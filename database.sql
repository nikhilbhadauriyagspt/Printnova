-- Database Schema for E-commerce Project

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables to reset schema
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS contact_queries;
DROP TABLE IF EXISTS websites;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin
INSERT INTO admins (username, password) 
SELECT * FROM (SELECT 'admin', '$2a$10$Rx/..W..') AS tmp
WHERE NOT EXISTS (
    SELECT username FROM admins WHERE username = 'admin'
) LIMIT 1;

-- Categories Table (Extended)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    image VARCHAR(255),
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Websites Table
CREATE TABLE IF NOT EXISTS websites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO websites (name, url) 
SELECT * FROM (SELECT 'Main Store', 'http://localhost:5173') AS tmp
WHERE NOT EXISTS (
    SELECT name FROM websites WHERE name = 'Main Store'
) LIMIT 1;

-- Products Table (Extended)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2),
    stock INT NOT NULL DEFAULT 100,
    image_url VARCHAR(255),
    category_id INT,
    is_featured BOOLEAN DEFAULT 0,
    is_best_selling BOOLEAN DEFAULT 0,
    status BOOLEAN DEFAULT 1,
    rating INT DEFAULT 0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    website_id INT DEFAULT 1,
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('COD', 'PayPal') DEFAULT 'COD',
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Contact Queries Table
CREATE TABLE IF NOT EXISTS contact_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE SET NULL
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default Payment Settings
INSERT INTO settings (key_name, value, description) VALUES 
('paypal_enabled', '1', 'Enable or Disable PayPal Payment'),
('paypal_client_id', 'test', 'PayPal Client ID'),
('paypal_secret', '', 'PayPal Secret Key'),
('cod_enabled', '1', 'Enable or Disable Cash on Delivery');