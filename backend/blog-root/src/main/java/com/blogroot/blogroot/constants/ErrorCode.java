package com.blogroot.blogroot.constants;

import lombok.Getter;

public enum ErrorCode {
    USERNAME_ALREADY_IN_USE("error_001", "Username already in use"),
    EMAIL_ALREADY_IN_USE("error_002", "Email already in use"),
    ACCOUNT_NOT_VERIFIED("error_003", "The account has not been verified"),
    VERIFICATION_TOKEN_NOT_FOUND("error_004", "Verification token not found"),
    EMAIL_VERIFY_ACCOUNT_WAS_EXPIRED("error_005", "Link verify your account was expired"),
    INVALID_REFRESH_TOKEN("error_006", "Invalid refresh token"),
    REFRESH_TOKEN_WAS_EXPIRED("error_007", "Refresh token was expired"),
    USER_NOT_FOUND("error_008", "User not found"),
    ROLE_MANAGER_REQUEST_NOT_FOUND("error_009", "Role manager request not found"),
    ROLE_MANAGER_REQUEST_IS_PENDING("error_010", "Role manager request is pending"),
    BLOG_NOT_FOUND("error_011", "Blog doesn't exist"),
    ACCOUNT_ALREADY_ACTIVATED("error_012", "Your account has been activated"),
    TOKEN_EXPIRED("error_013", "Your token has expired"),
    AUTHENTICATION_FAILURE("error_014", "Authentication failure"),
    ROLE_MANAGER_REQUEST_IS_APPROVED("error_015", "Role manager request is approved, your role was manager");
    @Getter
    private String errorCode;
    @Getter
    private String message;

    ErrorCode(String errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }
}
