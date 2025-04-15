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
import java.util.List;

@RestController
@RequestMapping("/api/clickhouse")
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

    @GetMapping("/tables")
    public ResponseEntity<List<String>> getTables() {
        try {
            log.info("Fetching tables from ClickHouse database...");
            List<String> tables = clickHouseService.getTables();
            log.info("successfully fetched tables: {}", tables);
            return ResponseEntity.ok(tables);
        } catch (Exception e) {
            log.error("Error fetching tables: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/columns")
    public ResponseEntity<List<String>> getTableColumns(@RequestParam("table") String tableName) {
        try {
            log.info("Fetching columns for table: {}", tableName);
            List<String> columns = clickHouseService.getTableColumns(tableName);
            log.info("successfully fetched columns for table '{}': {}", tableName, columns);
            return ResponseEntity.ok(columns);
        } catch (Exception e) {
            log.error("Error fetching columns for table '{}': {}", tableName, e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }


}