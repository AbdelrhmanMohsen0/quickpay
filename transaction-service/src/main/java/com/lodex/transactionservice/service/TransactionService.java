package com.lodex.transactionservice.service;

import com.lodex.transactionservice.dao.TransactionDAO;
import com.lodex.transactionservice.dao.UserDAO;
import com.lodex.transactionservice.exception.DuplicateTransactionException;
import com.lodex.transactionservice.exception.UserNotFoundException;
import com.lodex.transactionservice.mapper.TransactionMapper;
import com.lodex.transactionservice.model.dto.TransferRequestDTO;
import com.lodex.transactionservice.model.dto.TransferResponseDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.TransactionStatus;
import com.lodex.transactionservice.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionDAO transactionDAO;
    private final UserDAO userDAO;
    private final TransactionMapper transactionMapper;
    private final KafkaProducerService kafkaProducerService;

    public List<Transaction> getAllTransactions() {
        return transactionDAO.findAll();
    }


    public List<TransferResponseDTO> getTransactionsByUserId(String userId) {
        List<Transaction> transactions = transactionDAO.findBySenderId(userId);

        return transactions.stream()
                .map(transactionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public Transaction createTransaction(TransferRequestDTO dto, String idempotencyKey) {
        // First Check if transaction is processed
        // I'll use Redis here to check for the idempotency key cus faster
        if (transactionDAO.existsByIdempotencyKey(idempotencyKey)) {
            throw new DuplicateTransactionException("Transaction with key " + idempotencyKey + " already processed.");
        }

        // Get the receiver of the provided phone number
        User receiver = userDAO.findByPhoneNumber(dto.getReceiverPhoneNumber());
        if(receiver == null) throw new UserNotFoundException("No user with such phone number");

        // Insert Pending transaction
        Transaction newTransaction = transactionMapper.toEntity(dto, idempotencyKey);
        newTransaction.setReceiverId(String.valueOf(receiver.getId()));
        newTransaction.setStatus(TransactionStatus.PENDING);

        // Save to database
        Transaction insertedTransaction = transactionDAO.save(newTransaction);

        // Publish to Kafka Topic for Wallet-Service
        kafkaProducerService.produceTransactionCreatedEvenet(insertedTransaction);

        return insertedTransaction;
    }
}
