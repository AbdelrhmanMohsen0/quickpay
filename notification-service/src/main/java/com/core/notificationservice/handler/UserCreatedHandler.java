package com.core.notificationservice.handler;

import java.util.Map;
import com.core.notificationservice.config.AppProperties;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.domain.NotificationType;
import com.core.notificationservice.dto.UserCreatedEvent;
import com.core.notificationservice.model.Notification;
import com.core.notificationservice.service.NotificationTemplateService;
import com.core.notificationservice.template.NotificationTemplateType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserCreatedHandler {
	
	private final NotificationTemplateService templateService;
	private final AppProperties appProperties;
	
	public Notification handle(UserCreatedEvent userCreatedEvent) {
		
		var template = templateService.build(
				NotificationTemplateType.USER_REGISTERED,
				Map.of()
		);
		
		return Notification.builder()
				.senderId(appProperties.getSystemUserId())
				.senderName(appProperties.getSystemUserName())
				.receiverId(userCreatedEvent.getId())
				.receiverName(userCreatedEvent.getFirstName() + " " + userCreatedEvent.getLastName())
				.type(NotificationType.USER_REGISTERED)
				.title(template.getTitle())
				.shortMessage(template.getShortMessage())
				.message(template.getLongMessage())
				.status(NotificationStatus.UNREAD)
				.build();
	}
}
