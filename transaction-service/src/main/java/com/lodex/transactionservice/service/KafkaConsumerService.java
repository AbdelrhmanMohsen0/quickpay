package com.lodex.transactionservice.service;

import com.lodex.transactionservice.dao.UserDAO;
import com.lodex.transactionservice.model.dto.NotificationDTO;
import com.lodex.transactionservice.model.entity.Transaction;
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
    private final NotificationService notificationService;
    private final KafkaProducerService kafkaProducerService;
    private final UserDAO userDAO;
    private final String groupId = "transaction-group";

    @KafkaListener(topics = "wallet.transaction.processed", groupId = groupId)
    public void listenWalletTransactionProcessed(String transactionStr) {
        Transaction processedTransaction = objectMapper.readValue(transactionStr, Transaction.class);
        Transaction updatedTransaction = transactionService.updateTransaction(processedTransaction);
        NotificationDTO notification = notificationService.createNotification(updatedTransaction);
        kafkaProducerService.produceTransactionNotificationEvent(notification);
    }

    @KafkaListener(topics = "user.created", groupId = groupId)
    public void listenUserCreated(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        userDAO.save(user);
    }

    @KafkaListener(topics = "user.updated", groupId = groupId)
    public void listenUserUpdated(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        User saveUser = userDAO.save(user);
        System.out.println("UPDATED USER ID: " + saveUser.getId());
    }

}