package com.lodex.transactionservice.service;

import com.lodex.transactionservice.cache.TransactionFeesCache;
import com.lodex.transactionservice.dao.TransactionDAO;
import com.lodex.transactionservice.dao.UserDAO;
import com.lodex.transactionservice.exception.DuplicateTransactionException;
import com.lodex.transactionservice.exception.MaxTransferAmountExceeded;
import com.lodex.transactionservice.exception.UserNotFoundException;
import com.lodex.transactionservice.mapper.TransactionMapper;
import com.lodex.transactionservice.model.dto.TransactionsResponseDTO;
import com.lodex.transactionservice.model.dto.TransferRequestDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.TransactionStatus;
import com.lodex.transactionservice.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionDAO transactionDAO;
    private final UserDAO userDAO;
    private final TransactionMapper transactionMapper;
    private final KafkaProducerService kafkaProducerService;
    private final TransactionFeesCache transactionFeesCache;

    public List<TransactionsResponseDTO> getTransactionsByUserId(String userId) {
        List<Transaction> transactions = transactionDAO.findUserTransactionsByStatus(userId, TransactionStatus.SUCCESS);
        List<TransactionsResponseDTO> dto = transactionMapper.toTransactionsResponseDTO(transactions, userId);
        System.out.println("getTransactionsByUserId: " + transactions);

        return dto;
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

        // Add fees on the transfer amount
        BigDecimal totalAmount = calculateFee(dto);

        // Create new pending transaction
        Transaction newTransaction = transactionMapper.toEntity(dto, idempotencyKey);
        newTransaction.setReceiverId(String.valueOf(receiver.getId()));
        newTransaction.setStatus(TransactionStatus.PENDING);
        newTransaction.setAmount(totalAmount);

        // Save to database
        Transaction insertedTransaction = transactionDAO.save(newTransaction);

        // Publish to Kafka Topic for Wallet-Service
        kafkaProducerService.produceTransactionCreatedEvent(insertedTransaction);

        return insertedTransaction;
    }

    private BigDecimal calculateFee(TransferRequestDTO dto) {
        // Take a single atomic snapshot of the fee config
        TransactionFeesCache.Fees fees = transactionFeesCache.getFees();

        BigDecimal amount = dto.getAmount();

        // Check transfer amount against system limit
        if (amount.compareTo(fees.maxTransferAmount()) > 0) {
            throw new MaxTransferAmountExceeded(
                    String.format("Max transfer amount exceeded. Max allowed: %s, attempted: %s",
                            fees.maxTransferAmount(), amount)
            );
        }

        // Calculate the fee:  fee = fixedFee + (amount * percentageFee / 100)
        BigDecimal percentagePart = amount
                .multiply(fees.percentageFee())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal totalFee = fees.fixedFee()
                .add(percentagePart)
                .setScale(2, RoundingMode.HALF_UP);

        return amount.add(totalFee);
    }

    public Transaction updateTransaction(Transaction processedTransaction) {
        Transaction existingTransaction = transactionDAO.findById(processedTransaction.getId());
        existingTransaction.setStatus(processedTransaction.getStatus());
        existingTransaction.setRejectionReason(processedTransaction.getRejectionReason());

        return transactionDAO.save(existingTransaction);
    }
}
