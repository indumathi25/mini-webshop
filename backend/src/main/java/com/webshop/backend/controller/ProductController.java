package com.webshop.backend.controller;

import com.webshop.backend.dto.PurchaseItem;
import com.webshop.backend.model.Product;
import com.webshop.backend.service.IdempotencyService;
import com.webshop.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final IdempotencyService idempotencyService;

    @GetMapping
    public Page<Product> getAllProducts(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        log.info("Request products: query={}, page={}, size={}", query, page, size);
        return productService.getProducts(query, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        log.info("Request product by id: {}", id);
        return productService.getProductById(id);
    }

    @PostMapping("/purchase")
    public ResponseEntity<String> purchase(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody List<PurchaseItem> items) {

        if (idempotencyKey != null) {
            ResponseEntity<String> cached = idempotencyService.checkKey(idempotencyKey);
            if (cached != null)
                return cached;
        }

        log.info("Processing purchase for {} items", items.size());

        try {
            productService.purchaseProducts(items);
        } catch (RuntimeException e) {
            log.error("Purchase failed: {}", e.getMessage());
            if (idempotencyKey != null)
                idempotencyService.markFailed(idempotencyKey);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

        String responseMessage = "Purchase successful! Thank you for your order.";

        if (idempotencyKey != null) {
            idempotencyService.markCompleted(idempotencyKey, responseMessage);
        }

        return ResponseEntity.ok(responseMessage);
    }
}
