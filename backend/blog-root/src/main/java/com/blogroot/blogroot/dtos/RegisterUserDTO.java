package com.blogroot.blogroot.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

@Data
public class RegisterUserDTO {
    @NotBlank(message = "Username doesn't blank")
    private String username;
    @Pattern(
            regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$",
            message = "Password has minimum 8 characters in length, at least 1 uppercase, 1 lower case and 1 special characters"
    )
    private String password;
    @NotBlank(message = "Email doesn't blank")
    @Email(message = "Email doesn't valid")
    private String email;
    @NotBlank(message = "Firstname doesn't blank")
    private String firstName;
    @NotBlank(message = "Lastname doesn't blank")
    private String lastName;
    @NotBlank(message = "Address doesn't blank")
    private String address;
    private String avatar;
}