package com.lodex.walletservice.mapper;

import com.lodex.walletservice.model.dto.ReceivedTransactionDTO;
import com.lodex.walletservice.model.dto.TransactionEventDTO;
import com.lodex.walletservice.model.entity.Transaction;

public interface ITransactionMapper {
    Transaction toEntity(ReceivedTransactionDTO dto);
    TransactionEventDTO toResponseDto(Transaction entity);
    TransactionEventDTO toTransactionEventDTO(ReceivedTransactionDTO receivedDto);
}
