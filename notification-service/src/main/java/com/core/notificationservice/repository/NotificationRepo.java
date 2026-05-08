package com.core.notificationservice.repository;

import java.util.UUID;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NotificationRepo extends JpaRepository<Notification, UUID> {

	Page<Notification> findAllByReceiverId(Pageable pageable, UUID receiverId);

	long countByReceiverIdAndStatus(UUID receiverId, NotificationStatus status);

}
