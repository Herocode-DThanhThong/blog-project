package com.blogroot.blogroot.constants;

import lombok.Getter;

import java.util.Collections;
import java.util.Set;

public enum Role {
    USER(Collections.emptySet()),
    ADMIN(Set.of(
            Permission.ADMIN_READ,
            Permission.ADMIN_CREATE,
            Permission.ADMIN_UPDATE,
            Permission.ADMIN_DELETE,
            Permission.MANAGER_READ,
            Permission.MANAGER_CREATE,
            Permission.MANAGER_UPDATE,
            Permission.MANAGER_DELETE
    )),
    MANAGER(Set.of(
            Permission.MANAGER_READ,
            Permission.MANAGER_CREATE,
            Permission.MANAGER_UPDATE,
            Permission.MANAGER_DELETE
    ));
    @Getter
    private Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

}
