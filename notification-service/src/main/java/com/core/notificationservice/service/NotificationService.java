package com.core.notificationservice.service;

import java.util.List;import java.util.UUID;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.model.Notification;
import com.core.notificationservice.repository.NotificationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
	
	// todo: check idempotencyKey for duplicate notifications
	
	private final NotificationRepo notificationRepo;

	public Notification findById(UUID id) {
		return notificationRepo.findById(id).orElseThrow(()
				-> new RuntimeException("Notification not found"));
	}
	
	public List<Notification> findAll() {
		return notificationRepo.findAll();
	}
	
	public List<Notification> findAllByReceiverId(UUID receiverId) {
		return notificationRepo.findAllByReceiverId(receiverId);
	}
	
	public List<Notification> findAllByUserIdAndStatus(UUID receiverId) {
		return notificationRepo.findAllByReceiverIdAndStatusEquals(receiverId, NotificationStatus.UNREAD);
	}
	
	public void markAsRead(UUID id) {
		Notification notification = notificationRepo.findById(id).orElseThrow(()
				-> new RuntimeException("Notification not found"));
		notification.setStatus(NotificationStatus.READ);
		notificationRepo.save(notification);
	}
	
	
	public void save(Notification notification) {
		notificationRepo.save(notification);
	}
}
