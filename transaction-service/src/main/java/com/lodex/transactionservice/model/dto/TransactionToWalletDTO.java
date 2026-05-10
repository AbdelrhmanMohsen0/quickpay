package com.lodex.transactionservice.model.dto;

import com.lodex.transactionservice.model.entity.TransactionStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionToWalletDTO {

    private UUID id;
    private String senderId;
    private String receiverId;
    private String idempotencyKey;

    private BigDecimal amount;
    private TransactionStatus status;
    private LocalDateTime timestamp;
    private String rejectionReason;

    private BigDecimal fixedFees;
    private BigDecimal feePercentage;
}