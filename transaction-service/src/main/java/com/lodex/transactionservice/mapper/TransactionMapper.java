package com.lodex.transactionservice.mapper;

import com.lodex.transactionservice.dao.UserDAO;
import com.lodex.transactionservice.model.dto.*;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.TransactionTransferType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionMapper implements ITransactionMapper {

    private final UserDAO userDAO;

    @Override
    public Transaction toEntity(TransferRequestDTO dto, String idempotencyKey) {
        Transaction transaction = new Transaction();
        transaction.setSenderId(dto.getSenderId());
        transaction.setAmount(dto.getAmount());
        transaction.setIdempotencyKey(idempotencyKey);
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
        dto.setReceiverName(receiverName);
        dto.setSenderId(UUID.fromString(transaction.getSenderId()));
        dto.setReceiverId(UUID.fromString(transaction.getReceiverId()));
        dto.setAmount(transaction.getAmount().doubleValue());
        dto.setStatus(transaction.getStatus().name());

        String reason = transaction.getRejectionReason();
        dto.setRejectionReason(reason != null ? reason : "");        dto.setSenderName(senderName);
        return dto;
    }

    public TransactionsResponseDTO toTransactionsResponseDTO(Transaction transaction, String loggedInUserId) {
        TransactionsResponseDTO dto = new TransactionsResponseDTO();

        dto.setId(transaction.getId());
        dto.setStatus(transaction.getStatus());
        dto.setTimestamp(transaction.getTimestamp());
        dto.setRejectionReason(transaction.getRejectionReason());

        boolean isSender = transaction.getSenderId().equals(loggedInUserId);
        dto.setType(isSender ? TransactionTransferType.SENT : TransactionTransferType.RECEIVED);

        if (isSender) {
            // The sender sees the total amount that was deducted from their wallet
            dto.setAmount(transaction.getAmount());
        } else {
            // The receiver sees the total amount MINUS the fee
            // Null check included just in case older database records have a null fee
            BigDecimal fee = transaction.getFee() != null ? transaction.getFee() : BigDecimal.ZERO;
            dto.setAmount(transaction.getAmount().subtract(fee));
        }

        String targetUserIdStr = isSender ? transaction.getReceiverId() : transaction.getSenderId();

        if (targetUserIdStr != null) {
            UUID targetUserId = UUID.fromString(targetUserIdStr);
            userDAO.findById(targetUserId).ifPresent(otherUser -> {
                TransactionUserDTO userDTO = new TransactionUserDTO();
                userDTO.setId(otherUser.getId().toString());
                userDTO.setFirstName(otherUser.getFirstName());
                userDTO.setLastName(otherUser.getLastName());
                userDTO.setPhoneNumber(otherUser.getPhoneNumber());
                dto.setUserInfo(userDTO);
            });
        }

        return dto;
    }

    public TransactionToWalletDTO toTransactionToWalletDTO(Transaction transaction, BigDecimal fixedFees, BigDecimal feePercentage) {
        if (transaction == null) {
            return null;
        }

        TransactionToWalletDTO dto = new TransactionToWalletDTO();
        dto.setId(transaction.getId());
        dto.setSenderId(transaction.getSenderId());
        dto.setReceiverId(transaction.getReceiverId());
        dto.setIdempotencyKey(transaction.getIdempotencyKey());
        dto.setAmount(transaction.getAmount());
        dto.setStatus(transaction.getStatus());
        dto.setTimestamp(transaction.getTimestamp());
        dto.setFixedFees(fixedFees);
        dto.setFeePercentage(feePercentage);

        return dto;
    }

    public Transaction toEntity(TransactionToWalletDTO dto) {
        if (dto == null) {
            return null;
        }

        Transaction transaction = new Transaction();

        transaction.setId(dto.getId());
        transaction.setSenderId(dto.getSenderId());
        transaction.setReceiverId(dto.getReceiverId());
        transaction.setIdempotencyKey(dto.getIdempotencyKey());
        transaction.setAmount(dto.getAmount());
        transaction.setStatus(dto.getStatus());
        transaction.setTimestamp(dto.getTimestamp());
        return transaction;
    }
}