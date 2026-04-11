package com.core.authservice.dto;

import com.core.authservice.util.UniquePhoneNumber;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public record SignupRequest(

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = "^(010|011|012|015)\\d{8}$",
                message = "Phone number must start with 010, 011, 012, or 015 and has 11 digits"
        )
        @UniquePhoneNumber
        String phoneNumber,

        @NotBlank(message = "First name is required")
        @Length(max = 50, message = "First name is too long")
        @Pattern(
                regexp = "^[\\p{L}\\h]+$",
                message = "First Name must contain only letters and cannot include numbers or special characters"
        )
        String firstName,

        @NotBlank(message = "Last name is required")
        @Length(max = 50, message = "Last name is too long")
        @Pattern(
                regexp = "^[\\p{L}\\h]+$",
                message = "Last name must contain only letters and cannot include numbers or special characters"
        )
        String lastName,

        @NotBlank(message = "Password is required")
        @Length(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
        String password

) {
}
