package com.blogroot.blogroot.controller;

import com.blogroot.blogroot.dtos.RoleManagerRequestDTO;
import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.RoleManagerRequest;
import com.blogroot.blogroot.response.RoleManagerRequestListResponse;
import com.blogroot.blogroot.service.RoleManagerRequestRedisService;
import com.blogroot.blogroot.service.RoleManagerRequestService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/role-manager-request")
@Slf4j
@Tag(name = "Request role manager endpoint")
@RequiredArgsConstructor
public class RoleManagerRequestController {
    private final RoleManagerRequestService roleManagerRequestService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<RoleManagerRequestListResponse> getAllRoleManagerRequest(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "desc") String sort) throws JsonProcessingException, SchedulerException {
        PageRequest pageRequest = PageRequest.of(page,
                limit,
                sort.equals("asc") ?
                        Sort.by("createdDate").ascending() : Sort.by("createdDate").descending());
        return ResponseEntity.ok(roleManagerRequestService.getAllRequest(pageRequest));
    }

    @GetMapping("/{id}")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<RoleManagerRequest> getDetailRoleManagerRequest(@PathVariable("id") Long id) throws BaseException {
        return ResponseEntity.ok(roleManagerRequestService.getDetailRoleManagerRequest(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<RoleManagerRequest> createRoleManagerRequest(@Valid @RequestBody RoleManagerRequestDTO roleManagerRequestDTO, Principal connectedUsername) throws BaseException {
        return ResponseEntity.ok(roleManagerRequestService.createRequest(roleManagerRequestDTO, connectedUsername));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> deleteRoleManagerRequest(@PathVariable("id") Long id) throws BaseException {
        roleManagerRequestService.deleteRequest(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/approve-role-request/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> approveRoleManagerRequest(@PathVariable("id") Long id) throws BaseException {
        roleManagerRequestService.approveRequest(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reject-role-request/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> rejectRoleManagerRequest(@PathVariable("id") Long id) throws BaseException {
        roleManagerRequestService.rejectRequest(id);
        return ResponseEntity.ok().build();
    }
}
