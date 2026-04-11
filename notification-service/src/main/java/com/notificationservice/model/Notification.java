package com.notificationservice.model;

import java.time.Instant;
import java.util.UUID;
import com.notificationservice.domain.NotificationStatus;
import com.notificationservice.domain.NotificationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@Entity
@Table(name="notifications")
@RequiredArgsConstructor
@AllArgsConstructor
public class Notification {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@NotNull
	private UUID userId;
	
	@NotNull
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private NotificationType type;
	
	@NotNull
	@Column(nullable = false)
	private String title;
	
	@NotNull
	@Column(nullable = false)
	private String message;
	
	@NotNull
	@Column(nullable = false)
	private NotificationStatus status = NotificationStatus.UNREAD;
	
	//Note: Instant is used instead of LocalDateTime for timezone-safe cross-service behavior.
	@NotNull
	@Column(nullable = false)
	private Instant createdAt =  Instant.now();
	
	@NotNull
	@Column(nullable = false)
	private Instant updatedAt =  Instant.now();

	private Instant readAt;
}
