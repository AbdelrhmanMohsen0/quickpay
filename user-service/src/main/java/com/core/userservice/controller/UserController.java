package com.core.userservice.controller;

import com.core.userservice.domain.UserRole;
import com.core.userservice.dto.UserDTO;
import com.core.userservice.dto.UserNameUpdateRequest;
import com.core.userservice.dto.UserStatusUpdateRequest;
import com.core.userservice.exception.UserForbiddenException;
import com.core.userservice.exception.UserUnauthorizedException;
import com.core.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id,
                                           @RequestHeader("X-User-Id") UUID headerId) {
        if (!id.equals(headerId)) {
            throw new UserUnauthorizedException("Unauthorized");
        }

        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @PatchMapping("/{id}/name")
    public ResponseEntity<UserDTO> updateUserName(@PathVariable UUID id,
                                                  @RequestHeader("X-User-Id") UUID headerId,
                                                  @Valid @RequestBody UserNameUpdateRequest userNameUpdateRequest) {
        if (!id.equals(headerId)) {
            throw new UserUnauthorizedException("Unauthorized");
        }

        return new ResponseEntity<>(userService.updateUserName(id, userNameUpdateRequest), HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserDTO> updateUserStatus(@PathVariable UUID id,
                                                    @RequestHeader("X-User-Role") UserRole userRole,
                                                    @Valid @RequestBody UserStatusUpdateRequest userStatusUpdateRequest) {
        if (!userRole.equals(UserRole.ROLE_ADMIN)) {
            throw new UserForbiddenException("You are not allowed to perform this operation");
        }

        return new ResponseEntity<>(userService.updateUserStatus(id, userStatusUpdateRequest), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers(@RequestParam String keyword,
                                                  @RequestHeader("X-User-Role") UserRole userRole) {
        if (!userRole.equals(UserRole.ROLE_ADMIN)) {
            throw new UserForbiddenException("You are not allowed to perform this operation");
        }
        return new ResponseEntity<>(userService.getUsersByKeyword(keyword, UserService.USERS_SEARCH_RESULTS_LIMIT), HttpStatus.OK);
    }
}
