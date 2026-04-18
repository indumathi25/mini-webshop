package com.webshop.backend.service;

import org.springframework.http.ResponseEntity;

public interface IdempotencyService {
    ResponseEntity<String> checkKey(String key);

    void markCompleted(String key, String response);

    void markFailed(String key);
}
