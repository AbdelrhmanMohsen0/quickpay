package com.core.notificationservice.controller;

import java.util.List;import java.util.UUID;import com.core.notificationservice.domain.NotificationStatus;import com.core.notificationservice.model.Notification;import com.core.notificationservice.service.NotificationService;import lombok.RequiredArgsConstructor;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.RequestMapping;import org.springframework.web.bind.annotation.RequestParam;import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {
	
	//todo: add user-id verification for security
	private final NotificationService notificationService;
	
	@GetMapping("/test")
	public void test(){
		System.out.println("Notification Service is working!");
	}
	
	@GetMapping("/")
	public List<Notification> findAll(){
		return notificationService.findAll();
	}
	
	@GetMapping("/")
	public Notification findById(@RequestParam UUID id){
		return notificationService.findById(id);
	}
	
	@GetMapping("/")
	public List<Notification> findAllByReceiverId(@RequestParam UUID receiverId){
		return notificationService.findAllByReceiverId(receiverId);
	}
	
	@GetMapping("/unread")
	public List<Notification> findAllByStatus(@RequestParam UUID receiverId, @RequestParam NotificationStatus status){
		return notificationService.findAllByUserIdAndStatus(receiverId, status);
	}
	
}
