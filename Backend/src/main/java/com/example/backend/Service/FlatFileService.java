package com.example.backend.Service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class FlatFileService {

    @Autowired
    private ClickHouseService clickHouseService;

    public String upload(MultipartFile file, String delimiter, String tableName) {
        List<Map<String, String>> rows = new ArrayList<>();
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            log.info("Starting file upload for table: {}", tableName);

            // Parse the file using the specified delimiter
            log.info("Parsing file with delimiter: {}", delimiter);
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setDelimiter(delimiter.charAt(0))
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .build();

            try (CSVParser csvParser = new CSVParser(reader, csvFormat)) {
                for (CSVRecord record : csvParser) {
                    rows.add(record.toMap());
                }
                log.info("save to clickhouse.....");
                clickHouseService.saveDyanamicData(rows,tableName);
                log.info("File parsed successfully. Total rows: {}", rows.size());
            }

            return ResponseEntity.ok("File uploaded successfully! Parsed rows: " + rows).getBody();
        } catch (IOException e) {
            log.error("Error reading the file: {}", e.getMessage(), e);
            return "Error processing file: " + e.getMessage();
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage(), e);
            return "An unexpected error occurred: " + e.getMessage();
        }
    }
}