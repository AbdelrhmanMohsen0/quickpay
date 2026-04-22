package com.lodex.transactionservice.mapper;

import com.lodex.transactionservice.dao.UserDAO;
import com.lodex.transactionservice.model.dto.*;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.TransactionTransferType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionMapper implements ITransactionMapper{

    private final UserDAO userDAO;

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

    public List<TransactionsResponseDTO> toTransactionsResponseDTO(List<Transaction> transactions, String loggedInUserId) {
        return transactions.stream().map(transaction -> {
            TransactionsResponseDTO dto = new TransactionsResponseDTO();

            dto.setId(transaction.getId());
            dto.setAmount(transaction.getAmount());
            dto.setStatus(transaction.getStatus());
            dto.setTimestamp(transaction.getTimestamp());
            dto.setRejectionReason(transaction.getRejectionReason());

            // Sender or Receiver based on jwt sub sent by api gateway
            boolean isSender = transaction.getSenderId().equals(loggedInUserId);
            dto.setType(isSender ? TransactionTransferType.SENT : TransactionTransferType.RECEIVED);

            // Get target user id
            String targetUserIdStr = isSender ? transaction.getReceiverId() : transaction.getSenderId();

            // Fetch the target user
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
        }).collect(Collectors.toList());
    }}
