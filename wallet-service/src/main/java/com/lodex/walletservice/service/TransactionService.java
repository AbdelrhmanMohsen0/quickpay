package com.lodex.walletservice.service;

import com.lodex.walletservice.model.entity.Transaction;
import com.lodex.walletservice.repository.TransactionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepo transactionRepo;

    public void createTransaction(Transaction transaction) {
        // might the Idempotency key duplicated -> handle exception later
        transactionRepo.save(transaction);
    }
}
