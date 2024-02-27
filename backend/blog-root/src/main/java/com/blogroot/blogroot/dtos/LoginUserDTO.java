package com.blogroot.blogroot.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginUserDTO {
    @NotBlank(message = "Username doesn't blank")
    private String username;
    @NotBlank(message = "Password doesn't blank")
    private String password;
}
