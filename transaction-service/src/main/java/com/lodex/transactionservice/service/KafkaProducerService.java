package com.lodex.transactionservice.service;

import com.lodex.transactionservice.model.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void produceTransactionCreatedEvent(Transaction transaction) {
        String event = objectMapper.writeValueAsString(transaction);
        kafkaTemplate.send("transaction.created", event);
    }
    public void produceTransactionNotificationEvent(Transaction transaction) {
        String event = objectMapper.writeValueAsString(transaction);
        kafkaTemplate.send("transaction.notification", event);
    }
}