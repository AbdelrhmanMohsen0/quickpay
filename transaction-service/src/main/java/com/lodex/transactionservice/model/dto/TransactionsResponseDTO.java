package com.lodex.transactionservice.model.dto;

import com.lodex.transactionservice.model.entity.TransactionStatus;
import com.lodex.transactionservice.model.entity.TransactionTransferType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionsResponseDTO {
    private UUID id;
    private BigDecimal amount;
    private TransactionStatus status;
    private TransactionTransferType type;
    private TransactionUserDTO userInfo;
    private String rejectionReason;
    private LocalDateTime timestamp;
}
