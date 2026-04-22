package com.core.notificationservice.controller;

import java.util.List;import java.util.UUID;import com.core.notificationservice.domain.NotificationStatus;import com.core.notificationservice.model.Notification;import com.core.notificationservice.service.NotificationService;import lombok.RequiredArgsConstructor;import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;import org.springframework.web.bind.annotation.RequestParam;import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
@RequestMapping("")
public class NotificationController {
	
	private final NotificationService notificationService;
	
	@GetMapping("/")
	public List<Notification> findAllByReceiverId(@RequestHeader("X-User-Id") UUID receiverId){
		return notificationService.findAllByReceiverId(receiverId);
	}
	
	@GetMapping("/unread")
	public Long findAllByStatus(@RequestHeader("X-User-Id") UUID receiverId){
		return (long) notificationService.findAllByUserIdAndStatus(receiverId).size();
	}
	
	@PatchMapping("/mark-as-read")
	public void markAsRead(@RequestParam UUID notificationId){
		notificationService.markAsRead(notificationId);
	}
}
