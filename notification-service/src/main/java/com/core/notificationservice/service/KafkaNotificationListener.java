package com.core.notificationservice.service;

import com.core.notificationservice.dto.TransactionCreatedEvent;
import com.core.notificationservice.dto.UserCreatedEvent;
import com.core.notificationservice.handler.TransactionCreatedHandler;
import com.core.notificationservice.handler.UserCreatedHandler;
import com.core.notificationservice.model.Notification;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaNotificationListener {
	
	private final UserCreatedHandler userHandler;
	private final TransactionCreatedHandler transactionHandler;
	private final NotificationService notificationService;
	private final WebSocketNotificationService webSocketNotificationService;
	private final ObjectMapper objectMapper;
	
	@KafkaListener(topics = "transaction.notification", groupId = "notification-group")
	public void handleTransaction(String message) {
		TransactionCreatedEvent transaction = objectMapper.readValue(message, TransactionCreatedEvent.class);
		
		var notifications = transactionHandler.handle(transaction);
		
		notifications.forEach(notification -> {
			notificationService.save(notification);
			sendNotificationViaWebSocket(notification);
		});
	}
	
	@KafkaListener(topics = "user.created", groupId = "notification-group")
	public void handleUserCreated(String message) throws Exception {
		UserCreatedEvent createdUser = objectMapper.readValue(message, UserCreatedEvent.class);
		
		var notification = userHandler.handle(createdUser);
		notificationService.save(notification);
		// Send real-time update via WebSocket
		sendNotificationViaWebSocket(notification);
	}
	
	/**
	 * Send Notification via WebSocket
	 */
	private void sendNotificationViaWebSocket(Notification notification) {
		try {
			webSocketNotificationService.sendNotificationToUser(notification.getReceiverId(), notification);
		} catch (Exception e) {
			log.error("Error sending notification via WebSocket: {}", e.getMessage());
		}
	}
}
