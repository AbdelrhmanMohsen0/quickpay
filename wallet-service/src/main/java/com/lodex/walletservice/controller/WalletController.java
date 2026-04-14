package com.lodex.walletservice.controller;

import com.lodex.walletservice.model.dto.WalletDTO;
import com.lodex.walletservice.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/balance")
@RequiredArgsConstructor
public class WalletController {

    private WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletDTO> getBalance(@RequestHeader("X-User-Id") UUID userId) {
        WalletDTO wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }

}