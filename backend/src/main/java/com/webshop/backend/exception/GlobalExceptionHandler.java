package com.webshop.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex,
            HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler({ IllegalArgumentException.class, MethodArgumentTypeMismatchException.class })
    public ResponseEntity<ApiErrorResponse> handleBadRequestExceptions(Exception ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request.getRequestURI(),
                null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleMalformedJson(HttpMessageNotReadableException ex,
            HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Malformed JSON Request",
                "The provided request body was invalid or improperly formatted.", request.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        List<ApiErrorResponse.ValidationError> validationErrors = ex.getBindingResult().getAllErrors().stream()
                .map(error -> new ApiErrorResponse.ValidationError(((FieldError) error).getField(),
                        error.getDefaultMessage()))
                .collect(Collectors.toList());

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation Error", "Invalid input data",
                request.getRequestURI(), validationErrors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleAllOtherExceptions(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception trapped by GlobalExceptionHandler at {}: {}", request.getRequestURI(),
                ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                "An unexpected error occurred. Please contact support.", request.getRequestURI(), null);
    }

    private ResponseEntity<ApiErrorResponse> buildErrorResponse(HttpStatus status, String error, String message,
            String path, List<ApiErrorResponse.ValidationError> validationErrors) {
        ApiErrorResponse response = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(error)
                .message(message)
                .path(path)
                .validationErrors(validationErrors)
                .build();
        return new ResponseEntity<>(response, status);
    }
}
