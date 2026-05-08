package com.lodex.transactionservice.controller;
import com.lodex.transactionservice.model.dto.*;
import com.lodex.transactionservice.model.entity.UserRole;
import org.springframework.data.domain.Page;
import com.lodex.transactionservice.mapper.TransactionMapper;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;

    @GetMapping
    public ResponseEntity<Page<TransactionsResponseDTO>> getTransactionsByUserId(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        System.out.println("getTransactionsByUserId: " + userId);

        Page<TransactionsResponseDTO> transactions =
                transactionService.getTransactionsByUserId(userId, page, size);

        if (!transactions.hasContent()) {
            return ResponseEntity.noContent().build(); // 204 if no transactions
        }

        return ResponseEntity.ok(transactions);
    }


    @PostMapping
    public ResponseEntity<TransferResponseDTO> createTransaction(@Valid @RequestBody TransferRequestDTO dto, @Valid @RequestHeader("X-User-Id") String userId, @Valid @RequestHeader("Idempotency-Key") String idempotencyKey) {
        dto.setSenderId(userId);
        Transaction newTransaction = transactionService.createTransaction(dto, idempotencyKey);
        return ResponseEntity.ok(transactionMapper.toResponseDto(newTransaction));
    }

    @GetMapping("/fees")
    public ResponseEntity<TransactionFeesResponseDTO> getTransactionFees() {
        TransactionFeesResponseDTO fees = transactionService.getTransactionFees();
        return ResponseEntity.ok(fees);
    }

    @GetMapping("/fees/config")
    public ResponseEntity<FeeConfigDTO> getSystemFeeConfig() {
        FeeConfigDTO config = transactionService.getFullTransactionConfig();
        return ResponseEntity.ok(config);
    }

    @PatchMapping("/fees/config")
    public ResponseEntity<FeeConfigDTO> updateSystemFeeConfig(
            @Valid @RequestBody FeeConfigDTO configDto,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        if (userRole == null || !userRole.equalsIgnoreCase(String.valueOf(UserRole.ROLE_ADMIN))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required to update fees.");
        }

        FeeConfigDTO updatedConfig = transactionService.updateTransactionConfig(configDto);
        return ResponseEntity.ok(updatedConfig);
    }
}