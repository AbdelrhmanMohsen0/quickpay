package com.lodex.walletservice.mapper;

import com.lodex.walletservice.model.dto.TransactionEventDTO;
import com.lodex.walletservice.model.entity.Transaction;

public interface ITransactionMapper {
    Transaction toEntity(TransactionEventDTO dto);
    TransactionEventDTO toResponseDto(Transaction entity);

}
