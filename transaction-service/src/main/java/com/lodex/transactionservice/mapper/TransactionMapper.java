package com.lodex.transactionservice.mapper;

import com.lodex.transactionservice.model.dto.TransferRequestDTO;
import com.lodex.transactionservice.model.dto.TransferResponseDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import org.springframework.stereotype.Service;

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
}
