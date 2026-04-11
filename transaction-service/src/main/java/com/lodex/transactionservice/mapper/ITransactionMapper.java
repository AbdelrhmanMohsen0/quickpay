package com.lodex.transactionservice.mapper;

import com.lodex.transactionservice.model.dto.TransferRequestDTO;
import com.lodex.transactionservice.model.dto.TransferResponseDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ITransactionMapper {

    // Maps DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "timestamp", ignore = true)
    @Mapping(target = "idempotencyKey", source = "idempotencyKey")
    Transaction toEntity(TransferRequestDTO dto, String idempotencyKey);

    // Maps Entity -> Response DTO
    @Mapping(target = "transactionId", source = "id")
    TransferResponseDTO toResponseDto(Transaction entity);
}