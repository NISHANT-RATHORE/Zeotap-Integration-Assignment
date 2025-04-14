package com.example.backend.Configuration;

import com.example.backend.Model.ClickHouseConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ClickHouseConnection clickHouseConnection(){
        return new ClickHouseConnection();
    }
}
