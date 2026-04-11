package com.lodex.transactionservice.model.dto;
import lombok.Data;

import java.util.UUID;

@Data
public class TransferResponseDTO {
    private UUID transactionId;
}
