package com.blogroot.blogroot.controller;

import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@Slf4j
@Tag(name = "Request user endpoint")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<User> getMe(Principal connectedUsername) throws BaseException {
        return ResponseEntity.ok().body(userService.getCurrentUser(connectedUsername));
    }

    @GetMapping("/all")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUser() {
        return ResponseEntity.ok().body(userService.getUsers());
    }
}
