package edu.temple.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.temple.config.DatabaseConfig;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;


@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    // In mem storage for reports
    private static final Map<String, List<Map<String, Object>>> locationReports = new HashMap<>();
    private static final DatabaseConfig databaseConfig = new DatabaseConfig();

    // Sample data creation
    static {
        // Sample data for 25 locations
        for (int i = 1; i <= 25; i++) {
            String locationId = String.valueOf(i);
            List<Map<String, Object>> reports = new ArrayList<>();

            int reportCount = new Random().nextInt(3) + 1;
            for (int j = 0; j < reportCount; j++) {
                reports.add(Map.of(
                    "noiseLevel", new Random().nextInt(5) + 1,
                    "crowdLevel", new Random().nextInt(5) + 1
                ));
            }
            locationReports.put(locationId, reports);
        }
    }

    // Used to submit report
    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody Map<String, Object> report) {
        Integer locationId = Integer.parseInt(report.get("locationId").toString());
        Integer noiseLevel = Integer.parseInt(report.get("noiseLevel").toString());
        Integer crowdLevel = Integer.parseInt(report.get("crowdLevel").toString());
        String description = report.get("description").toString();

        try(Connection conn = DriverManager.getConnection(databaseConfig.getDbUrl(), databaseConfig.getDbUser(), databaseConfig.getDbPass())){

            String sql = "INSERT INTO report (LocationID, NoiseLevel, CrowdLevel, Description, TimeOfReport) " +
             "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
            
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setInt(1, locationId);  // Set LocationID
            statement.setInt(2, noiseLevel);   // Set NoiseLevel
            statement.setInt(3, crowdLevel);   // Set CrowdLevel
            statement.setString(4, description); // Set Description

            statement.executeUpdate();

            statement.close();
            conn.close();


            return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Report recieved successfully"
            ));
        }
        catch (SQLException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }

        //legacy code. delete when confirmed if it's ok to remove averages from the response entity ok
        // // String locationId = (String) report.get("locationId").toString();
        
        // // locationReports.computeIfAbsent(locationId, k -> new ArrayList<>()).add(report);

        // // Map<String, Object> averages = calculateAverages(locationId);

        // return ResponseEntity.ok(Map.of(
        //     "status", "success",
        //     "message", "Report recieved successfully",
        //     "averages", averages
        // ));
    }

    // Used to fetch location averages
    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getLocationAverages(@PathVariable String locationId) {
        Map<String, Object> averages = calculateAverages(locationId);
        return ResponseEntity.ok(averages);
    }

    // Helper method to calculate averages
    private Map<String, Object> calculateAverages(String locationId) {
        List<Map<String, Object>> reports = locationReports.getOrDefault(locationId, new ArrayList<>());

        if (reports.isEmpty()) {
            return Map.of(
                "averageNoiseLevel", 0,
                "averageCrowdLevel", 0,
                "reportCount", 0
            );
        }

        double totalNoise = 0;
        double totalCrowd = 0;

        for (Map<String, Object> report : reports) {
            totalNoise += ((Number) report.get("noiseLevel")).doubleValue();
            totalCrowd += ((Number) report.get("crowdLevel")).doubleValue();
        }

        double avgNoise = totalNoise / reports.size();
        double avgCrowd = totalCrowd / reports.size();

        return Map.of(
            "averageNoiseLevel", Math.round(avgNoise * 10) / 10.0,
            "averageCrowdLevel", Math.round(avgCrowd * 10) / 10.0,
            "reportCount", reports.size()
        );
    }
}