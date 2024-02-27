package com.blogroot.blogroot.exception;

import com.blogroot.blogroot.constants.ErrorCode;
import com.blogroot.blogroot.response.ErrorResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.jsonwebtoken.ExpiredJwtException;
import org.quartz.SchedulerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionControllerHandler {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleException(
            BaseException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<Object> handleJsonProgressingException(
            JsonProcessingException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Object> handleExpiredJwtException(
            ExpiredJwtException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("errorCode", ErrorCode.TOKEN_EXPIRED.getErrorCode());
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(SchedulerException.class)
    public ResponseEntity<Object> handleSchedulerException(
            SchedulerException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

}
