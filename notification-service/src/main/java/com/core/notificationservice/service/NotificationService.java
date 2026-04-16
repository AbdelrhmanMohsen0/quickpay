package com.core.notificationservice.service;

import java.util.List;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.model.Notification;
import com.core.notificationservice.repository.NotificationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
	
	private final NotificationRepo notificationRepo;

	public Notification findById(long id) {
		return notificationRepo.findById(id).orElseThrow(()
				-> new RuntimeException("Notification not found"));
	}
	
	public List<Notification> findAll() {
		return notificationRepo.findAll();
	}
	
	public List<Notification> findAllByUserId(long userId) {
		return notificationRepo.findAllByReceiverId(userId);
	}
	
	public List<Notification> findAllByUserIdAndStatus(long userId, NotificationStatus status) {
		return notificationRepo.findAllByReceiverIdAndStatus(userId, status);
	}
	
	public Notification save(Notification notification) {
		return notificationRepo.save(notification);
	}
}
