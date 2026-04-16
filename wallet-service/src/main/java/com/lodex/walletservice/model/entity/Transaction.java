package com.lodex.walletservice.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class Transaction {

    @Id
    private UUID id;

    @Column(unique = true, nullable = false)
    private String idempotencyKey;

}