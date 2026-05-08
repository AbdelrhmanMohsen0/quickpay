package com.core.notificationservice.controller;

import java.util.UUID;

import com.core.notificationservice.model.Notification;
import com.core.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
@RequestMapping("")
public class NotificationController {
	
	private final NotificationService notificationService;
	
	@GetMapping("/")
	public ResponseEntity<PagedModel<Notification>> findAllByReceiverId(@RequestHeader("X-User-Id") UUID receiverId,
	                                                                    @RequestParam(defaultValue = "0") int page,
	                                                                    @RequestParam(defaultValue = "10") int size){
		Page<Notification> notifications = notificationService.findAllByReceiverId(receiverId, page, size);
		return ResponseEntity.ok(new PagedModel<>(notifications));
	}

	@GetMapping("/unread")
	public Long getUnreadCount(@RequestHeader("X-User-Id") UUID receiverId) {
		return notificationService.countUnreadByUserId(receiverId);
	}
	
	@PatchMapping("/mark-as-read")
	public void markAsRead(@RequestParam UUID notificationId){
		notificationService.markAsRead(notificationId);
	}
}
