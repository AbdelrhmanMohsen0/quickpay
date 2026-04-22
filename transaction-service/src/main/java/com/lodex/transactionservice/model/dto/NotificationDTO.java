package com.lodex.transactionservice.model.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class NotificationDTO {
    private UUID transactionId;
    private UUID senderId;
    private UUID receiverId;
    private String senderName;
    private String receiverName;
    private Double amount;
    private String status;
    private String rejectionReason;
}
