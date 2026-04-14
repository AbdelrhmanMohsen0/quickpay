package com.lodex.walletservice.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionEventDTO {
    private BigDecimal amount;
    private UUID id;
    private String idempotencyKey;
    private UUID receiverId;
    private UUID senderId;
    private String status;
    private LocalDateTime timestamp;
    private String rejectedReason;
}
