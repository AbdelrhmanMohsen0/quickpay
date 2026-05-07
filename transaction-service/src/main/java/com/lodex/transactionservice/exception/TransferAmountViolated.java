package com.lodex.transactionservice.exception;

public class TransferAmountViolated extends RuntimeException {
    public TransferAmountViolated(String message) {
        super(message);
    }
}
