package com.lodex.walletservice.mapper;

import com.lodex.walletservice.model.dto.ReceivedTransactionDTO;
import com.lodex.walletservice.model.dto.TransactionEventDTO;
import com.lodex.walletservice.model.entity.Transaction;
import org.springframework.stereotype.Service;

@Service
public class TransactionMapper implements ITransactionMapper {

    @Override
    public Transaction toEntity(ReceivedTransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setId(dto.getId());
        transaction.setIdempotencyKey(dto.getIdempotencyKey());

        return transaction;
    }

    @Override
    public TransactionEventDTO toResponseDto(Transaction entity) {
        return null;
    }

    public TransactionEventDTO toTransactionEventDTO(ReceivedTransactionDTO receivedDto) {
        if (receivedDto == null) {
            return null;
        }

        TransactionEventDTO eventDto = new TransactionEventDTO();

        eventDto.setId(receivedDto.getId());
        eventDto.setAmount(receivedDto.getAmount());
        eventDto.setIdempotencyKey(receivedDto.getIdempotencyKey());
        eventDto.setReceiverId(receivedDto.getReceiverId());
        eventDto.setSenderId(receivedDto.getSenderId());
        eventDto.setStatus(receivedDto.getStatus());
        eventDto.setTimestamp(receivedDto.getTimestamp());
        eventDto.setRejectionReason(receivedDto.getRejectionReason());

        return eventDto;
    }
}