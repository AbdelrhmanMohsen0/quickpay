package com.core.notificationservice.service;

import java.util.Map;
import com.core.notificationservice.template.NotificationTemplate;
import com.core.notificationservice.template.NotificationTemplateType;
import com.core.notificationservice.template.TemplateEngine;
import lombok.RequiredArgsConstructor;import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationTemplateService {
	
	private final TemplateEngine templateEngine;
	
	
	public NotificationTemplate build(
			NotificationTemplateType type,
			Map<String, String> variables
	) {
		NotificationTemplate template = type.toTemplate();
		return templateEngine.process(template, variables);
	}
}
