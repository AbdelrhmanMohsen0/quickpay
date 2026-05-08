package com.core.notificationservice.template;

public enum NotificationTemplateType {
	
	//todo: refine templates to contain more data
	USER_REGISTERED(
        "Welcome to QuickPay!",
		        "Your account has been successfully created.",
		        "Welcome {firstName} {lastName}! Your account is ready. You can start sending and receiving money securely."
	),
	
	TRANSACTION_SENT(
        "Money Sent",
		        "You sent {amount} EGP to {receiverName}.",
		        "Your transfer of {amount} EGP to {receiverName} was completed successfully. " +
				        "The transaction reference number is: {transactionId}"
	),
	
	TRANSACTION_RECEIVED(
        "Money Received",
		        "You received {amount} EGP from {senderName}.",
		        "{senderName} sent you {amount} EGP. The amount has been added to your account. " +
				        "The transaction reference number is: {transactionId}"
	),
	
	PAYMENT_FAILED(
        "Payment Failed",
		        "Your transaction could not be completed.",
		        "We couldn’t process your transaction of {amount} EGP because of the following: {rejectionReason}"
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
