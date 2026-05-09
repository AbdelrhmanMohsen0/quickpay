package com.lodex.transactionservice.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    private static final String COLOR_RESET = "\u001B[0m";
    private static final String COLOR_GREEN = "\u001B[32m";  // Good for Success
    private static final String COLOR_CYAN = "\u001B[36m";   // Good for Info/Network
    private static final String COLOR_YELLOW = "\u001B[33m"; // Good for Warning/Pending

    @After("execution(* com.lodex.transactionservice.service.NotificationService.createNotification(..))")
    public void logAfterNotification() {
        log.info(COLOR_GREEN + "Notification Sent" + COLOR_RESET);
    }

    @Before("execution(* com.lodex.transactionservice.controller.TransactionController.createTransaction(..))")
    public void logIncomingPaymentRequest() {
        log.info(COLOR_CYAN + "incoming payment request" + COLOR_RESET);
    }

    @After("execution(* com.lodex.transactionservice.service.TransactionService.createTransaction(..))")
    public void logTransactionCreated() {
        log.info(COLOR_YELLOW + "Transaction created with PENDING status" + COLOR_RESET);
    }
}