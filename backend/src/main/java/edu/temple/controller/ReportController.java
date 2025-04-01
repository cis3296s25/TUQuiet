package edu.temple.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.temple.config.DatabaseConfig;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    private final DatabaseConfig databaseConfig;

    @Autowired
    public ReportController(DatabaseConfig databaseConfig) {
        this.databaseConfig = databaseConfig;
    }

    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody Map<String, Object> report) {
        Integer locationId = Integer.parseInt(report.get("locationId").toString());
        Integer noiseLevel = Integer.parseInt(report.get("noiseLevel").toString());
        Integer crowdLevel = Integer.parseInt(report.get("crowdLevel").toString());
        String description = report.get("description") != null ? report.get("description").toString() : null;

        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r;

        try {
            conn = DriverManager.getConnection(
                databaseConfig.getDbUrl(),
                databaseConfig.getDbUser(),
                databaseConfig.getDbPass()
            );
            String sql = "INSERT INTO report (LocationID, NoiseLevel, CrowdLevel, Description, TimeOfReport) " +
                "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";

            statement = conn.prepareStatement(sql);
            statement.setInt(1, locationId);
            statement.setInt(2, noiseLevel);
            statement.setInt(3, crowdLevel);
            statement.setString(4, description);

            statement.executeUpdate();

            Map<String, Object> averages = calculateAverages(locationId);
            r = ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Report received successfully",
                "averages", averages
            ));
        } catch (SQLException e) {
            r = ResponseEntity.ok(Map.of(
                "status", "failure",
                "message", e.toString()
            ));
        } finally {
            try {
                if (statement != null) statement.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred", e);
            }
        }

        return r;
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getLocationAverages(@PathVariable Integer locationId) {
        Map<String, Object> averages = calculateAverages(locationId);
        if (!averages.containsKey("errorStatus")) {
            return ResponseEntity.ok(averages);
        }
        return ResponseEntity.ok(Map.of(
            "status", "failure",
            "message", averages.get("errorStatus")
        ));
    }

    private Map<String, Object> calculateAverages(Integer locationId) {
        Connection conn = null;
        PreparedStatement statement = null;
        Map<String, Object> returnMap = Map.of(
            "averageNoiseLevel", 0.0,
            "averageCrowdLevel", 0.0,
            "reportCount", 0
        );

        try {
            conn = DriverManager.getConnection(
                databaseConfig.getDbUrl(),
                databaseConfig.getDbUser(),
                databaseConfig.getDbPass()
            );

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
                "FROM report WHERE locationId = ? " +
                "AND EXTRACT(EPOCH FROM AGE(CURRENT_TIMESTAMP, TimeOfReport)) < (3 * 24 * 60 * 60);";

            statement = conn.prepareStatement(sql);
            statement.setInt(1, locationId);
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

        } catch (SQLException e) {
            returnMap = Map.of("errorStatus", e.toString());
        } finally {
            try {
                if (statement != null) statement.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred", e);
            }
        }

        return returnMap;
    }

    @GetMapping("/predictions/{locationId}")
    public ResponseEntity<?> getPredictedData(@PathVariable Integer locationId) {
        List<Map<String, Object>> hourlyData = new ArrayList<>();
        Connection conn = null;
        PreparedStatement statement = null;

        try {
            conn = DriverManager.getConnection(
                databaseConfig.getDbUrl(),
                databaseConfig.getDbUser(),
                databaseConfig.getDbPass()
            );

            String sql = "SELECT NoiseLevel, CrowdLevel, TimeOfReport FROM report WHERE locationId = ?;";
            statement = conn.prepareStatement(sql);
            statement.setInt(1, locationId);
            ResultSet rs = statement.executeQuery();

            Map<Integer, List<Map<String, Integer>>> grouped = new HashMap<>();
            while (rs.next()) {
                try {
                    Timestamp ts = rs.getTimestamp("TimeOfReport");
                    if (ts == null) {
                        logger.warn("TimeOfReport is null for locationId {}", locationId);
                        continue;
                    }

                    int hour = ts.toLocalDateTime().getHour();
                    int noise = rs.getInt("NoiseLevel");
                    int crowd = rs.getInt("CrowdLevel");

                    grouped.computeIfAbsent(hour, k -> new ArrayList<>()).add(Map.of(
                        "noise", noise,
                        "crowd", crowd
                    ));
                } catch (Exception e) {
                    logger.error("Error parsing a row: {}", e.getMessage());
                    continue;
                }
            }

            for (int hour = 0; hour < 24; hour++) {
                List<Map<String, Integer>> list = grouped.getOrDefault(hour, new ArrayList<>());
                double avgNoise = list.stream().mapToInt(m -> m.get("noise")).average().orElse(0.0);
                double avgCrowd = list.stream().mapToInt(m -> m.get("crowd")).average().orElse(0.0);

                hourlyData.add(Map.of(
                    "time", String.format("%02d:00", hour),
                    "noise", Math.round(avgNoise * 10) / 10.0,
                    "crowd", Math.round(avgCrowd * 10) / 10.0
                ));
            }

        } catch (SQLException e) {
            logger.error("SQL Error while fetching predictions: {}", e.toString());
            return ResponseEntity.status(500).body(Map.of(
                "status", "failure",
                "message", e.toString()
            ));
        } finally {
            try {
                if (statement != null) statement.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred", e);
            }
        }

        return ResponseEntity.ok(hourlyData);
    }
}
