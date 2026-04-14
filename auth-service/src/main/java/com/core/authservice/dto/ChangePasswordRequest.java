package com.core.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record ChangePasswordRequest(
        @NotBlank(message = "Current password is required")
        String oldPassword,

        @NotBlank(message = "New password is required")
        @Length(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
        String newPassword
) {}