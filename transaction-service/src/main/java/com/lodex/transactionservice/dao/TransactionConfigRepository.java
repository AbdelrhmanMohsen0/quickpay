package com.lodex.transactionservice.dao;

import com.lodex.transactionservice.model.entity.TransactionConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionConfigRepository extends JpaRepository<TransactionConfig, Integer> {
}