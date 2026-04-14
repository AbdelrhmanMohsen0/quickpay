package com.core.notificationservice.model;

import java.time.Instant;
import java.util.UUID;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.domain.NotificationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@Entity
@Table(name="notifications")
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@NotNull
	private UUID senderId;
	
	@NotNull
	private UUID receiverId;
	
	@NotNull
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private NotificationType type;
	
	@NotNull
	@Column(nullable = false)
	private String title;
	
	@NotNull
	@Column(nullable = false)
	private String shortMessage;
	
	@NotNull
	@Column(nullable = false)
	private String message;
	
	@NotNull
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private NotificationStatus status = NotificationStatus.UNREAD;
	
	@Column(columnDefinition = "TEXT")
	private String metadata;
	
	// Note: Instant is used instead of LocalDateTime for timezone-safe cross-service behavior.
	@NotNull
	@Column(nullable = false)
	private Instant createdAt =  Instant.now();
	
	@NotNull
	@Column(nullable = false)
	private Instant updatedAt =  Instant.now();

	private Instant readAt;
	
	public void markAsRead() {
		this.status = NotificationStatus.READ;
		this.readAt = Instant.now();
	}
	
	@PrePersist
	public void prePersist() {
		Instant now = Instant.now();
		this.createdAt = now;
		this.updatedAt = now;
	}
	
	@PreUpdate
	public void preUpdate() {
		this.updatedAt = Instant.now();
	}
}
