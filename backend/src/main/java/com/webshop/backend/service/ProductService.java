package com.webshop.backend.service;

import com.webshop.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Product getProductById(Long id);
    Page<Product> getProducts(String query, Pageable pageable);
}
