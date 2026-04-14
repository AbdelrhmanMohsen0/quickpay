package com.core.userservice.service;

import com.core.userservice.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void produceUserUpdatedEvent(UserDTO updatedUser) {
        String event = objectMapper.writeValueAsString(updatedUser);
        kafkaTemplate.send("user.updated", event);
    }
}
