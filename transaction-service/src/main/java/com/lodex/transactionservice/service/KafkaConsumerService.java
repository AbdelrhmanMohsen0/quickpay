package com.lodex.transactionservice.service;

import com.lodex.transactionservice.model.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "transaction-topic", groupId = "transaction-group")
    public void listen(String transactionStr) {
        Transaction transaction = objectMapper.readValue(transactionStr, Transaction.class);

        System.out.println("Processing Transaction ID: " + transaction.getId());
        System.out.println("Amount: " + transaction.getAmount());
    }
}