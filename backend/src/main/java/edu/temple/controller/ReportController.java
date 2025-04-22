package edu.temple.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
import edu.temple.service.WebSocketService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    private final DatabaseConfig databaseConfig;
    private final WebSocketService webSocketService;

    @Autowired
    public ReportController(DatabaseConfig databaseConfig, WebSocketService webSocketService) {
        this.databaseConfig = databaseConfig;
        this.webSocketService = webSocketService;
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
            
            // send real-time update through websocket
            webSocketService.sendStudySpotUpdate(locationId.toString(), averages, "REPORT_UPDATED");
            
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
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
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

    public Map<String, Object> calculateAverages(Integer locationId) {
        Connection conn = null;
        PreparedStatement statement = null;
        PreparedStatement timestampStatement = null;
        Map<String, Object> returnMap = new HashMap<>();
        returnMap.put("averageNoiseLevel", 0.0);
        returnMap.put("averageCrowdLevel", 0.0);
        returnMap.put("reportCount", 0);
        returnMap.put("lastReportTime", null);

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
                
                returnMap.put("averageNoiseLevel", averageNoiseLevel);
                returnMap.put("averageCrowdLevel", averageCrowdLevel);
                returnMap.put("reportCount", reportCount);
                
                if (reportCount > 0) {
                    String timestampSql = "SELECT TimeOfReport FROM report WHERE locationId = ? " +
                                         "ORDER BY TimeOfReport DESC LIMIT 1";
                    timestampStatement = conn.prepareStatement(timestampSql);
                    timestampStatement.setInt(1, locationId);
                    ResultSet tsRs = timestampStatement.executeQuery();
                    
                    if (tsRs.next()) {
                        Timestamp lastReportTimestamp = tsRs.getTimestamp("TimeOfReport");
                        if (lastReportTimestamp != null) {
                            returnMap.put("lastReportTime", lastReportTimestamp.toString());
                        }
                    }
                }
            }

        } catch (SQLException e) {
            returnMap = Map.of("errorStatus", e.toString());
        } finally {
            try {
                if (timestampStatement != null) timestampStatement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing timestamp statement", e);
            }
            try {
                if (statement != null) statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return returnMap;
    }

    @GetMapping("/predictions/{buildingId}")
    public ResponseEntity<?> getPredictedData(@PathVariable Integer buildingId) {
        List<Map<String, Object>> hourlyData = new ArrayList<>();
        Connection conn = null;
        PreparedStatement statement = null;

        try {
            conn = DriverManager.getConnection(
                databaseConfig.getDbUrl(),
                databaseConfig.getDbUser(),
                databaseConfig.getDbPass()
            );

            String sql = "SELECT NoiseLevel, CrowdLevel, TimeOfReport FROM report r INNER JOIN location l on r.LocationID= l.LocationID WHERE l.BuildingID = ?;";
            statement = conn.prepareStatement(sql);
            statement.setInt(1, buildingId);
            ResultSet rs = statement.executeQuery();

            Map<Integer, List<Map<String, Integer>>> grouped = new HashMap<>();
            while (rs.next()) {
                try {
                    Timestamp ts = rs.getTimestamp("TimeOfReport");
                    if (ts == null) {
                        logger.warn("TimeOfReport is null for buildingId {}", buildingId);
                        continue;
                    }
                    
                    ZonedDateTime utcTime = ts.toLocalDateTime().atZone(ZoneId.of("UTC"));
                    ZonedDateTime easternTime = utcTime.withZoneSameInstant(ZoneId.of("America/New_York"));
                    int hour = easternTime.getHour();
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
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return ResponseEntity.ok(hourlyData);
    }



    // api for recommendations 
    @GetMapping("/recommendations")
    public ResponseEntity<?> getAllRecommendations() {
        List<Map<String, Object>> recommendations = new ArrayList<>();

        String sql = """
                SELECT
                    l.locationid,
                    l.locationname,
                    b.buildingname,
                    b.buildingimagelink,
                    COALESCE(SUM(r.noiselevel * POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, r.timeofreport)) * 24 + EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, r.timeofreport))))) / NULLIF(SUM(POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, r.timeofreport)) * 24 + EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, r.timeofreport))))), 0), 0) AS weighted_noise,
                    COALESCE(SUM(r.crowdlevel * POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, r.timeofreport)) * 24 + EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, r.timeofreport))))) / NULLIF(SUM(POWER(0.95, (EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, r.timeofreport)) * 24 + EXTRACT(HOUR FROM AGE(CURRENT_TIMESTAMP, r.timeofreport))))), 0), 0) AS weighted_crowd,
                    COUNT(*) AS report_count,
                    MAX(r.timeofreport) AS last_report_time
                FROM location l
                JOIN building b ON l.buildingid = b.buildingid
                LEFT JOIN report r ON l.locationid = r.locationid
                WHERE r.timeofreport IS NULL OR EXTRACT(EPOCH FROM AGE(CURRENT_TIMESTAMP, r.timeofreport)) < (3 * 24 * 60 * 60)
                GROUP BY l.locationid, l.locationname, b.buildingname, b.buildingimagelink
                ORDER BY l.locationid
                      """;

                try (
                    Connection conn = DriverManager.getConnection(
                        databaseConfig.getDbUrl(),
                        databaseConfig.getDbUser(),
                        databaseConfig.getDbPass()
                    );
                    PreparedStatement stmt = conn.prepareStatement(sql);
                    ResultSet rs = stmt.executeQuery()) {

                        while (rs.next()) {
                            Map<String, Object> row = new HashMap<>();
                            row.put("id", rs.getInt("locationid"));
                            row.put("locationId", rs.getInt("locationid"));//same as id
                            row.put("name", rs.getString("locationname"));
                            row.put("buildingName", rs.getString("buildingname"));
                            row.put("averageNoiseLevel", Math.round(rs.getDouble("weighted_noise") * 10.0) / 10.0);
                            row.put("averageCrowdLevel", Math.round(rs.getDouble("weighted_crowd") * 10.0) / 10.0);
                            row.put("reportCount", rs.getInt("report_count"));
                            Timestamp ts = rs.getTimestamp("last_report_time");
                            ZonedDateTime utcTime = ts.toLocalDateTime().atZone(ZoneId.of("UTC"));
                            ZonedDateTime easternTime = utcTime.withZoneSameInstant(ZoneId.of("America/New_York"));
                            row.put("lastReportTime", easternTime.toLocalDateTime().toString());
                            recommendations.add(row);
                        }

                    } catch (SQLException e){
                        logger.error("SQL ERROR in /recommendations: {}", e.toString());
                        return ResponseEntity.status(500).body(Map.of("status","error", "message", e.toString()));
                    }
                    return ResponseEntity.ok(recommendations);

    }

    @GetMapping("/feed/{buildingId}")
    public ResponseEntity<?> getFeedData(@PathVariable Integer buildingId) {
        List<Map<String, Object>> feedData = new ArrayList<Map<String, Object>>();
        Connection conn = null;
        PreparedStatement statement = null;

        try {
            conn = DriverManager.getConnection(
                databaseConfig.getDbUrl(),
                databaseConfig.getDbUser(),
                databaseConfig.getDbPass()
            );

            String sql = "SELECT r.ReportID, r.LocationID, l.LocationName, b.BuildingName, r.NoiseLevel, r.CrowdLevel, r.Description, r.TimeOfReport "
            + "FROM report r INNER JOIN location l ON r.LocationID = l.LocationID INNER JOIN building b ON l.BuildingID = b.BuildingID";
            //placeholder value. may change later
            if(buildingId != 0){
                sql += " WHERE b.BuildingID = ?";
            }
            sql += " ORDER BY TimeOfReport DESC LIMIT 5;";

            statement = conn.prepareStatement(sql);
            //placeholder value. may change later
            if(buildingId != 0){
                statement.setInt(1, buildingId);
            }
            ResultSet rs = statement.executeQuery();
            while(rs.next()){
                Map<String, Object> reportData = new HashMap<String, Object>();
                reportData.put("id", rs.getInt("ReportID"));
                reportData.put("locationId", rs.getString("LocationID"));
                reportData.put("locationName", rs.getString("LocationName"));
                reportData.put("buildingName", rs.getString("BuildingName"));
                reportData.put("noiseLevel", rs.getInt("NoiseLevel"));
                reportData.put("crowdLevel", rs.getInt("CrowdLevel"));
                reportData.put("description", rs.getString("Description"));

                //Timestamp logic to work with frontend. Note for future: Neon stores timestamps in UTC, but rs.getTimestamp
                //assumes fetching in local time.
                Timestamp timestamp = rs.getTimestamp("TimeOfReport");
                ZonedDateTime utcTime = timestamp.toLocalDateTime().atZone(ZoneId.of("UTC"));
                ZonedDateTime easternTime = utcTime.withZoneSameInstant(ZoneId.of("America/New_York"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSSSSS");
                String formattedTimestamp = easternTime.format(formatter);
                reportData.put("timestamp", formattedTimestamp);

                feedData.add(reportData);
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
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return ResponseEntity.ok(feedData);
    }
    
}
