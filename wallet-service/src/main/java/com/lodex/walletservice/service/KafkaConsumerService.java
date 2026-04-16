package com.lodex.walletservice.service;

import com.lodex.walletservice.exception.NotEnoughFundException;
import com.lodex.walletservice.exception.WalletNotFoundException;
import com.lodex.walletservice.model.dto.TransactionEventDTO;
import com.lodex.walletservice.model.entity.TransactionStatus;
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
    private final KafkaProducerService  kafkaProducerService;

    @KafkaListener(topics = "transaction.created", groupId = "wallet-service-group")
    public void transactionCreatedListen(String transactionStr) {
        System.out.println("Received transaction created: " + transactionStr);
        TransactionEventDTO dto = objectMapper.readValue(transactionStr, TransactionEventDTO.class);

        try {
            walletService.transfer(dto);
            dto.setStatus(String.valueOf(TransactionStatus.SUCCESS));
        } catch (Exception e) {
            dto.setStatus(String.valueOf(TransactionStatus.REJECTED));
            dto.setRejectionReason(e.getMessage());
            System.err.println(e.getMessage());
        } finally {
            kafkaProducerService.produceTransactionProcessedEvent(dto);
        }

        System.out.println("DONE: " + dto);
    }

    @KafkaListener(topics = "user.created", groupId = "wallet-service-group")
    public void userCreatedListen(String userStr) {
        JsonNode root = objectMapper.readTree(userStr);
        String idString = root.get("id").asText();
        UUID userId = UUID.fromString(idString);

        UUID walletID = walletService.createWallet(userId);

        System.out.println("Created Wallet ID: " + walletID);
    }

}