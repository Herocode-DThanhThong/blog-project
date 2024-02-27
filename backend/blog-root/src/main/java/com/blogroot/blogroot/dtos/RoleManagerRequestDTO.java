package com.blogroot.blogroot.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleManagerRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Description is required")
    private String description;
}
