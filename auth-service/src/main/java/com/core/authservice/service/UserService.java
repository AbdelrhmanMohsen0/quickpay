package com.core.authservice.service;

import com.core.authservice.exception.UserNotFoundException;
import com.core.authservice.domain.User;
import com.core.authservice.domain.UserCreatedEvent;
import com.core.authservice.domain.UserRole;
import com.core.authservice.dto.ChangePasswordRequest;
import com.core.authservice.dto.SignupRequest;
import com.core.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final KafkaProducerService kafkaProducerService;

    public void createNewUser(SignupRequest signupRequest) {
        User user = userRepository.save(User.builder()
                .phoneNumber(signupRequest.phoneNumber())
                .role(UserRole.ROLE_USER)
                .password(passwordEncoder.encode(signupRequest.password()))
                .build());
        kafkaProducerService.produceUserCreatedEvent(UserCreatedEvent.builder()
                .id(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .firstName(signupRequest.firstName())
                .lastName(signupRequest.lastName())
                .build()
        );
    }

    @Transactional
    public void changePassword(String subject, ChangePasswordRequest request) {
        User user = userRepository.findById(UUID.fromString(subject)).orElseThrow(() -> new UserNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
    }
}
