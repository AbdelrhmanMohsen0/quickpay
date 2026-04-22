package com.core.notificationservice.service;

import com.core.notificationservice.dto.NotificationEventDto;
import com.core.notificationservice.handler.NotificationWebSocketHandler;
import com.core.notificationservice.model.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

	private final NotificationWebSocketHandler webSocketHandler;

	/**
	 * Send a real-time notification to a specific user via WebSocket
	 * @param userId The recipient user ID
	 * @param notification The notification details
	 */
	public void sendNotificationToUser(UUID userId, Notification notification) {
		Map<String, Object> message = new HashMap<>();
		message.put("type", "NOTIFICATION");
		message.put("timestamp", Instant.now());
		message.put("payload", notification);
		
		webSocketHandler.sendNotificationToUser(userId.toString(), message);
		log.info("WebSocket notification sent to user: {}", userId);
	}

	/**
	 * Send a real-time notification to a specific user via WebSocket with custom message type
	 * @param userId The recipient user ID
	 * @param messageType Custom message type (e.g., "TRANSACTION_UPDATE", "PAYMENT_SUCCESS")
	 * @param payload The notification payload
	 */
	public void sendCustomNotificationToUser(UUID userId, String messageType, Object payload) {
		Map<String, Object> message = new HashMap<>();
		message.put("type", messageType);
		message.put("timestamp", LocalDateTime.now());
		message.put("payload", payload);
		
		webSocketHandler.sendNotificationToUser(userId.toString(), message);
		log.info("WebSocket notification (type: {}) sent to user: {}", messageType, userId);
	}

	/**
	 * Broadcast a notification to all connected users
	 * @param notificationEventDto The notification details
	 */
	public void broadcastNotification(NotificationEventDto notificationEventDto) {
		Map<String, Object> message = new HashMap<>();
		message.put("type", "BROADCAST_NOTIFICATION");
		message.put("timestamp", LocalDateTime.now());
		message.put("payload", notificationEventDto);
		
		webSocketHandler.broadcastNotification(message);
		log.info("Notification broadcasted to all connected users");
	}

	/**
	 * Send a system message to a specific user
	 * @param userId The recipient user ID
	 * @param messageTitle Title of the system message
	 * @param messageContent Content of the system message
	 */
	public void sendSystemMessage(UUID userId, String messageTitle, String messageContent) {
		Map<String, Object> message = new HashMap<>();
		message.put("type", "SYSTEM_MESSAGE");
		message.put("timestamp", LocalDateTime.now());
		Map<String, String> payload = new HashMap<>();
		payload.put("title", messageTitle);
		payload.put("content", messageContent);
		message.put("payload", payload);
		
		webSocketHandler.sendNotificationToUser(userId.toString(), message);
		log.info("System message sent to user: {}", userId);
	}

	/**
	 * Check if a user has active WebSocket connections
	 * @param userId The user ID
	 * @return true if user has at least one active connection, false otherwise
	 */
	public boolean isUserConnected(UUID userId) {
		return webSocketHandler.getActiveConnectionCount(userId.toString()) > 0;
	}
}

