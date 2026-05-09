package com.lodex.walletservice.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class WalletLoggingAspect {

    // ANSI escape codes
    private static final String COLOR_RESET = "\u001B[0m";
    private static final String COLOR_BLUE = "\u001B[34m";
    private static final String COLOR_GREEN = "\u001B[32m";

    // --- Transaction Event Logs ---

    @Before("execution(* com.lodex.walletservice.service.KafkaConsumerService.transactionCreatedListen(..))")
    public void logIncomingTransactionEvent() {
        log.info(COLOR_BLUE + "Received Event [Transaction Created] via Kafka" + COLOR_RESET);
    }

    @After("execution(* com.lodex.walletservice.service.KafkaConsumerService.transactionCreatedListen(..))")
    public void logFinishedTransactionEvent() {
        log.info(COLOR_GREEN + "Kafka Event Processed: [Transaction Complete]" + COLOR_RESET);
    }

}