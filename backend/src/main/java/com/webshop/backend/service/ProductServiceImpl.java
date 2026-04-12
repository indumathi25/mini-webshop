package com.webshop.backend.service;

import com.webshop.backend.model.Product;
import com.webshop.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<Product> getProducts(String query, Pageable pageable) {
        if (query != null && !query.trim().isEmpty()) {
            log.info("Searching products with query: '{}'", query);
            return productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, pageable);
        }
        log.info("Fetching all products");
        return productRepository.findAll(pageable);
    }
}
