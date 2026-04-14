package com.lodex.walletservice.controller;

import com.lodex.walletservice.model.dto.WalletResponseDTO;
import com.lodex.walletservice.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/balance")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletResponseDTO> getBalance(@RequestHeader("X-User-Id") UUID userId) {
        WalletResponseDTO wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }

}