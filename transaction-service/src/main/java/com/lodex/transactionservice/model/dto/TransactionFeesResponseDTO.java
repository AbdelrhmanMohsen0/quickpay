package com.lodex.transactionservice.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class TransactionFeesResponseDTO {
    private BigDecimal fixedFee;
    BigDecimal percentageFee;
}