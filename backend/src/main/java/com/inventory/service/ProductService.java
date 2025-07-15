package com.inventory.service;

import com.inventory.dto.ProductDto;
import com.inventory.entity.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Get all products with pagination and filtering
    public Page<ProductDto> getAllProducts(int page, int size, String sortBy, String sortDir, 
                                         String category, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> productPage = productRepository.findProductsWithFilters(category, search, pageable);
        
        return productPage.map(this::convertToDto);
    }

    // Get product by ID
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDto(product);
    }

    // Create new product
    public ProductDto createProduct(ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    // Update existing product
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existingProduct.setName(productDto.getName());
        existingProduct.setCategory(productDto.getCategory());
        existingProduct.setQuantity(productDto.getQuantity());
        existingProduct.setThreshold(productDto.getThreshold());
        existingProduct.setPrice(productDto.getPrice());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDto(updatedProduct);
    }

    // Delete product
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // Get low stock products
    public List<ProductDto> getLowStockProducts() {
        List<Product> lowStockProducts = productRepository.findLowStockProducts();
        return lowStockProducts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get all categories
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    // Convert Entity to DTO
    private ProductDto convertToDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getQuantity(),
                product.getThreshold(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.isLowStock()
        );
    }

    // Convert DTO to Entity
    private Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setCategory(productDto.getCategory());
        product.setPrice(productDto.getPrice());
        product.setQuantity(productDto.getQuantity());
        product.setThreshold(productDto.getThreshold());
        return product;
    }
}
