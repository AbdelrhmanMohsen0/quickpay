package com.lodex.walletservice.repository;

import com.lodex.walletservice.model.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WalletRepo extends JpaRepository<Wallet, UUID> {
    Wallet findByUserId(UUID userId);
}
