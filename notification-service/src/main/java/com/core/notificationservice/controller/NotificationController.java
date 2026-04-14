package com.core.notificationservice.controller;

import com.core.notificationservice.model.Notification;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.RequestMapping;import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {
	
	@GetMapping("/")
	public Notification test(){
		return null;
	}
}
