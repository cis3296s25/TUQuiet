package edu.temple.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.temple.config.DatabaseConfig;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;


@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    // In mem storage for reports
    private static final Map<String, List<Map<String, Object>>> locationReports = new HashMap<>();
    private DatabaseConfig databaseConfig;

    @Autowired
    public ReportController(DatabaseConfig databaseConfig){
        this.databaseConfig = databaseConfig;
    }

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

        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r = null;

        try{
            conn = DriverManager.getConnection(databaseConfig.getDbUrl(), databaseConfig.getDbUser(), databaseConfig.getDbPass());
            String sql = "INSERT INTO report (LocationID, NoiseLevel, CrowdLevel, Description, TimeOfReport) " +
             "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
            
            //prepared statement prevents SQL insertion by user
            statement = conn.prepareStatement(sql);
            statement.setInt(1, locationId);  // Set LocationID
            statement.setInt(2, noiseLevel);   // Set NoiseLevel
            statement.setInt(3, crowdLevel);   // Set CrowdLevel
            statement.setString(4, description); // Set Description

            statement.executeUpdate();

            r = ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Report recieved successfully"
            ));
        }
        catch (SQLException e){
            r = ResponseEntity.ok(Map.of(
            "status", "failure",
            "message", e.toString()
            ));
        }
        finally{
            try {
                if (statement != null) {
                    statement.close();
                }
            }
            //should never catch, but needed for safety
            catch (SQLException e) {
                e.printStackTrace();
            }
            try {
                if (conn != null) {
                    conn.close();
                }
            } 
            //should never catch, but needed for safety
            catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return r;
    }

    // Used to fetch location averages
    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getLocationAverages(@PathVariable String locationId) {
        Map<String, Object> averages = calculateAverages(locationId);
        if(!averages.containsKey("errorStatus")){
            return ResponseEntity.ok(averages);
        }
        return ResponseEntity.ok(Map.of(
            "status", "failure",
            "message", averages.get("errorStatus")
        ));

    }

    // Helper method to calculate averages
    private Map<String, Object> calculateAverages(String locationId) {
        Integer locId = Integer.parseInt(locationId);

        Connection conn = null;
        PreparedStatement statement = null;
        Map<String, Object> returnMap = Map.of(
            "averageNoiseLevel", 0.0,
            "averageCrowdLevel", 0.0,
            "reportCount", 0
        );


        try{
            conn = DriverManager.getConnection(databaseConfig.getDbUrl(), databaseConfig.getDbUser(), databaseConfig.getDbPass());
            String sql = "SELECT " +
                "COALESCE(SUM(NoiseLevel * POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, TimeOfReport)) * 24 + " +
                "EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, TimeOfReport))))) / " +
                "NULLIF(SUM(POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, TimeOfReport)) * 24 + " +
                "EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, TimeOfReport))))), 0), 0) AS WeightedNoiseLevel, " +
            
                "COALESCE(SUM(CrowdLevel * POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, TimeOfReport)) * 24 + " +
                "EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, TimeOfReport))))) / " +
                "NULLIF(SUM(POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, TimeOfReport)) * 24 + " +
                "EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, TimeOfReport))))), 0), 0) AS WeightedCrowdLevel, " +
            
                "COUNT(*) AS ReportCount " +
                "FROM report " +
                "WHERE locationId = ? " +
                "AND EXTRACT(EPOCH FROM AGE(CURRENT_TIMESTAMP, TimeOfReport)) < (3 * 24 * 60 * 60);";

            
            statement = conn.prepareStatement(sql);
            statement.setInt(1, locId);  // Set LocationID

            ResultSet rs = statement.executeQuery();

            if(rs.next()){
                double averageNoiseLevel = rs.getDouble("WeightedNoiseLevel");
                double averageCrowdLevel = rs.getDouble("WeightedCrowdLevel");
                int reportCount = rs.getInt("ReportCount");

                averageNoiseLevel = Math.round(averageNoiseLevel * 10.0) / 10.0;
                averageCrowdLevel = Math.round(averageCrowdLevel * 10.0) / 10.0;
                returnMap = Map.of(
                "averageNoiseLevel", averageNoiseLevel,
                "averageCrowdLevel", averageCrowdLevel,
                "reportCount", reportCount
                );
            }

        }
        catch (SQLException e){
            returnMap = Map.of(
                "errorStatus", e.toString()
            );
        }
        finally{
            try {
                if (statement != null) {
                    statement.close();
                }
            }
            //should never catch, but needed for safety
            catch (SQLException e) {
                e.printStackTrace();
            }
            try {
                if (conn != null) {
                    conn.close();
                }
            } 
            //should never catch, but needed for safety
            catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return returnMap;
    }
}