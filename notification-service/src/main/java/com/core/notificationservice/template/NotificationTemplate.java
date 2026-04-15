package com.core.notificationservice.template;

import io.swagger.v3.oas.annotations.info.Info;import lombok.AllArgsConstructor;import lombok.Builder;import lombok.Getter;
import lombok.NoArgsConstructor;import org.springframework.stereotype.Component;

@Component
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplate {
	
	private String title;
	private String shortMessage;
	private String longMessage;
	
	public String getTitle() {
		return title;
	}
	
	public String getShortMessage() {
		return shortMessage;
	}
	
	public String getLongMessage() {
		return longMessage;
	}
}
