package com.core.notificationservice.controller;

import java.util.List;import com.core.notificationservice.model.Notification;import com.core.notificationservice.service.NotificationService;import lombok.RequiredArgsConstructor;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.RequestMapping;import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {
	
	private final NotificationService notificationService;
	
	@GetMapping("/")
	public void test(){
		System.out.println("Notification Service is working!");
	}
	
	@GetMapping("/notifications")
	public List<Notification> findAll(){
		return notificationService.findAll();
	}
}
