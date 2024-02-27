package com.blogroot.blogroot.listeners;

import com.blogroot.blogroot.model.Blog;
import com.blogroot.blogroot.model.RoleManagerRequest;
import com.blogroot.blogroot.service.RoleManagerRequestRedisService;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class RoleManagerRequestListener {
    private final RoleManagerRequestRedisService roleManagerRequestRedisService;

    @PrePersist
    public void prePersist(RoleManagerRequest roleManagerRequest) {
        log.info("pre persist!");
    }

    @PostPersist
    public void postPersist(RoleManagerRequest roleManagerRequest) {
        roleManagerRequestRedisService.clearCache();
        log.info("post persist!");
    }

    @PreUpdate
    public void preUpdate(RoleManagerRequest roleManagerRequest) {
        log.info("pre update!");
    }

    @PostUpdate
    public void postUpdate(RoleManagerRequest roleManagerRequest) {
        log.info("post update!");
        roleManagerRequestRedisService.clearCache();
    }

    @PreRemove
    public void preRemove(RoleManagerRequest roleManagerRequest) {
        log.info("pre remove!");
    }

    @PostRemove
    public void postRemove(RoleManagerRequest roleManagerRequest) {
        log.info("post remove!");
        roleManagerRequestRedisService.clearCache();
    }
}
