package com.webshop.backend.controller;

import com.webshop.backend.model.Product;
import com.webshop.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Page<Product> getAllProducts(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        log.info("Request products: query={}, page={}, size={}", query, page, size);
        return productService.getProducts(query, PageRequest.of(page, size));
    }

    @PostMapping("/purchase")
    public ResponseEntity<String> purchase(@RequestBody List<Product> items) {
        log.info("Processing purchase for {} items", items.size());
        items.forEach(item -> log.info("Purchased item: {} - ${}", item.getName(), item.getPrice()));
        return ResponseEntity.ok("Purchase successful! Thank you for your order.");
    }
}
