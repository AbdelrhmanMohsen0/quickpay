package com.lodex.walletservice.repository;

import com.lodex.walletservice.model.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, UUID> {
}
