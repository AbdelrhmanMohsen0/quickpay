package com.core.authservice.controller;

import com.core.authservice.dto.LoginRequest;
import com.core.authservice.dto.AuthResponse;
import com.core.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authService.authenticate(
                loginRequest.phoneNumber(),
                loginRequest.password()
        );
        String tokenValue = authService.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(tokenValue));
    }
}
