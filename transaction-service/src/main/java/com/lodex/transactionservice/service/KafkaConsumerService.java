package com.lodex.transactionservice.service;

import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.TransactionStatus;
import com.lodex.transactionservice.model.entity.User;
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
        Transaction transaction = objectMapper.readValue(transactionStr, Transaction.class);

        System.out.println("Processing Transaction ID: " + transaction.getId());
        System.out.println("Amount: " + transaction.getAmount());
    }

    @KafkaListener(topics = "wallet.transaction.processed", groupId = "wallet.transaction.group")
    public void walletTransactionProcessedListen(String transactionStr) {
        Transaction transaction = objectMapper.readValue(transactionStr, Transaction.class);
        transaction.setStatus(TransactionStatus.SUCCESS);

        System.out.println("PROCESSED Transaction ID: " + transaction.getId());
        System.out.println("Amount: " + transaction.getAmount());
    }

    @KafkaListener(topics = "user.created", groupId = "user.created.group")
    public void userCreatedListen(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        System.out.println("NEW USER ID: " + user.getId());

        // I'll insert the user into 'users' table (now waiting for user-service to test this listener)
    }

}