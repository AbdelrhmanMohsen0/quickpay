package com.core.userservice.service;

import com.core.userservice.domain.User;
import com.core.userservice.domain.UserStatus;
import com.core.userservice.dto.UserCreatedEvent;
import com.core.userservice.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaListenerService {

    private final ObjectMapper objectMapper;
    private final UserService userService;

    @KafkaListener(
            topics = "user.created",
            groupId = "groupId"
    )
    public void listener(String data) {
        UserCreatedEvent createdUser = objectMapper.readValue(data, UserCreatedEvent.class);
        userService.saveUser(User.builder()
                .id(createdUser.id())
                .phoneNumber(createdUser.phoneNumber())
                .firstName(createdUser.firstName())
                .lastName(createdUser.lastName())
                .status(UserStatus.ACTIVE)
                .build());
    }

    @KafkaListener(
            topics = "user.updated",
            groupId = "groupId"
    )
    public void testListener(String data) {
        UserDTO createdUser = objectMapper.readValue(data, UserDTO.class);
        System.out.println(createdUser.firstName() +  " " + createdUser.lastName() + createdUser.status());
    }
}
