package com.core.notificationservice.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationWebSocketHandler extends TextWebSocketHandler {

	private final ObjectMapper objectMapper;
	
	// Map to store active connections by userId
	private final Map<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		String userId = (String) session.getAttributes().get("userId");
		
		if (userId != null && !userId.isEmpty()) {
			userSessions.computeIfAbsent(userId, k -> Collections.newSetFromMap(new ConcurrentHashMap<>()))
					.add(session);
			log.info("WebSocket connection established for user: {}", userId);
			
			// Send connection confirmation message
			Map<String, Object> message = new HashMap<>();
			message.put("type", "CONNECTED");
			message.put("message", "Connected to notification service");
			session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
		} else {
			log.warn("No userId found in session attributes, closing connection");
			session.close();
		}
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String userId = (String) session.getAttributes().get("userId");
		log.debug("Received message from user {}: {}", userId, message.getPayload());
		
		// You can handle incoming messages from clients here
		// For example, acknowledge receipt or handle specific commands
		Map<String, Object> response = new HashMap<>();
		response.put("type", "ACKNOWLEDGED");
		response.put("message", "Message received");
		session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		String userId = (String) session.getAttributes().get("userId");
		log.error("WebSocket error for user {}: {}", userId, exception.getMessage());
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		String userId = (String) session.getAttributes().get("userId");
		
		if (userId != null) {
			Set<WebSocketSession> sessions = userSessions.get(userId);
			if (sessions != null) {
				sessions.remove(session);
				if (sessions.isEmpty()) {
					userSessions.remove(userId);
				}
			}
			log.info("WebSocket connection closed for user: {}", userId);
		}
	}

	/**
	 * Send a notification to a specific user via WebSocket
	 * @param userId The recipient user ID
	 * @param notificationMessage The notification message object
	 */
	public void sendNotificationToUser(String userId, Object notificationMessage) {
		Set<WebSocketSession> sessions = userSessions.get(userId);
		
		if (sessions != null && !sessions.isEmpty()) {
			try {
				String messagePayload = objectMapper.writeValueAsString(notificationMessage);
				TextMessage textMessage = new TextMessage(messagePayload);
				
				for (WebSocketSession session : sessions) {
					if (session.isOpen()) {
						session.sendMessage(textMessage);
						log.debug("Notification sent to user: {}", userId);
					}
				}
			} catch (IOException e) {
				log.error("Error sending notification to user {}: {}", userId, e.getMessage());
			}
		} else {
			log.debug("No active WebSocket sessions for user: {}", userId);
		}
	}

	/**
	 * Broadcast a notification to all connected users
	 * @param notificationMessage The notification message object
	 */
	public void broadcastNotification(Object notificationMessage) {
		try {
			String messagePayload = objectMapper.writeValueAsString(notificationMessage);
			TextMessage textMessage = new TextMessage(messagePayload);
			
			for (Set<WebSocketSession> sessions : userSessions.values()) {
				for (WebSocketSession session : sessions) {
					if (session.isOpen()) {
						session.sendMessage(textMessage);
					}
				}
			}
			log.debug("Notification broadcasted to all connected users");
		} catch (IOException e) {
			log.error("Error broadcasting notification: {}", e.getMessage());
		}
	}

	/**
	 * Get the number of active connections for a user
	 * @param userId The user ID
	 * @return Number of active WebSocket connections
	 */
	public int getActiveConnectionCount(String userId) {
		Set<WebSocketSession> sessions = userSessions.get(userId);
		return sessions != null ? sessions.size() : 0;
	}
}

