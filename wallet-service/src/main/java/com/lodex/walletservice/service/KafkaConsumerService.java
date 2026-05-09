package com.lodex.walletservice.service;

import com.lodex.walletservice.exception.NotEnoughFundException;
import com.lodex.walletservice.exception.WalletNotFoundException;
import com.lodex.walletservice.mapper.TransactionMapper;
import com.lodex.walletservice.model.dto.ReceivedTransactionDTO;
import com.lodex.walletservice.model.dto.TransactionEventDTO;
import com.lodex.walletservice.model.entity.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;
    private final WalletService  walletService;
    private final KafkaProducerService  kafkaProducerService;
    private final TransactionMapper transactionMapper;

    @KafkaListener(topics = "transaction.created", groupId = "wallet-service-group")
    public void transactionCreatedListen(String transactionStr) {
        System.out.println("Received transaction created: " + transactionStr);
        ReceivedTransactionDTO dto = objectMapper.readValue(transactionStr, ReceivedTransactionDTO.class);
        log.info("Received transaction created: " + dto);
        try {
            walletService.transfer(dto);
            dto.setStatus(String.valueOf(TransactionStatus.SUCCESS));
        } catch (Exception e) {
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            dto.setStatus(String.valueOf(TransactionStatus.REJECTED));
            dto.setRejectionReason(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
            System.err.println(e.getMessage());
        } finally {
            TransactionEventDTO eventDto = transactionMapper.toTransactionEventDTO(dto);
            log.info("SEND TO Transaction : " + eventDto);
            log.info("SEND TO Transaction : " + eventDto);
            log.info("SEND TO Transaction : " + eventDto);
            log.info("SEND TO Transaction : " + eventDto);
            log.info("SEND TO Transaction : " + eventDto);
            kafkaProducerService.produceTransactionProcessedEvent(eventDto);
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