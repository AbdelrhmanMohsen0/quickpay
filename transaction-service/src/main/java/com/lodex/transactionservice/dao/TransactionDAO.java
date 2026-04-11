package com.lodex.transactionservice.dao;

import com.lodex.transactionservice.model.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionDAO extends JpaRepository<Transaction, Integer> {
    boolean existsByIdempotencyKey(String idempotencyKey);
    List<Transaction> findBySenderId(String senderId);
}
