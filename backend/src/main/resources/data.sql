-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (id, username, password_hash, role) VALUES 
(1, 'admin', '$2a$10$2bRZwW3TtX5outzPHWE8IuIZFyll3BbYKadVieUj06MYjR.18adQm', 'ADMIN');

-- Insert default viewer user (password: viewer123)
INSERT IGNORE INTO users (id, username, password_hash, role) VALUES 
(2, 'viewer', '$2a$10$vOTqnZJGRB2aBXyjpwaEge9xzFurpf7XxZMw62S.YHlQN0ceU0fjS', 'VIEWER');




-- Insert sample dummy data

INSERT IGNORE INTO products (name, category, price, quantity, threshold, created_at, updated_at)
VALUES 
  ('Logitech Mouse', 'Electronics', 25.99, 100, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('A4 Paper Pack', 'Office Supplies', 4.50, 25, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Ballpoint Pens', 'Office Supplies', 1.20, 100, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('USB Flash Drive 32GB', 'Electronics', 9.99, 75, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Notebook - Ruled', 'Books & Media', 2.50, 25, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Water Bottle', 'Health & Beauty', 3.00, 60, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Yoga Mat', 'Sports & Recreation', 15.00, 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Screwdriver Set', 'Tools & Hardware', 8.99, 35, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('LED Desk Lamp', 'Home & Garden', 18.75, 12, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Cotton T-Shirts - Medium', 'Clothing', 6.99, 50, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Bluetooth Headphones', 'Electronics', 29.99, 20, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Desk Organizer Set', 'Office Supplies', 12.50, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Instant Coffee Jar', 'Food & Beverages', 6.75, 15, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Electric Kettle', 'Home & Garden', 22.00, 18, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Basic Calculator', 'Office Supplies', 5.00, 60, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT IGNORE INTO inventory_logs (product_id, change_type, quantity_changed, timestamp, notes)
VALUES
  (1, 'ADD', 50, CURRENT_TIMESTAMP, 'Initial stock'),
  (2, 'ADD', 20, CURRENT_TIMESTAMP, 'First load');
