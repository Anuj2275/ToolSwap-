package com.toolswap.toolswap.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotEmpty(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s'-]+$", message = "Name can only contain letters, numbers, spaces, hyphens, and apostrophes")
    private String name;

    @Email(message = "Email should be valid")
    @NotEmpty(message = "Email is required")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@.+\\.edu\\.in$", message = "Email must be a valid .edu.in address")
    private String email;

    @NotEmpty(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,}$",
            message = "Password must be at least 8 characters and contain one uppercase, one lowercase, one digit, and one special character."
    )
    private String password;
}