package com.core.notificationservice.template;

public enum NotificationTemplateType {
	
	//todo: refine templates to contain more data
	USER_REGISTERED(
        "Welcome to QuickPay 🎉",
		        "Your account has been successfully created.",
		        "Welcome! Your account is ready. You can start sending and receiving money securely."
	),
	
	TRANSACTION_SENT(
        "Money Sent 💸",
		        "You sent {amount} to {receiverName}.",
		        "Your transfer of {amount} to {receiverName} was completed successfully."
	),
	
	TRANSACTION_RECEIVED(
        "Money Received 💰",
		        "You received {amount} from {senderName}.",
		        "{senderName} sent you {amount}. The amount has been added to your account."
	),
	
	PAYMENT_FAILED(
        "Payment Failed ❌",
		        "Your transaction could not be completed.",
		        "We couldn’t process your transaction of {amount}. Please try again."
	);
	
	private final String title;
	private final String shortMessage;
	private final String longMessage;
	
	NotificationTemplateType(String title, String shortMessage, String longMessage) {
		this.title = title;
		this.shortMessage = shortMessage;
		this.longMessage = longMessage;
	}
	
	public NotificationTemplate toTemplate() {
		return new NotificationTemplate(title, shortMessage, longMessage);
	}
}
