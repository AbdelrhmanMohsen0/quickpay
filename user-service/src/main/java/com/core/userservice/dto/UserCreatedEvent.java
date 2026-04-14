package com.core.userservice.dto;

import java.util.UUID;

public record UserCreatedEvent(
        UUID id,
        String phoneNumber,
        String firstName,
        String lastName
) {
}
