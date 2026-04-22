package com.lodex.transactionservice.service;

import com.lodex.transactionservice.dao.UserDAO;
import com.lodex.transactionservice.mapper.TransactionMapper;
import com.lodex.transactionservice.model.dto.NotificationDTO;
import com.lodex.transactionservice.model.entity.Transaction;
import com.lodex.transactionservice.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final UserDAO userDAO;
    private final TransactionMapper transactionMapper;

    public NotificationDTO createNotification(Transaction transaction) {
        User sender = userDAO.findById(UUID.fromString(transaction.getSenderId()))
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userDAO.findById(UUID.fromString(transaction.getReceiverId()))
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        String senderFullName = sender.getFirstName() + " " + sender.getLastName();
        String receiverFullName = receiver.getFirstName() + " " + receiver.getLastName();

        return transactionMapper.toNotificationDto(transaction, senderFullName, receiverFullName);
    }
}
