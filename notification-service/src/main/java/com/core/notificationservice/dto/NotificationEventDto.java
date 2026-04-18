package com.core.notificationservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEventDto {
	
	@JsonProperty("notificationId")
	private UUID notificationId;
	
	@JsonProperty("receiverId")
	private UUID receiverId;
	
	@JsonProperty("type")
	private String notificationType;
	
	@JsonProperty("title")
	private String title;
	
	@JsonProperty("message")
	private String message;
	
	@JsonProperty("status")
	private String status;
	
	@JsonProperty("createdAt")
	private LocalDateTime createdAt;
	
	@JsonProperty("isRead")
	private Boolean isRead;
	
	@JsonProperty("metadata")
	private Object metadata;
}

