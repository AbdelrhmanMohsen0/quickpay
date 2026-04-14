package com.lodex.walletservice.exception;

public class NotEnoughFundException extends RuntimeException {
    public NotEnoughFundException(String message) {
        super(message);
    }
}
