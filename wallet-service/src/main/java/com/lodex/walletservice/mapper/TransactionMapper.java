package com.lodex.walletservice.mapper;

import com.lodex.walletservice.model.dto.TransactionEventDTO;
import com.lodex.walletservice.model.entity.Transaction;
import org.springframework.stereotype.Service;

@Service
public class TransactionMapper implements ITransactionMapper {

    @Override
    public Transaction toEntity(TransactionEventDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setId(dto.getId());
        transaction.setIdempotencyKey(dto.getIdempotencyKey());

        return transaction;
    }

    @Override
    public TransactionEventDTO toResponseDto(Transaction entity) {
        return null;
    }
}