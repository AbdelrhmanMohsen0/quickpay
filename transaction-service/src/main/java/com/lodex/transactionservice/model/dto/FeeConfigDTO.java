package com.lodex.transactionservice.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FeeConfigDTO {

    private BigDecimal fixedFee;
    private BigDecimal percentageFee;
    private BigDecimal maxTransferAmount;

}
