package com.example.backend.Service;

import com.clickhouse.jdbc.ClickHouseDataSource;
import com.example.backend.Model.ClickHouseConnection;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;

@Setter
@Service
@Slf4j
public class ClickHouseService {

    @Autowired
    private ClickHouseConnection clickHouseConnection;

    public Connection getConnection() {
        try {
            String url = String.format("jdbc:clickhouse://%s:%d/%s",
                clickHouseConnection.getHost(),
                clickHouseConnection.getPort(),
                clickHouseConnection.getDatabase());
            log.info("Connecting to ClickHouse at URL: {}", url);
            return new ClickHouseDataSource(url).getConnection(
                    clickHouseConnection.getUsername(),
                    clickHouseConnection.getPassword()
            );
        } catch (SQLException e) {
            log.error("Failed to establish ClickHouse connection: {}", e.getMessage(), e);
            return null; // or throw a custom exception if preferred
        }
    }


}
