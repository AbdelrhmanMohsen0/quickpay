package com.core.authservice.controller;

import com.core.authservice.dto.ChangePasswordRequest;
import com.core.authservice.dto.LoginRequest;
import com.core.authservice.dto.AuthResponse;
import com.core.authservice.dto.SignupRequest;
import com.core.authservice.security.SecurityUser;
import com.core.authservice.service.AuthService;
import com.core.authservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping
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

    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal Jwt currentUser) {

        userService.changePassword(currentUser.getSubject(), request);
        return ResponseEntity.noContent().build();
    }
}
