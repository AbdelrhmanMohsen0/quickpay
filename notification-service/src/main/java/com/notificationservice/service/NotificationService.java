package com.notificationservice.service;

import java.util.List;import com.notificationservice.domain.NotificationStatus;import com.notificationservice.model.Notification;
import com.notificationservice.repository.NotificationRepo;import lombok.RequiredArgsConstructor;import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
	
	private final NotificationRepo notificationRepo;

	public Notification findById(long id) {
		return notificationRepo.findById(id).orElseThrow(()
				-> new RuntimeException("Notification not found"));
	}
	
	public List<Notification> findAllByUserId(long userId) {
		return notificationRepo.findAllByUserId(userId);
	}
	
	public List<Notification> findAllByUserIdAndStatus(long userId, NotificationStatus status) {
		return notificationRepo.findAllByUserIdAndStatus(userId, status);
	}
	
	public Notification save(Notification notification) {
		return notificationRepo.save(notification);
	}
}
