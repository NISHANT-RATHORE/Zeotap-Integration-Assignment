package com.example.backend.Contoller;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.Model.ClickHouseConnection;
import com.example.backend.Service.ClickHouseService;
import com.example.backend.Service.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;

@RestController
@RequestMapping("/api")
@Slf4j
public class ClickHouseController {

    @Autowired
    private ClickHouseService clickHouseService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/connect")
    public ResponseEntity<ResponseDTO> connectToDatabase(@RequestBody ClickHouseConnection credentials) {
        try {
            log.info("Received database credentials: {}", credentials);
            clickHouseService.setClickHouseConnection(credentials);
            Connection connection = clickHouseService.getConnection();
            if (connection != null) {
                return ResponseEntity.ok(new ResponseDTO(jwtService.generateToken(credentials.getUsername()), "Connection established successfully!"));
            } else {
                return ResponseEntity.status(500).body(new ResponseDTO(null, "Failed to establish connection."));
            }
        } catch (Exception e) {
            log.error("Error while connecting to database: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new ResponseDTO(null, "An error occurred: " + e.getMessage()));
        }
    }
}