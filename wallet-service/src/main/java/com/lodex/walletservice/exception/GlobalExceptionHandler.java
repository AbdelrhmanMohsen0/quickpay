package com.lodex.walletservice.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles validation errors (400 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    // Missing headers (400 Bad Request)
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MissingRequestHeaderException ex) {
        Map<String, String> errors = new HashMap<>();

        errors.put("error", "Missing required header");
        errors.put("headerName", ex.getHeaderName());

        return ResponseEntity.badRequest().body(errors);
    }

//    // if a user inquired his balance before this service receive user.created event
//    @ExceptionHandler(WalletNotFoundException.class)
//    public ResponseEntity<Map<String, String>> handleWalletNotFoundExceptions(WalletNotFoundException ex) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body(Map.of("message", ex.getMessage()));
//    }

//    // No enough fund to transfer
//    @ExceptionHandler(NotEnoughFundException.class)
//    public ResponseEntity<Map<String, String>> handleNotEnoughFundExceptions(NotEnoughFundException ex) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body(Map.of("message", ex.getMessage()));
//    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDatabaseDuplicateKey(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Transaction already processed."));
    }
}
