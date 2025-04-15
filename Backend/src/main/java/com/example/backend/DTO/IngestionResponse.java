package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IngestionResponse {
    private String message;
    private int recordsProcessed;
}