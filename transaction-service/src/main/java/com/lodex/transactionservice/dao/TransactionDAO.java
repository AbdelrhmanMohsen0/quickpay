package com.lodex.transactionservice.dao;

import com.lodex.transactionservice.model.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionDAO extends JpaRepository<Transaction, Integer> {
    boolean existsByIdempotencyKey(String idempotencyKey);
    List<Transaction> findBySenderId(String senderId);

    Transaction findById(UUID id);
}
