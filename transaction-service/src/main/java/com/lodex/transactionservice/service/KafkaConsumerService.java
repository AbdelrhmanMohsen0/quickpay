package com.lodex.transactionservice.service;

import com.lodex.transactionservice.dao.UserDAO;
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
    private final UserDAO userDAO;
    private final String groupId = "transaction-group";

    @KafkaListener(topics = "transaction.created", groupId = groupId)
    public void transactionCreatedListen(String transactionStr) {
        Transaction transaction = objectMapper.readValue(transactionStr, Transaction.class);

        System.out.println("Processing Transaction ID: " + transaction.getId());
        System.out.println("Amount: " + transaction.getAmount());
    }

    @KafkaListener(topics = "wallet.transaction.processed", groupId = groupId)
    public void walletTransactionProcessedListen(String transactionStr) {
        Transaction transaction = objectMapper.readValue(transactionStr, Transaction.class);
        transaction.setStatus(TransactionStatus.SUCCESS);

        System.out.println("PROCESSED Transaction ID: " + transaction.getId());
        System.out.println("Amount: " + transaction.getAmount());
    }

    @KafkaListener(topics = "user.created", groupId = groupId)
    public void userCreatedListen(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        User saveUser = userDAO.save(user);
        System.out.println("NEW SAVED USER ID: " + saveUser.getId());
    }

    @KafkaListener(topics = "user.updated", groupId = groupId)
    public void userUpdatedListen(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        User saveUser = userDAO.save(user);
        System.out.println("UPDATED USER ID: " + saveUser.getId());
    }

}