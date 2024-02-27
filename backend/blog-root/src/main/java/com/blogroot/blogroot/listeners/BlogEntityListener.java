package com.blogroot.blogroot.listeners;

import com.blogroot.blogroot.model.Blog;
import com.blogroot.blogroot.service.BlogRedisService;
import com.blogroot.blogroot.service.RoleManagerRequestRedisService;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class BlogEntityListener {
    private final BlogRedisService blogRedisService;

    @PrePersist
    public void prePersist(Blog blog) {
        log.info("pre persist!");
    }

    @PostPersist
    public void postPersist(Blog blog) {
        blogRedisService.clearCache();
        log.info("post persist!");
    }

    @PreUpdate
    public void preUpdate(Blog blog) {
        log.info("pre update!");
    }

    @PostUpdate
    public void postUpdate(Blog blog) {
        log.info("post update!");
        blogRedisService.clearCache();
    }

    @PreRemove
    public void preRemove(Blog blog) {
        log.info("pre remove!");
    }

    @PostRemove
    public void postRemove(Blog blog) {
        log.info("post remove!");
        blogRedisService.clearCache();
    }
}
