package com.blogroot.blogroot.controller;

import com.blogroot.blogroot.dtos.BlogDTO;
import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.Blog;
import com.blogroot.blogroot.response.BlogListResponse;
import com.blogroot.blogroot.service.BlogService;
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
import java.util.List;

@RestController
@RequestMapping("/api/v1/blog")
@Slf4j
@Tag(name = "Blog endpoint")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<BlogListResponse> getAllBlog(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "desc") String sort,
            @RequestParam(value = "text", defaultValue = "") String searchText
    ) throws JsonProcessingException, SchedulerException {
        PageRequest pageRequest = PageRequest.of(page, limit, sort.equals("asc") ? Sort.by("createdDate").ascending() : Sort.by("createdDate").descending());
        return ResponseEntity.ok(blogService.getAllBlog(searchText, pageRequest));
    }

    @GetMapping("/{id}")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Blog> getDetailBlog(@PathVariable("id") Long id) throws BaseException {
        return ResponseEntity.ok(blogService.getDetailBlog(id));
    }

    @GetMapping("/by-user")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<Blog>> getBlogByUser(Principal connectedUsername) throws BaseException {
        return ResponseEntity.ok(blogService.getBlogByUser(connectedUsername));
    }


    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Blog> createBlog(@Valid @RequestBody BlogDTO blogDTO, Principal connectedUsername) throws BaseException {
        return ResponseEntity.ok(blogService.createBlog(blogDTO, connectedUsername));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Blog> updateBlog(@PathVariable("id") Long id, @Valid @RequestBody BlogDTO blogDTO) throws BaseException {
        return ResponseEntity.ok(blogService.updateBlog(id, blogDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> deleteBlog(@PathVariable("id") Long id) throws BaseException {
        blogService.deleteBlog(id);
        return ResponseEntity.ok().build();
    }
}
