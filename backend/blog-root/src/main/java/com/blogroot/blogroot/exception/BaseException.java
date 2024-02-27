package com.blogroot.blogroot.exception;

import lombok.Data;

@Data
public class BaseException extends Exception {
    private String errorCode;
    private String message;

    public BaseException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
    }
}
