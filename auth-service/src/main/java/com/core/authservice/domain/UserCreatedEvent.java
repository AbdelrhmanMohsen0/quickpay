package com.core.authservice.domain;

import lombok.Builder;

import java.util.UUID;

@Builder
public record UserCreatedEvent(
        UUID id,
        String phoneNumber,
        String firstName,
        String lastName
) {
}
