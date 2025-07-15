-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'VIEWER') NOT NULL
);

-- ==========================================
-- PRODUCTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL DEFAULT 0.0,
    quantity INT NOT NULL CHECK (quantity >= 0),
    threshold INT NOT NULL CHECK (threshold >= 1),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_product_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_product_quantity ON products(quantity);

-- ==========================================
-- INVENTORY_LOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS inventory_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    change_type ENUM('ADD', 'REMOVE', 'ADJUST') NOT NULL,
    quantity_changed INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255),
    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE
);

-- Indexes for inventory_logs
CREATE INDEX IF NOT EXISTS idx_inventory_log_product ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_log_timestamp ON inventory_logs(timestamp);


