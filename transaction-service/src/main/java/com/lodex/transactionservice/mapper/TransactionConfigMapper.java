package com.lodex.transactionservice.mapper;

import com.lodex.transactionservice.cache.TransactionFeesCache;
import com.lodex.transactionservice.model.dto.FeeConfigDTO;
import com.lodex.transactionservice.model.entity.TransactionConfig;
import org.springframework.stereotype.Component;

@Component
public class TransactionConfigMapper {

    public FeeConfigDTO toDto(TransactionFeesCache.Fees fees) {
        if (fees == null) return null;

        FeeConfigDTO dto = new FeeConfigDTO();
        dto.setFixedFee(fees.fixedFee());
        dto.setPercentageFee(fees.percentageFee());
        dto.setMaxTransferAmount(fees.maxTransferAmount());
        dto.setMinTransferAmount(fees.minTransferAmount());

        return dto;
    }

    public void updateEntityFromDto(FeeConfigDTO dto, TransactionConfig existingEntity) {
        if (dto == null || existingEntity == null) return;

        if (dto.getFixedFee() != null) {
            existingEntity.setFixedFee(dto.getFixedFee());
        }

        if (dto.getPercentageFee() != null) {
            existingEntity.setPercentageFee(dto.getPercentageFee());
        }

        if (dto.getMaxTransferAmount() != null) {
            existingEntity.setMaxTransferAmount(dto.getMaxTransferAmount());
        }

        if (dto.getMinTransferAmount() != null) {
            existingEntity.setMinTransferAmount(dto.getMinTransferAmount());
        }
    }
}