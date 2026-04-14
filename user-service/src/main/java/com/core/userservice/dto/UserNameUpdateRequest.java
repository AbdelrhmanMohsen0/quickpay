package com.core.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record UserNameUpdateRequest(
        @NotBlank(message = "First name is required")
        @Length(max = 50, message = "First name is too long")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Length(max = 50, message = "Last name is too long")
        String lastName
) {
}
