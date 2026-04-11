package com.core.authservice.service;

import com.core.authservice.domain.User;
import com.core.authservice.domain.UserCreatedEvent;
import com.core.authservice.domain.UserRole;
import com.core.authservice.dto.SignupRequest;
import com.core.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
}
