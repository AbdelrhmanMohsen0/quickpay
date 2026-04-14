package com.core.authservice.service;

import com.core.authservice.domain.UserCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void produceUserCreatedEvent(UserCreatedEvent userCreatedEvent) {
        String event = objectMapper.writeValueAsString(userCreatedEvent);
        kafkaTemplate.send("user.created", event);
    }
}
