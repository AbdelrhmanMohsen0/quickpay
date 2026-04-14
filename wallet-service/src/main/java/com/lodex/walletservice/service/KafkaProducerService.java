package com.lodex.walletservice.service;

import com.lodex.walletservice.model.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void produceTransactionProcessedEvent(Transaction transaction) {
        String event = objectMapper.writeValueAsString(transaction);
        kafkaTemplate.send("wallet.transaction.processed", event);
    }
}