package com.core.authservice.controller;

import com.core.authservice.dto.LoginRequest;
import com.core.authservice.dto.AuthResponse;
import com.core.authservice.dto.SignupRequest;
import com.core.authservice.security.SecurityUser;
import com.core.authservice.service.AuthService;
import com.core.authservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        SecurityUser securityUser = authService.authenticate(
                loginRequest.phoneNumber(),
                loginRequest.password()
        );
        String tokenValue = authService.generateToken(securityUser);
        return ResponseEntity.ok(new AuthResponse(tokenValue));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        userService.createNewUser(signupRequest);
        return login(new LoginRequest(signupRequest.phoneNumber(), signupRequest.password()));
    }

}
