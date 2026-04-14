package com.lodex.walletservice.service;

import com.lodex.walletservice.model.dto.WalletDTO;
import com.lodex.walletservice.repository.TransactionRepo;
import com.lodex.walletservice.repository.WalletRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepo transactionDAO;
    private final TransactionRepo transactionRepo;
    private final KafkaProducerService kafkaProducerService;


    public WalletDTO getWalletByUserId(UUID userId) {

        return new WalletDTO();
    }
}
