package com.inventory.service;

import com.inventory.dto.DashboardSummaryDto;
import com.inventory.entity.InventoryLog;
import com.inventory.repository.InventoryLogRepository;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;


@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    public DashboardSummaryDto getDashboardSummary() {
        DashboardSummaryDto summary = new DashboardSummaryDto();

        // Basic counts
        summary.setTotalProducts(productRepository.count());
        summary.setLowStockCount(productRepository.countLowStockProducts());
        summary.setTodayTransactions(inventoryLogRepository.countTodayTransactions());

        // Category breakdown
        List<Object[]> categoryData = productRepository.getCategoryBreakdown();
        List<DashboardSummaryDto.CategoryStockDto> categoryBreakdown = categoryData.stream()
                .map(row -> new DashboardSummaryDto.CategoryStockDto(
                        (String) row[0],           // category
                        ((Number) row[1]).longValue(),  // count
                        ((Number) row[2]).longValue()   // lowStockCount
                ))
                .collect(Collectors.toList());
        summary.setCategoryBreakdown(categoryBreakdown);

        // Recent activities
        List<InventoryLog> recentLogs = inventoryLogRepository.findTop10ByOrderByTimestampDesc();
        List<DashboardSummaryDto.RecentActivityDto> recentActivities = recentLogs.stream()
                .map(log -> new DashboardSummaryDto.RecentActivityDto(
                        log.getProduct().getName(),
                        log.getChangeType().name(),
                        log.getQuantityChanged(),
                        log.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                ))
                .collect(Collectors.toList());
        summary.setRecentActivities(recentActivities);

        // Monthly transaction data (last 12 months)
        LocalDateTime startDate = LocalDateTime.now().minusMonths(12);
        List<Object[]> monthlyData = inventoryLogRepository.getMonthlyTransactionCounts(startDate);
        Map<String, Integer> monthlyTransactions = new HashMap<>();
        
//        for (Object[] row : monthlyData) {
//            String month = "Month " + row[0].toString();
//            Integer count = ((Number) row[1]).intValue();
//            monthlyTransactions.put(month, count);
//        }
        
        //----------------------
        for (Object[] row : monthlyData) {
            int monthNumber = ((Number) row[0]).intValue(); // 1 = Jan, 2 = Feb, ...
            String monthName = Month.of(monthNumber).getDisplayName(TextStyle.SHORT, Locale.ENGLISH); // "Jan", "Feb", etc.
            Integer count = ((Number) row[1]).intValue();
            monthlyTransactions.put(monthName, count);
        }
        //----------------------
        summary.setMonthlyTransactions(monthlyTransactions);

        
        // Calculate estimated total value (assuming average price of $10 per unit)
//        summary.setTotalValue(summary.getTotalProducts() * 10.0);
        
        
        // Realistic Estimated Inventory Value = Sum of (Product Price × Product Quantity) for all products.
        double totalValue = productRepository.findAll().stream()
        	    .mapToDouble(product -> product.getPrice() * product.getQuantity())
        	    .sum();

        summary.setTotalValue(totalValue);

        return summary;
    }
}
