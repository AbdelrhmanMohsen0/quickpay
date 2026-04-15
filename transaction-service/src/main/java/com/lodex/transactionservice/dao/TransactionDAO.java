package com.lodex.transactionservice.dao;

import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionDAO extends JpaRepository<Transaction, Integer> {
    boolean existsByIdempotencyKey(String idempotencyKey);
    @Query("SELECT t FROM Transaction t WHERE (t.senderId = :userId OR t.receiverId = :userId) AND t.status = :status")
    List<Transaction> findUserTransactionsByStatus(
            @Param("userId") String userId,
            @Param("status") TransactionStatus status
    );    Transaction findById(UUID id);
}
