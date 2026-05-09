package com.lodex.transactionservice.service;

import com.lodex.transactionservice.cache.TransactionFeesCache;
import com.lodex.transactionservice.dao.UserDAO;
import com.lodex.transactionservice.mapper.TransactionMapper;
import com.lodex.transactionservice.model.dto.FeeConfigDTO;
import com.lodex.transactionservice.model.dto.NotificationDTO;
import com.lodex.transactionservice.model.dto.TransactionToWalletDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.User;
import com.lodex.transactionservice.model.entity.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;
    private final TransactionMapper transactionMapper;
    private final TransactionService transactionService;
    private final NotificationService notificationService;
    private final KafkaProducerService kafkaProducerService;
    private final UserDAO userDAO;
    private final String groupId = "transaction-group";

    @KafkaListener(topics = "wallet.transaction.processed", groupId = groupId)
    public void listenWalletTransactionProcessed(String transactionStr) {
        TransactionToWalletDTO processedTransactionDto = objectMapper.readValue(transactionStr, TransactionToWalletDTO.class);
        Transaction processedTransaction = transactionMapper.toEntity(processedTransactionDto);
        Transaction updatedTransaction = transactionService.updateTransaction(processedTransaction);
        NotificationDTO notification = notificationService.createNotification(updatedTransaction);
        kafkaProducerService.produceTransactionNotificationEvent(notification);
    }

    @KafkaListener(topics = "user.created", groupId = groupId)
    public void listenUserCreated(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        user.setStatus(UserStatus.ACTIVE);
        userDAO.save(user);
    }

    @KafkaListener(topics = "user.updated", groupId = groupId)
    public void listenUserUpdated(String userStr) {
        User user = objectMapper.readValue(userStr, User.class);
        User saveUser = userDAO.save(user);
        System.out.println("UPDATED USER ID: " + saveUser.getId());
    }

}