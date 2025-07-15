package com.inventory.controller;

import com.inventory.dto.InventoryAdjustmentDto;
import com.inventory.entity.InventoryLog;
import com.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/add")
    public ResponseEntity<String> addStock(@Valid @RequestBody InventoryAdjustmentDto adjustmentDto) {
        try {
            inventoryService.addStock(adjustmentDto);
            return ResponseEntity.ok("Stock added successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<String> removeStock(@Valid @RequestBody InventoryAdjustmentDto adjustmentDto) {
        try {
            inventoryService.removeStock(adjustmentDto);
            return ResponseEntity.ok("Stock removed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/adjust/{productId}")
    public ResponseEntity<String> adjustStock(@PathVariable Long productId,
                                            @RequestParam Integer quantity,
                                            @RequestParam(required = false) String notes) {
        try {
            inventoryService.adjustStock(productId, quantity, notes);
            return ResponseEntity.ok("Stock adjusted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/logs/{productId}")
    public ResponseEntity<Page<InventoryLog>> getProductInventoryLogs(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<InventoryLog> logs = inventoryService.getProductInventoryLogs(productId, page, size);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/activities")
    public ResponseEntity<Page<InventoryLog>> getRecentActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<InventoryLog> activities = inventoryService.getRecentActivities(page, size);
        return ResponseEntity.ok(activities);
    }
}
