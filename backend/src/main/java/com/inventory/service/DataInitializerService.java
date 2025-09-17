package com.inventory.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DataInitializerService implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Check and insert default admin user
        jdbcTemplate.update(
            "INSERT IGNORE INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
            1, "admin", "$2a$10$2bRZwW3TtX5outzPHWE8IuIZFyll3BbYKadVieUj06MYjR.18adQm", "ADMIN"
        );

        // Check and insert default viewer user
        jdbcTemplate.update(
            "INSERT IGNORE INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
            2, "viewer", "$2a$10$vOTqnZJGRB2aBXyjpwaEge9xzFurpf7XxZMw62S.YHlQN0ceU0fjS", "VIEWER"
        );

        // Insert sample products if missing
        jdbcTemplate.update(
            "INSERT IGNORE INTO products (name, category, price, quantity, threshold, created_at, updated_at) VALUES " +
            "(?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
            "Logitech Mouse", "Electronics", 25.99, 100, 30
        );

        // Add more insert statements for other products and inventory logs as needed
    }
}
