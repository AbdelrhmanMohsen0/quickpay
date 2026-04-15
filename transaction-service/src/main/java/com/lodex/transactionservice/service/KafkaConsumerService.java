package com.lodex.transactionservice.service;

import com.lodex.transactionservice.dao.TransactionDAO;
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
    private final TransactionService transactionService;
    private final KafkaProducerService kafkaProducerService;
    private final UserDAO userDAO;
    private final String groupId = "transaction-group";

    @KafkaListener(topics = "wallet.transaction.processed", groupId = groupId)
    public void listenWalletTransactionProcessed(String transactionStr) {
        Transaction processedTransaction = objectMapper.readValue(transactionStr, Transaction.class);
        Transaction updatedTransaction = transactionService.updateTransaction(processedTransaction);
        kafkaProducerService.produceTransactionNotificationEvent(updatedTransaction);
    }

    @KafkaListener(topics = "user.created", groupId = groupId)
    public void listenUserCreated(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        User saveUser = userDAO.save(user);
        System.out.println("NEW SAVED USER ID: " + saveUser.getId());
    }

    @KafkaListener(topics = "user.updated", groupId = groupId)
    public void listenUserUpdated(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        User saveUser = userDAO.save(user);
        System.out.println("UPDATED USER ID: " + saveUser.getId());
    }

}