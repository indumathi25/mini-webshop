package com.webshop.backend.controller;

import com.webshop.backend.model.Product;
import com.webshop.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.webshop.backend.dto.PurchaseItem;
import java.util.List;
import com.webshop.backend.model.IdempotencyRecord;
import com.webshop.backend.repository.IdempotencyRecordRepository;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final IdempotencyRecordRepository idempotencyRepository;

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
            Optional<IdempotencyRecord> recordOpt = idempotencyRepository.findById(idempotencyKey);
            if (recordOpt.isPresent()) {
                IdempotencyRecord record = recordOpt.get();
                if (record.getStatus() == IdempotencyRecord.Status.PROCESSING) {
                    log.warn("Blocked duplicate checkout attempt for key: {}", idempotencyKey);
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Request is currently processing");
                }
                log.info("Returning cached successful checkout response for key: {}", idempotencyKey);
                return ResponseEntity.ok(record.getResponse());
            }

            idempotencyRepository.save(new IdempotencyRecord(idempotencyKey, IdempotencyRecord.Status.PROCESSING, null,
                    LocalDateTime.now()));
        }

        log.info("Processing purchase for {} items", items.size());

        try {
            productService.purchaseProducts(items);
        } catch (RuntimeException e) {
            log.error("Purchase failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

        String responseMessage = "Purchase successful! Thank you for your order.";

        if (idempotencyKey != null) {
            IdempotencyRecord record = idempotencyRepository.findById(idempotencyKey)
                    .orElseThrow(() -> new RuntimeException("Idempotency record vanished"));
            record.setStatus(IdempotencyRecord.Status.COMPLETED);
            record.setResponse(responseMessage);
            idempotencyRepository.save(record);
        }

        return ResponseEntity.ok(responseMessage);
    }
}
