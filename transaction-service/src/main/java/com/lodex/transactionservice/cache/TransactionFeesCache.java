package com.lodex.transactionservice.cache;

import com.lodex.transactionservice.model.dto.FeeConfigDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
public class TransactionFeesCache {

    // Immutable snapshot
    public record Fees(
            BigDecimal fixedFee,
            BigDecimal percentageFee,
            BigDecimal maxTransferAmount
    ) {}

    // Default values
    private final AtomicReference<Fees> fees = new AtomicReference<>(
            new Fees(
                    new BigDecimal("0.50"),
                    new BigDecimal("1.25"),
                    new BigDecimal("10000.00")
            )
    );

    public Fees getFees() {
        return fees.get();
    }

    public BigDecimal getFixedFee() {
        return fees.get().fixedFee();
    }

    public BigDecimal getPercentageFee() {
        return fees.get().percentageFee();
    }

    public BigDecimal getMaxTransferAmount() {
        return fees.get().maxTransferAmount();
    }

    public void updateConfig(FeeConfigDTO dto) {
        Fees newFees = new Fees(
                dto.getFixedFee(),
                dto.getPercentageFee(),
                dto.getMaxTransferAmount()
        );
        fees.set(newFees);

        log.info("Local cache updated! {}", newFees);
    }
}