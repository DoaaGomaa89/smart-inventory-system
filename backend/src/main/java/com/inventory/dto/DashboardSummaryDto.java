package com.inventory.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    private long totalProducts;
    private long lowStockCount;
    private double totalValue;
    private long todayTransactions;
    private List<CategoryStockDto> categoryBreakdown;
    private List<RecentActivityDto> recentActivities;
    private Map<String, Integer> monthlyTransactions;

    // Constructors
    public DashboardSummaryDto() {}

    // Inner classes for nested data
    public static class CategoryStockDto {
        private String category;
        private long count;
        private long lowStockCount;

        public CategoryStockDto(String category, long count, long lowStockCount) {
            this.category = category;
            this.count = count;
            this.lowStockCount = lowStockCount;
        }

        // Getters and Setters
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }

        public long getLowStockCount() { return lowStockCount; }
        public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }
    }

    public static class RecentActivityDto {
        private String productName;
        private String action;
        private Integer quantity;
        private String timestamp;

        public RecentActivityDto(String productName, String action, Integer quantity, String timestamp) {
            this.productName = productName;
            this.action = action;
            this.quantity = quantity;
            this.timestamp = timestamp;
        }

        // Getters and Setters
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }

    // Main class getters and setters
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }

    public double getTotalValue() { return totalValue; }
    public void setTotalValue(double totalValue) { this.totalValue = totalValue; }

    public long getTodayTransactions() { return todayTransactions; }
    public void setTodayTransactions(long todayTransactions) { this.todayTransactions = todayTransactions; }

    public List<CategoryStockDto> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryStockDto> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<RecentActivityDto> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<RecentActivityDto> recentActivities) { this.recentActivities = recentActivities; }

    public Map<String, Integer> getMonthlyTransactions() { return monthlyTransactions; }
    public void setMonthlyTransactions(Map<String, Integer> monthlyTransactions) { this.monthlyTransactions = monthlyTransactions; }
}
