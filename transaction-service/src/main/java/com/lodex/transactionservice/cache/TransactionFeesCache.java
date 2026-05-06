package com.lodex.transactionservice.cache;

import com.lodex.transactionservice.dao.TransactionConfigRepository;
import com.lodex.transactionservice.model.dto.FeeConfigDTO;
import com.lodex.transactionservice.model.entity.TransactionConfig;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionFeesCache {

    private final TransactionConfigRepository repository;

    public record Fees(
            BigDecimal fixedFee,
            BigDecimal percentageFee,
            BigDecimal maxTransferAmount
    ) {}

    private final AtomicReference<Fees> fees = new AtomicReference<>(
            new Fees(
                    new BigDecimal("0.50"),
                    new BigDecimal("1.25"),
                    new BigDecimal("10000.00")
            )
    );

    @PostConstruct
    public void init() {
        log.info("Checking database for initial transaction fees...");
        repository.findAll().stream().findFirst().ifPresentOrElse(
                dbConfig -> {
                    Fees initialFees = new Fees(
                            dbConfig.getFixedFee(),
                            dbConfig.getPercentageFee(),
                            dbConfig.getMaxTransferAmount()
                    );
                    fees.set(initialFees);
                    log.info("Loaded fees from database into cache: {}", initialFees);
                },
                () -> log.info("No fees found in DB, using default cache values: {}", fees.get())
        );
    }

    public Fees getFees() { return fees.get(); }
    public BigDecimal getFixedFee() { return fees.get().fixedFee(); }
    public BigDecimal getPercentageFee() { return fees.get().percentageFee(); }
    public BigDecimal getMaxTransferAmount() { return fees.get().maxTransferAmount(); }

    @Transactional
    public void updateConfig(FeeConfigDTO dto) {
        log.info("Received new config update request: {}", dto);

        // Update the Database
        TransactionConfig configEntity = repository.findAll().stream().findFirst()
                .orElse(new TransactionConfig());

        configEntity.setFixedFee(dto.getFixedFee());
        configEntity.setPercentageFee(dto.getPercentageFee());
        configEntity.setMaxTransferAmount(dto.getMaxTransferAmount());

        repository.save(configEntity);
        log.info("Database updated with new configuration!");

        // Update Cache
        Fees newFees = new Fees(
                dto.getFixedFee(),
                dto.getPercentageFee(),
                dto.getMaxTransferAmount()
        );
        fees.set(newFees);

        log.info("Local cache updated! {}", newFees);
    }
}