package com.inventory.config;

import com.inventory.service.DataInitializerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public DataInitializerService dataInitializerService() {
        return new DataInitializerService();
    }
}
