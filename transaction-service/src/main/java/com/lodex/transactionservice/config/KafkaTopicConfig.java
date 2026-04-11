package com.lodex.transactionservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {
    public NewTopic transactionTopic(){
        return  new NewTopic("transaction-topic", 2, (short) 1);
    }
}
