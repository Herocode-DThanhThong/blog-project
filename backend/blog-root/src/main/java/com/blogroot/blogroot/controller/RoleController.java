package com.blogroot.blogroot.controller;

import com.blogroot.blogroot.constants.Role;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@Slf4j
@Tag(name = "Role endpoint")
@RequiredArgsConstructor
public class RoleController {
    private static final String[] ROLE_LIST = {
            Role.ADMIN.name(),
            Role.MANAGER.name(),
            Role.USER.name()
    };

    @GetMapping
    public ResponseEntity<List<String>> getRoles() {
        return ResponseEntity.ok(Arrays.asList(ROLE_LIST));
    }
}
