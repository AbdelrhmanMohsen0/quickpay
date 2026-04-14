package com.core.notificationservice.config;

import java.util.UUID;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
	
	private UUID systemUserId;
	
	public UUID getSystemUserId() {
		return systemUserId;
	}
	
	public void setSystemUserId(UUID systemUserId) {
		this.systemUserId = systemUserId;
	}
}
