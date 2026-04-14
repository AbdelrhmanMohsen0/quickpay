package com.lodex.walletservice.service;

import com.lodex.walletservice.model.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "transaction.created", groupId = "transaction-group")
    public void transactionCreatedListen(String transactionStr) {
        // I'll save it to the DB later
        Transaction transaction = objectMapper.readValue(transactionStr, Transaction.class);
        System.out.println("Processing Transaction ID: " + transaction.getId());
    }

    @KafkaListener(topics = "user.created", groupId = "user.created.group")
    public void userCreatedListen(String userStr) {

    }

}