package com.core.userservice.controller;

import com.core.userservice.dto.APIErrorResponse;
import com.core.userservice.exception.UserForbiddenException;
import com.core.userservice.exception.UserNotFoundException;
import com.core.userservice.exception.UserUnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

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

    @ExceptionHandler({NoResourceFoundException.class, HttpRequestMethodNotSupportedException.class})
    public ResponseEntity<APIErrorResponse> handleNoResourceFoundException(Exception ignoredEx) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message("Not Found")
                .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
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

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<APIErrorResponse> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<APIErrorResponse> handleMissingRequestHeaderException(MissingRequestHeaderException ex) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<APIErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ignoredEx) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Error in the format of the passed data")
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserUnauthorizedException.class)
    public ResponseEntity<APIErrorResponse> handleUserUnauthorizedException(UserUnauthorizedException ignoredEx) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("Incorrect Credentials")
                .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserForbiddenException.class)
    public ResponseEntity<APIErrorResponse> handleUserForbiddenException(UserForbiddenException ex) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message("Insufficient Permissions: " + ex.getMessage())
                .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<APIErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
        APIErrorResponse error = APIErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
