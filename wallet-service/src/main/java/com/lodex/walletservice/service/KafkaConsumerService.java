package com.lodex.walletservice.service;

import com.lodex.walletservice.exception.NotEnoughFundException;
import com.lodex.walletservice.exception.WalletNotFoundException;
import com.lodex.walletservice.model.dto.TransactionEventDTO;
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
    private final WalletService  walletService;

    @KafkaListener(topics = "transaction.created", groupId = "wallet-service-group")
    public void transactionCreatedListen(String transactionStr) {
        System.out.println("Received transaction created: " + transactionStr);
        try {
            TransactionEventDTO dto = objectMapper.readValue(transactionStr, TransactionEventDTO.class);
            walletService.transfer(dto);
        } catch (WalletNotFoundException | NotEnoughFundException e) {
            System.err.println(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @KafkaListener(topics = "user.created", groupId = "wallet-service-group")
    public void userCreatedListen(String userStr) {
//        System.out.println(userStr);
//        // get user id
        JsonNode root = objectMapper.readTree(userStr);
        String idString = root.get("id").asText();
        UUID userId = UUID.fromString(idString);

        UUID walletID = walletService.createWallet(userId);

        System.out.println("Created Wallet ID: " + walletID);
    }

}