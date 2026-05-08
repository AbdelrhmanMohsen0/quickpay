package com.core.notificationservice.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import com.core.notificationservice.domain.TransactionStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class TransactionCreatedEvent {
	
	private UUID transactionId;
	private UUID senderId;
	private UUID receiverId;
	private String senderName;
	private String receiverName;
	private BigDecimal amount;
	private TransactionStatus status;
	private String rejectionReason;
	
}
