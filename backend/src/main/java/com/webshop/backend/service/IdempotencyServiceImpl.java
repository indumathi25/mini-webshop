package com.webshop.backend.service;

import com.webshop.backend.model.IdempotencyRecord;
import com.webshop.backend.model.IdempotencyRecord.Status;
import com.webshop.backend.repository.IdempotencyRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdempotencyServiceImpl implements IdempotencyService {

    private final IdempotencyRecordRepository idempotencyRepository;

    @Override
    @Transactional
    public ResponseEntity<String> checkKey(String key) {
        Optional<IdempotencyRecord> existing = idempotencyRepository.findById(key);

        if (existing.isPresent()) {
            IdempotencyRecord record = existing.get();
            if (record.getStatus() == Status.PROCESSING) {
                log.warn("Blocked duplicate in-flight request for key: {}", key);
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Request is currently processing");
            }
            log.info("Returning cached response for idempotency key: {}", key);
            return ResponseEntity.ok(record.getResponse());
        }

        idempotencyRepository.save(
                new IdempotencyRecord(key, Status.PROCESSING, null, LocalDateTime.now()));
        return null;
    }

    @Override
    @Transactional
    public void markCompleted(String key, String response) {
        updateRecord(key, Status.COMPLETED, response);
    }

    @Override
    @Transactional
    public void markFailed(String key) {
        idempotencyRepository.deleteById(key);
    }

    private void updateRecord(String key, Status status, String response) {
        IdempotencyRecord record = idempotencyRepository.findById(key)
                .orElseThrow(() -> new IllegalStateException(
                        "Idempotency record missing for key: " + key));
        record.setStatus(status);
        record.setResponse(response);
        idempotencyRepository.save(record);
    }
}
