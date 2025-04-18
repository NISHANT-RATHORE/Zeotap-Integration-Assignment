package com.example.backend.Service;

import com.clickhouse.jdbc.ClickHouseDataSource;
import com.example.backend.Model.ClickHouseConnection;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
            throw new RuntimeException("Failed to establish ClickHouse connection", e);
        }
    }

    public void createTableDynamically(String tableName, Map<String, String> columnDefinitions) throws Exception {
        StringBuilder createTableQuery = new StringBuilder("CREATE TABLE IF NOT EXISTS " + tableName + " (");

        for (Map.Entry<String, String> entry : columnDefinitions.entrySet()) {
            createTableQuery.append(entry.getKey()).append(" ").append(entry.getValue()).append(", ");
        }

        // Remove the trailing comma and space, and add the engine definition
        createTableQuery.setLength(createTableQuery.length() - 2);
        createTableQuery.append(") ENGINE = MergeTree() ORDER BY tuple();");

        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(createTableQuery.toString())) {
            preparedStatement.execute();
            log.info("Table '{}' created successfully with columns: {}", tableName, columnDefinitions.keySet());
        } catch (SQLException e) {
            log.error("Error creating table '{}': {}", tableName, e.getMessage(), e);
            throw new RuntimeException("Error creating table", e);
        }
    }


//    public void saveDyanamicData(List<Map<String, String>> rows, String tableName) throws Exception {
//        if (rows.isEmpty()) {
//            throw new IllegalArgumentException("No data to save");
//        }
//
//        // Extract column definitions from the first row
//        Map<String, String> firstRow = rows.get(0);
//        Map<String, String> columnDefinitions = firstRow.keySet().stream()
//                .collect(Collectors.toMap(
//                        column -> column,
//                        column -> "String" // Defaulting all columns to String; adjust as needed
//                ));
//
//        // Create the table dynamically
//        createTableDynamically(tableName, columnDefinitions);
//
//        // Dynamically build the SQL query
//        String columns = String.join(", ", firstRow.keySet());
//        String placeholders = String.join(", ", firstRow.keySet().stream().map(col -> "?").toList());
//        String insertQuery = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + placeholders + ")";
//        log.info("Insert query: {}", insertQuery);
//
//
//        try (Connection connection = getConnection();
//             PreparedStatement preparedStatement = connection.prepareStatement(insertQuery)) {
//
//            for (Map<String, String> row : rows) {
//                int index = 1;
//                for (String value : row.values()) {
//                    preparedStatement.setString(index++, value);
//                }
//                preparedStatement.addBatch();
//            }
//
//            preparedStatement.executeBatch();
//        } catch (SQLException e) {
//            log.error("Error saving data to table '{}': {}", tableName, e.getMessage(), e);
//            throw new RuntimeException("Error saving data to table", e);
//        }
//    }

    public void saveDyanamicData(List<Map<String, String>> rows, String tableName) throws Exception {
        if (rows.isEmpty()) {
            throw new IllegalArgumentException("No data to save");
        }

        // Helper to reformat DateTime values
        DateTimeFormatter inputFormatter = DateTimeFormatter.ISO_DATE_TIME; // e.g., 2025-04-16T01:47:29
        DateTimeFormatter clickhouseFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"); // e.g., 2025-04-16 01:47:29

        // Extract column definitions from the first row
        Map<String, String> firstRow = rows.get(0);
        Map<String, String> columnDefinitions = firstRow.keySet().stream()
                .collect(Collectors.toMap(
                        column -> column,
                        column -> "String" // Defaulting all columns to String; adjust as needed
                ));

        // Create the table dynamically
        createTableDynamically(tableName, columnDefinitions);

        // Dynamically build the SQL query
        String columns = String.join(", ", firstRow.keySet());
        String placeholders = String.join(", ", firstRow.keySet().stream().map(col -> "?").toList());
        String insertQuery = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + placeholders + ")";
        log.info("Insert query: {}", insertQuery);

        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(insertQuery)) {

            for (Map<String, String> row : rows) {
                int index = 1;
                for (Map.Entry<String, String> entry : row.entrySet()) {
                    String value = entry.getValue();

                    // Reformat DateTime values if necessary
                    if (entry.getKey().equalsIgnoreCase("dob")) { // Adjust column name as needed
                        try {
                            value = LocalDateTime.parse(value, inputFormatter).format(clickhouseFormatter);
                        } catch (Exception e) {
                            log.warn("Invalid DateTime format for value '{}', skipping reformatting", value);
                        }
                    }

                    preparedStatement.setString(index++, value);
                }
                preparedStatement.addBatch();
            }

            preparedStatement.executeBatch();
        } catch (SQLException e) {
            log.error("Error saving data to table '{}': {}", tableName, e.getMessage(), e);
            throw new RuntimeException("Error saving data to table", e);
        }
    }

    public List<String> getTables() throws Exception {
        String query = "SHOW TABLES";
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(query);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            List<String> tables = new ArrayList<>();
            while (resultSet.next()) {
                tables.add(resultSet.getString(1));
            }
            if (tables.isEmpty()) {
                log.warn("No tables found in the database.");
            } else {
                log.info("Fetched tables: {}", tables);
            }
            return tables;
        } catch (SQLException e) {
            log.error("Error fetching tables: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching tables", e);
        }
    }

    public List<String> getTableColumns(String tableName) throws Exception {
        String query = "DESCRIBE TABLE " + tableName;
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(query);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            List<String> columns = new ArrayList<>();
            while (resultSet.next()) {
                columns.add(resultSet.getString(1)); // Column name is in the first column of the result
            }
            if (columns.isEmpty()) {
                log.warn("No columns found for table '{}'", tableName);
            } else {
                log.info("Fetched columns for table '{}': {}", tableName, columns);
            }
            return columns;
        } catch (SQLException e) {
            log.error("Error fetching columns for table '{}': {}", tableName, e.getMessage(), e);
            throw new RuntimeException("Error fetching columns", e);
        }
    }

    public int ingestData(Stream<Map<String, String>> rowsStream, String tableName, int batchSize) {
        List<Map<String, String>> batch = new ArrayList<>();
        AtomicInteger totalRecords = new AtomicInteger();

        rowsStream.forEach(row -> {
            batch.add(row);
            if (batch.size() == batchSize) {
                totalRecords.addAndGet(ingestBatch(batch, tableName));
                batch.clear();
            }
        });

        // Process remaining records
        if (!batch.isEmpty()) {
            totalRecords.addAndGet(ingestBatch(batch, tableName));
        }

        return totalRecords.get();
    }

    private int ingestBatch(List<Map<String, String>> batch, String tableName) {
        try {
            log.info("Ingesting batch of size: {}", batch.size());
            saveDyanamicData(batch, tableName);
            return batch.size();
        } catch (Exception e) {
            log.error("Error ingesting batch: {}", e.getMessage(), e);
            throw new RuntimeException("Batch ingestion failed", e);
        }
    }

