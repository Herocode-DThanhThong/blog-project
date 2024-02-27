package com.blogroot.blogroot.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlogDTO {
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Content is required")
    private String content;
}
