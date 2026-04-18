package com.core.notificationservice.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
			WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
		
		// Extract the JWT token or user ID from the query parameters or headers
		String query = request.getURI().getQuery();
		if (query != null && query.contains("userId=")) {
			String userId = query.split("userId=")[1].split("&")[0];
			attributes.put("userId", userId);
		}
		
		// You can also extract from headers if needed
		String authHeader = request.getHeaders().getFirst("Authorization");
		if (authHeader != null) {
			attributes.put("authHeader", authHeader);
		}
		
		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
			WebSocketHandler wsHandler, Exception exception) {
		// Called after handshake is done
	}
}

