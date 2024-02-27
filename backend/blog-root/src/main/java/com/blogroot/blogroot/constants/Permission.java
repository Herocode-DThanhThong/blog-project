package com.blogroot.blogroot.constants;

import lombok.Getter;

public enum Permission {
    ADMIN_READ("admin:read"),

    ADMIN_CREATE("admin:create"),

    ADMIN_UPDATE("admin:update"),

    ADMIN_DELETE("admin:delete"),

    MANAGER_READ("management:read"),

    MANAGER_CREATE("management:create"),

    MANAGER_UPDATE("management:update"),

    MANAGER_DELETE("management:delete");

    @Getter
    private String permission;

    Permission(String permission) {
        this.permission = permission;
    }

}
