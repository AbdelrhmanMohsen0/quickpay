package com.lodex.transactionservice.mapper;

import com.lodex.transactionservice.model.dto.NotificationDTO;
import com.lodex.transactionservice.model.dto.TransferRequestDTO;
import com.lodex.transactionservice.model.dto.TransferResponseDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import org.springframework.stereotype.Service;

import javax.management.Notification;
import java.util.UUID;

@Service
public class TransactionMapper implements ITransactionMapper{

    @Override
    public Transaction toEntity(TransferRequestDTO dto, String idempotencyKey) {
        Transaction transaction = new Transaction();
        transaction.setSenderId(dto.getSenderId());
        transaction.setAmount(dto.getAmount());
        transaction.setIdempotencyKey(idempotencyKey);
////        transaction.setStatus(TransactionStatus.PENDING);

        return transaction;
    }

    @Override
    public TransferResponseDTO toResponseDto(Transaction entity) {
        TransferResponseDTO dto = new TransferResponseDTO();
        dto.setTransactionId(entity.getId());

        return dto;
    }

    public NotificationDTO toNotificationDto(Transaction transaction, String senderName, String receiverName) {
        NotificationDTO dto = new NotificationDTO();

        dto.setTransactionId(transaction.getId());
        dto.setRejectionReason(transaction.getRejectionReason());
        dto.setSenderName(senderName);
        dto.setReceiverName(receiverName);
        dto.setSenderId(UUID.fromString(transaction.getSenderId()));
        dto.setReceiverId(UUID.fromString(transaction.getReceiverId()));
        dto.setAmount(transaction.getAmount().doubleValue());
        dto.setStatus(transaction.getStatus().name());

        return dto;
    }
}
