package com.core.notificationservice.service;

import java.util.UUID;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.exception.NotificationNotFoundException;
import com.core.notificationservice.model.Notification;
import com.core.notificationservice.repository.NotificationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
	
	private final NotificationRepo notificationRepo;
	
	public Page<Notification> findAllByReceiverId(UUID receiverId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
		return notificationRepo.findAllByReceiverId(pageable, receiverId);
	}

	public long countUnreadByUserId(UUID receiverId) {
		return notificationRepo.countByReceiverIdAndStatus(receiverId, NotificationStatus.UNREAD);
	}
	
	public void markAsRead(UUID id) {
		Notification notification = notificationRepo.findById(id)
				.orElseThrow(() -> new NotificationNotFoundException(id));
		notification.markAsRead();
		notificationRepo.save(notification);
	}
	
	
	public void save(Notification notification) {
		notificationRepo.save(notification);
	}
}
