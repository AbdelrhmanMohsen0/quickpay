package com.lodex.transactionservice.controller;

import com.lodex.transactionservice.mapper.TransactionMapper;
import com.lodex.transactionservice.model.dto.TransferRequestDTO;
import com.lodex.transactionservice.model.dto.TransferResponseDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransferResponseDTO>> getTransactionsByUserId(@PathVariable String userId) {
        List<TransferResponseDTO> transactions = transactionService.getTransactionsByUserId(userId);

        if (transactions.isEmpty()) {
            return ResponseEntity.noContent().build(); // Returns 204 if they have no history
        }

        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<TransferResponseDTO> createTransaction(@Valid @RequestBody TransferRequestDTO transferRequestDTO, @Valid @RequestHeader("Idempotency-Key") String idempotencyKey) {
        Transaction newTransaction = transactionService.createTransaction(transferRequestDTO, idempotencyKey);
        return ResponseEntity.ok(transactionMapper.toResponseDto(newTransaction));
    }
}