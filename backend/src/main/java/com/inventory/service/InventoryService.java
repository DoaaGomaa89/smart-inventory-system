package com.inventory.service;

import com.inventory.dto.InventoryAdjustmentDto;
import com.inventory.entity.InventoryLog;
import com.inventory.entity.Product;
import com.inventory.repository.InventoryLogRepository;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    // Add stock to product
    public void addStock(InventoryAdjustmentDto adjustmentDto) {
        Product product = productRepository.findById(adjustmentDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int newQuantity = product.getQuantity() + adjustmentDto.getQuantity();
        product.setQuantity(newQuantity);
        productRepository.save(product);

        // Log the transaction
        InventoryLog log = new InventoryLog(
                product,
                InventoryLog.ChangeType.ADD,
                adjustmentDto.getQuantity(),
                adjustmentDto.getNotes()
        );
        inventoryLogRepository.save(log);
    }

    // Remove stock from product
    public void removeStock(InventoryAdjustmentDto adjustmentDto) {
        Product product = productRepository.findById(adjustmentDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < adjustmentDto.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getQuantity());
        }

        int newQuantity = product.getQuantity() - adjustmentDto.getQuantity();
        product.setQuantity(newQuantity);
        productRepository.save(product);

        // Log the transaction
        InventoryLog log = new InventoryLog(
                product,
                InventoryLog.ChangeType.REMOVE,
                adjustmentDto.getQuantity(),
                adjustmentDto.getNotes()
        );
        inventoryLogRepository.save(log);
    }

    // Adjust stock to specific quantity
    public void adjustStock(Long productId, Integer newQuantity, String notes) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int difference = newQuantity - product.getQuantity();
        product.setQuantity(newQuantity);
        productRepository.save(product);

        // Log the transaction
        InventoryLog.ChangeType changeType = difference > 0 ? 
                InventoryLog.ChangeType.ADD : InventoryLog.ChangeType.REMOVE;
        
        InventoryLog log = new InventoryLog(
                product,
                changeType,
                Math.abs(difference),
                notes != null ? notes : "Stock adjustment"
        );
        inventoryLogRepository.save(log);
    }

    // Get inventory logs for a product
    public Page<InventoryLog> getProductInventoryLogs(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return inventoryLogRepository.findByProductIdOrderByTimestampDesc(productId, pageable);
    }

    // Get recent inventory activities
    public Page<InventoryLog> getRecentActivities(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return inventoryLogRepository.findAll(pageable);
    }
}
