package com.core.notificationservice.repository;

import java.util.List;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {

	List<Notification> findAllByUserId(Long userId);
	
	List<Notification> findAllByUserIdAndStatus(Long userId, NotificationStatus status);
}
