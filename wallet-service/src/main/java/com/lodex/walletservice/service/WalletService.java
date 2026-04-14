package com.lodex.walletservice.service;

import com.lodex.walletservice.exception.WalletNotFound;
import com.lodex.walletservice.mapper.WalletMapper;
import com.lodex.walletservice.model.dto.WalletResponseDTO;
import com.lodex.walletservice.model.entity.Wallet;
import com.lodex.walletservice.repository.TransactionRepo;
import com.lodex.walletservice.repository.WalletRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepo walletRepo;
    private final WalletMapper walletMapper;
    private final TransactionRepo transactionRepo;
    private final KafkaProducerService kafkaProducerService;


    public WalletResponseDTO getWalletByUserId(UUID userId) {
        Wallet userWallet = walletRepo.findByUserId(userId);

        if(userWallet == null){
            throw new WalletNotFound("Wallet is under creation, try again later.");
        }

        return walletMapper.toDTO(userWallet);
    }

    public UUID createWallet(UUID userID) {
        Wallet newWallet = new Wallet();
        newWallet.setUserId(userID);
        Wallet savedWallet = walletRepo.save(newWallet);

        return savedWallet.getId();
    }
}
