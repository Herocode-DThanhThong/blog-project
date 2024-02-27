package com.blogroot.blogroot.controller;

import com.blogroot.blogroot.dtos.*;
import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.response.*;
import com.blogroot.blogroot.service.AuthenticationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
@Tag(name = "Authentication endpoint")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginUserDTO loginDTO) throws BaseException {
        return ResponseEntity.ok().body(authenticationService.login(loginDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) throws BaseException {
        return ResponseEntity.ok().body(authenticationService.register(registerUserDTO));
    }

    @PostMapping("/verify-account")
    public ResponseEntity<?> verifyAccount(@RequestBody VerifyAccountUserDTO verifyAccountUserDTO) throws BaseException {
        authenticationService.verifyUser(verifyAccountUserDTO.getToken());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-email-verify")
    public ResponseEntity<?> resendVerifyEmailAccount(@RequestBody ResendEmailVerifyUserDTO resendEmailVerifyUserDTO) throws BaseException {
        authenticationService.resendEmailVerifyUser(resendEmailVerifyUserDTO.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenDTO refreshTokenDTO)
            throws BaseException {
        return ResponseEntity.ok().body(authenticationService.refreshToken(refreshTokenDTO));
    }
}
