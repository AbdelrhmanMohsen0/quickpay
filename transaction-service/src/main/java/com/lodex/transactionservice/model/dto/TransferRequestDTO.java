package com.lodex.transactionservice.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequestDTO {

    @NotBlank(message = "Sender ID is required")
    private String senderId;

    @NotBlank(message = "Receiver phone number is required")
    @Pattern(regexp = "^01\\d{9}$", message = "Invalid phone number")
    private String receiverPhoneNumber;

    @NotNull(message = "Amount is required")
    @Positive(message = "Transfer amount must be greater than zero")
    private BigDecimal amount;

}