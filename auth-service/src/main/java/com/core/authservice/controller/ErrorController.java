package com.core.authservice.controller;

import com.core.authservice.dto.APIErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class ErrorController {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIErrorResponse> handleException(Exception ex) {
        log.error("Caught exception", ex);
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Internal Server Error")
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<APIErrorResponse> handleHttpMessageNotReadableException(Exception ignoredEx) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("The server cannot process the request due to client error")
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("The server cannot process the request due to client error")
                .errors(ex.getBindingResult().getAllErrors().stream()
                        .map(e -> new APIErrorResponse.FieldError(((FieldError) e).getField(), e.getDefaultMessage()))
                        .toList()
                )
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<APIErrorResponse> handleBadCredentialsException(BadCredentialsException ignoredEx) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("Incorrect username or password")
                .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }
}
