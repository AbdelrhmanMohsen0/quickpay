package com.lodex.walletservice.service;

import com.lodex.walletservice.model.entity.Transaction;
import com.lodex.walletservice.repository.WalletRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;
    private final WalletRepo  walletRepo;
    private final WalletService  walletService;

    @KafkaListener(topics = "transaction.created", groupId = "transaction-group")
    public void transactionCreatedListen(String transactionStr) {
        // I'll save it to the DB later
        Transaction transaction = objectMapper.readValue(transactionStr, Transaction.class);
        System.out.println("Processing Transaction ID: " + transaction.getId());
    }

    @KafkaListener(topics = "user.created", groupId = "user.created.group")
    public void userCreatedListen(String userStr) {
        // get user id
        JsonNode root = objectMapper.readTree(userStr);
        String idString = root.get("id").asText();
        UUID userId = UUID.fromString(idString);

        UUID walletID = walletService.createWallet(userId);

        System.out.println("Created Wallet ID: " + walletID);
    }

}