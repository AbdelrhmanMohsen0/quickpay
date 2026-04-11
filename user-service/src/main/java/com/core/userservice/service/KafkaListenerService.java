package com.core.userservice.service;

import com.core.userservice.domain.User;
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

    @KafkaListener(
            topics = "user.created",
            groupId = "groupId"
    )
    public void listener(String data) {
        User createdUser = objectMapper.readValue(data, User.class);
    }
}
