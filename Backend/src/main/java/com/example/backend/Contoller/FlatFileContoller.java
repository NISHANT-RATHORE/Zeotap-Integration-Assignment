package com.example.backend.Contoller;


import com.example.backend.Service.FlatFileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/flatfile/")
@Slf4j
public class FlatFileContoller {

    @Autowired
    private FlatFileService flatFileService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFlatFile(
            @RequestParam(value = "file", required = true) MultipartFile file,
            @RequestParam(value = "delimiter", required = true) String delimiter,
            @RequestParam("table") String tableName
    ){
        try{
            log.info("uploading file: {}......", file.getOriginalFilename());
            String repsonse = flatFileService.upload(file, delimiter, tableName);
            return ResponseEntity.ok(repsonse);
        } catch (Exception e){
            log.error("Error while uploading file: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }


}
