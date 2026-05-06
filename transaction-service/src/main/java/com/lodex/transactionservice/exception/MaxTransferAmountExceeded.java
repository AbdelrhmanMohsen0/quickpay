package com.lodex.transactionservice.exception;

public class MaxTransferAmountExceeded extends RuntimeException {
    public MaxTransferAmountExceeded(String message) {
        super(message);
    }
}
