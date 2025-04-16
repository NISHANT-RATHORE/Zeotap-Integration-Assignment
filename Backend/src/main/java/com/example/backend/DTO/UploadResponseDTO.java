package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class UploadResponseDTO {
    private String message;
    private List<Map<String, String>> rows;
}