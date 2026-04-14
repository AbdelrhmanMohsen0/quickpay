package com.lodex.walletservice.mapper;

import com.lodex.walletservice.model.dto.WalletResponseDTO;
import com.lodex.walletservice.model.entity.Wallet;
import org.springframework.web.bind.annotation.Mapping;

public interface IWalletMapper {
    // Maps DTO -> Entity
    Wallet toEntity(WalletResponseDTO walletDTO);

    WalletResponseDTO toDTO(Wallet wallet);
}
