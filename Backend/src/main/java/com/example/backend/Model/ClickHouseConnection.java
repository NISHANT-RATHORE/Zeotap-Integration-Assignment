package com.example.backend.Model;

import lombok.Data;

@Data
public class ClickHouseConnection {
    private String host;
    private int port;
    private String database;
    private String username;
    private String password;
    private String jwtToken;
}
