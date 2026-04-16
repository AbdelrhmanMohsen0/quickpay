package com.core.notificationservice.service;

import com.core.notificationservice.dto.TransactionCreatedEvent;
import com.core.notificationservice.dto.UserCreatedEvent;
import com.core.notificationservice.handler.TransactionCreatedHandler;
import com.core.notificationservice.handler.UserCreatedHandler;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaNotificationListener {
	
	private final UserCreatedHandler userHandler;
	private final TransactionCreatedHandler transactionHandler;
	private final NotificationService notificationService;
	private final ObjectMapper objectMapper;
	
	@KafkaListener(topics = "transaction.notification", groupId = "notification-group")
	public void handleTransaction(String message) {
		TransactionCreatedEvent transaction = objectMapper.readValue(message, TransactionCreatedEvent.class);
		
		var notifications = transactionHandler.handle(transaction);
		
		notifications.forEach(notificationService::save);
	}
	
	@KafkaListener(topics = "user.created", groupId = "notification-group")
	public void handleUserCreated(String message) throws Exception {
		UserCreatedEvent createdUser = objectMapper.readValue(message, UserCreatedEvent.class);
		
		var notification = userHandler.handle(createdUser);
		notificationService.save(notification);
	}
}
