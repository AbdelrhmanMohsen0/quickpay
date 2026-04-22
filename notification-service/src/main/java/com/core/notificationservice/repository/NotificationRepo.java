package com.core.notificationservice.repository;

import java.util.List;
import java.util.UUID;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NotificationRepo extends JpaRepository<Notification, UUID> {

	List<Notification> findAllByReceiverId(UUID receiverId);
	
	List<Notification> findAllByReceiverIdAndStatusEquals(UUID receiverId, NotificationStatus status);
}
