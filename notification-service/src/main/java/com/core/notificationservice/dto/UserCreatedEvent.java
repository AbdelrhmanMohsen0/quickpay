package com.core.notificationservice.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class UserCreatedEvent {
	
	private UUID id;
	private String phoneNumber;
	private String firstName;
	private String lastName;
	
}
