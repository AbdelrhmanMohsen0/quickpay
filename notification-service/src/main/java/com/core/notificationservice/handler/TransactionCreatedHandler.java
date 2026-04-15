package com.core.notificationservice.handler;

import java.util.List;
import java.util.Map;
import com.core.notificationservice.config.AppProperties;
import com.core.notificationservice.domain.NotificationStatus;
import com.core.notificationservice.domain.NotificationType;
import com.core.notificationservice.domain.TransactionStatus;
import com.core.notificationservice.dto.TransactionCreatedEvent;
import com.core.notificationservice.model.Notification;
import com.core.notificationservice.service.NotificationTemplateService;
import com.core.notificationservice.template.NotificationTemplateType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionCreatedHandler {
	
	//todo: fix the logic of the notification building and check who will receive what and how
	private final NotificationTemplateService templateService;
	private final AppProperties appProperties;
	
	
	public List<Notification> handle(TransactionCreatedEvent event) {
		
		if (event.getStatus() == TransactionStatus.REJECTED) {
			
			// Only sender gets failure notification
			var template = templateService.build(
					NotificationTemplateType.PAYMENT_FAILED,
					Map.of(
							"amount", event.getAmount().toString()
					)
			);
			
			Notification failedNotification = Notification.builder()
					.senderId(appProperties.getSystemUserId())
					.type(NotificationType.PAYMENT_FAILED)
					.title(template.getTitle())
					.message(template.getShortMessage())
					.receiverId(event.getSenderId())
					.shortMessage(template.getShortMessage())
					.status(NotificationStatus.UNREAD)
					.senderName(appProperties.getSystemUserName())
					.receiverName(event.getSenderName())
					.build();
			return List.of(failedNotification);
		}
		
		// SUCCESS case
		var senderTemplate = templateService.build(
				NotificationTemplateType.TRANSACTION_SENT,
				Map.of(
						"amount", event.getAmount().toString(),
						"receiverName", event.getReceiverName()
				)
		);
		
		var receiverTemplate = templateService.build(
				NotificationTemplateType.TRANSACTION_RECEIVED,
				Map.of(
						"amount", event.getAmount().toString(),
						"senderName", event.getSenderName()
				)
		);
		
		Notification senderNotification = Notification.builder()
				.senderId(event.getSenderId())
				.type(NotificationType.TRANSACTION_SENT)
				.title(senderTemplate.getTitle())
				.message(senderTemplate.getLongMessage())
				.receiverId(event.getSenderId())
				.shortMessage(senderTemplate.getShortMessage())
				.status(NotificationStatus.UNREAD)
				.senderName(event.getSenderName())
				.receiverName(event.getReceiverName())
				.build();
		
		Notification receiverNotification = Notification.builder()
				.senderId(event.getSenderId())
				.type(NotificationType.TRANSACTION_RECEIVED)
				.title(receiverTemplate.getTitle())
				.message(receiverTemplate.getLongMessage())
				.receiverId(event.getReceiverId())
				.shortMessage(receiverTemplate.getShortMessage())
				.status(NotificationStatus.UNREAD)
				.senderName(event.getSenderName())
				.receiverName(event.getReceiverName())
				.build();
		
		return List.of(senderNotification, receiverNotification);
	}
	
}
