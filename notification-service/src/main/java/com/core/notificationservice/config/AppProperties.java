package com.core.notificationservice.config;

import java.util.UUID;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
	
	private UUID systemUserId;
	private String systemUserName;
	
	public UUID getSystemUserId() {
		return systemUserId;
	}
	
	public void setSystemUserId(UUID systemUserId) {
		this.systemUserId = systemUserId;
	}
	
	public void setSystemUserName(String systemUserName) {
		this.systemUserName = systemUserName;
	}
	public String getSystemUserName() {
			return systemUserName;
	}
}