//    public void exportDataToFlatFile(String tableName, String filePath) {
//        String query = "SELECT * FROM " + tableName;
//
//        try (Connection connection = getConnection();
//             Statement statement = connection.createStatement();
//             ResultSet resultSet = statement.executeQuery(query);
//             FileWriter fileWriter = new FileWriter(filePath);
//             CSVPrinter csvPrinter = new CSVPrinter(fileWriter, CSVFormat.DEFAULT.withHeader(resultSet))) {
//
//            log.info("Exporting data from table '{}' to file '{}'", tableName, filePath);
//
//            // Write rows to the file
//            while (resultSet.next()) {
//                int columnCount = resultSet.getMetaData().getColumnCount();
//                Object[] row = new Object[columnCount];
//                for (int i = 1; i <= columnCount; i++) {
//                    row[i - 1] = resultSet.getObject(i);
//                }
//                csvPrinter.printRecord(row);
//            }
//
//            log.info("Data export completed successfully.");
//        } catch (Exception e) {
//            log.error("Error exporting data to flat file: {}", e.getMessage(), e);
//            throw new RuntimeException("Data export failed: " + e.getMessage());
//        }
//    }

    public void exportSelectedColumnsToFlatFile(String tableName, List<String> selectedColumns, String filePath) {
        if (selectedColumns == null || selectedColumns.isEmpty()) {
            throw new IllegalArgumentException("No columns selected for export.");
        }

        // Build the query with selected columns
        String columns = String.join(", ", selectedColumns);
        String query = "SELECT " + columns + " FROM " + tableName;

        try (Connection connection = getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(query);
             FileWriter fileWriter = new FileWriter(filePath);
             CSVPrinter csvPrinter = new CSVPrinter(fileWriter, CSVFormat.DEFAULT.withHeader(selectedColumns.toArray(new String[0])))) {

            log.info("Exporting selected columns '{}' from table '{}' to file '{}'", selectedColumns, tableName, filePath);

            // Write rows to the file
            while (resultSet.next()) {
                List<Object> row = new ArrayList<>();
                for (String column : selectedColumns) {
                    row.add(resultSet.getObject(column));
                }
                csvPrinter.printRecord(row);
            }

            log.info("Data export completed successfully.");
        } catch (Exception e) {
            log.error("Error exporting data to flat file: {}", e.getMessage(), e);
            throw new RuntimeException("Data export failed: " + e.getMessage());
        }
    }
}
