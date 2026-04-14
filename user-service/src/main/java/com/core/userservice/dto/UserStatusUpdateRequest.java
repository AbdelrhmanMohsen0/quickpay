package com.core.userservice.dto;

import com.core.userservice.domain.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UserStatusUpdateRequest(@NotNull(message = "User status is required") UserStatus userStatus) {
}
