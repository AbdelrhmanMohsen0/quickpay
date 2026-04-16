package com.lodex.walletservice.service;

import com.lodex.walletservice.exception.WalletNotFoundException;
import com.lodex.walletservice.exception.NotEnoughFundException;
import com.lodex.walletservice.mapper.TransactionMapper;
import com.lodex.walletservice.mapper.WalletMapper;
import com.lodex.walletservice.model.dto.TransactionEventDTO;
import com.lodex.walletservice.model.dto.WalletResponseDTO;
import com.lodex.walletservice.model.entity.Transaction;
import com.lodex.walletservice.model.entity.Wallet;
import com.lodex.walletservice.repository.TransactionRepo;
import com.lodex.walletservice.repository.WalletRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepo walletRepo;
    private final WalletMapper walletMapper;
    private final TransactionMapper transactionMapper;
    private final TransactionService transactionService;
    private final KafkaProducerService kafkaProducerService;

    public WalletResponseDTO getWalletByUserId(UUID userId) {
        Wallet userWallet = walletRepo.findByUserId(userId);

        if(userWallet == null)
            throw new WalletNotFoundException("Wallet is under creation, try again later.");

        return walletMapper.toDTO(userWallet);
    }

    public UUID createWallet(UUID userID) {
        Wallet newWallet = new Wallet();
        newWallet.setUserId(userID);
        Wallet savedWallet = walletRepo.save(newWallet);

        return savedWallet.getId();
    }

    @Transactional
    public void transfer(TransactionEventDTO dto) {
        /*
        * Here I create a Transaction (id, idempotencyKey) to ensure that the transaction is processed only once
        * TransactionService will throw exception if there are duplicates
        * gg :)
        */
        Transaction newTransaction = transactionMapper.toEntity(dto);
        transactionService.createTransaction(newTransaction);


        // Get sender wallet
        Wallet senderWallet = walletRepo.findByUserId(dto.getSenderId());
        if(senderWallet == null)
            throw new WalletNotFoundException("Sender wallet not found");

        // Check if sender has enough money
        if (senderWallet.getBalance().compareTo(dto.getAmount()) < 0)
            throw new NotEnoughFundException("Sender does not have enough funds to complete the transfer.");

        // Get receiver wallet
        Wallet receiverWallet = walletRepo.findByUserId(dto.getReceiverId());
        if(receiverWallet == null)
            throw new WalletNotFoundException("Receiver wallet not found");

        // update balances
        senderWallet.setBalance(senderWallet.getBalance().subtract(dto.getAmount()));
        receiverWallet.setBalance(receiverWallet.getBalance().add(dto.getAmount()));

        // save to the database
        walletRepo.save(senderWallet);
        walletRepo.save(receiverWallet);

    }
}
