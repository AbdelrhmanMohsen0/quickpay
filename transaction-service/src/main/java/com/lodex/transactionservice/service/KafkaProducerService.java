package com.lodex.transactionservice.service;

import com.lodex.transactionservice.model.dto.NotificationDTO;
import com.lodex.transactionservice.model.dto.TransactionToWalletDTO;
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

    public void produceTransactionCreatedEvent(TransactionToWalletDTO transaction) {
        String event = objectMapper.writeValueAsString(transaction);

        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);
        System.out.println("[TRANSACTION CREATED]" + event);

        kafkaTemplate.send("transaction.created", event);
    }
    public void produceTransactionNotificationEvent(NotificationDTO notification) {
        String event = objectMapper.writeValueAsString(notification);
        kafkaTemplate.send("transaction.notification", event);
    }
}