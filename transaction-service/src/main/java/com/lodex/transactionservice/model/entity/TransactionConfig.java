package com.lodex.transactionservice.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name = "transaction_config")
public class TransactionConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private BigDecimal fixedFee;
    private BigDecimal percentageFee;
    private BigDecimal maxTransferAmount;
    private BigDecimal minTransferAmount;
}