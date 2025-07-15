package com.inventory.repository;

import com.inventory.entity.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    
    // Find logs by product
    Page<InventoryLog> findByProductIdOrderByTimestampDesc(Long productId, Pageable pageable);

    // Find recent activities
    List<InventoryLog> findTop10ByOrderByTimestampDesc();

    // Count today's transactions
    @Query("SELECT COUNT(l) FROM InventoryLog l WHERE DATE(l.timestamp) = CURRENT_DATE")
    long countTodayTransactions();

    // Get monthly transaction counts
    @Query("SELECT MONTH(l.timestamp), COUNT(l) FROM InventoryLog l " +
           "WHERE l.timestamp >= :startDate " +
           "GROUP BY MONTH(l.timestamp) " +
           "ORDER BY MONTH(l.timestamp)")
    List<Object[]> getMonthlyTransactionCounts(@Param("startDate") LocalDateTime startDate);

    // Find logs within date range
    List<InventoryLog> findByTimestampBetweenOrderByTimestampDesc(
        LocalDateTime startDate, LocalDateTime endDate);
}
