package com.inventory.repository;

import com.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products with low stock
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.threshold")
    List<Product> findLowStockProducts();

    // Count low stock products
    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity <= p.threshold")
    long countLowStockProducts();

    // Find products by category
    List<Product> findByCategory(String category);

    // Search products by name containing keyword
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Get all distinct categories
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findAllCategories();

    // Get category breakdown with counts
    @Query("SELECT p.category, COUNT(p), " +
           "SUM(CASE WHEN p.quantity <= p.threshold THEN 1 ELSE 0 END) " +
           "FROM Product p GROUP BY p.category")
    List<Object[]> getCategoryBreakdown();

    // Find products by category and filter by search term
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findProductsWithFilters(@Param("category") String category, 
                                        @Param("search") String search, 
                                        Pageable pageable);
}
