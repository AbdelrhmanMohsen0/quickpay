package com.core.userservice.dto;

import com.core.userservice.domain.UserStatus;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UserDTO(
        UUID id,
        String phoneNumber,
        String firstName,
        String lastName,
        UserStatus status
) {
}
