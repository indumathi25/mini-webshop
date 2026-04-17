package com.webshop.backend.service;

import com.webshop.backend.model.Product;
import com.webshop.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.webshop.backend.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import com.webshop.backend.dto.PurchaseItem;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<Product> getProducts(String query, Pageable pageable) {
        try {
            if (query != null && !query.trim().isEmpty()) {
                log.info("Searching products with query: '{}'", query);
                return productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query,
                        pageable);
            }
            log.info("Fetching all products");
            return productRepository.findAll(pageable);
        } catch (Exception e) {
            log.error("Error fetching products: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public Product getProductById(Long id) {
        log.info("Fetching product with id: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + id + " not found"));
    }

    @Override
    @Transactional
    public void purchaseProducts(List<PurchaseItem> items) {
        try {
            log.info("Deducting stock for {} products using atomic updates", items.size());
            for (PurchaseItem item : items) {
                int quantity = item.getQuantity();
                Long productId = item.getProductId();
                
                int rowsAffected = productRepository.decrementStock(productId, quantity);

                if (rowsAffected == 0) {
                    String name = productRepository.findById(productId)
                            .map(Product::getName)
                            .orElse("Unknown Product");
                    throw new RuntimeException("Product " + name + " does not have enough stock (" + quantity + " requested)!");
                }

                log.info("Successfully deducted {} units for product ID: {}", quantity, productId);
            }
        } catch (Exception e) {
            log.error("Error during purchase: {}", e.getMessage(), e);
            throw e;
        }
    }
}
