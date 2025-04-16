package com.example.backend.Contoller;


import com.example.backend.DTO.UploadResponseDTO;
import com.example.backend.Service.FlatFileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flatfile/")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class FlatFileContoller {

    @Autowired
    private FlatFileService flatFileService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponseDTO> uploadFlatFile(
            @RequestParam(value = "file", required = true) MultipartFile file,
            @RequestParam(value = "delimiter", required = true) String delimiter,
            @RequestParam("table") String tableName
    ) {
        try {
            log.info("Uploading file: {}......", file.getOriginalFilename());
            List<Map<String, String>> rows = flatFileService.upload(file, delimiter, tableName);
            UploadResponseDTO response = new UploadResponseDTO("File uploaded successfully!", rows);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error while uploading file: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new UploadResponseDTO("An error occurred: " + e.getMessage(), null));
        }
    }


}
