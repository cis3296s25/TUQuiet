package edu.temple.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;


@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    // In mem storage for reports
    private static final Map<String, List<Map<String, Object>>> locationReports = new HashMap<>();

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

    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody Map<String, Object> report) {
        String locationId = (String) report.get("locationId").toString();
        
        locationReports.computeIfAbsent(locationId, k -> new ArrayList<>()).add(report);

        Map<String, Object> averages = calculateAverages(locationId);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Report recieved successfully",
            "averages", averages
        ));
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getLocationAverages(@PathVariable String locationId) {
        
    }

    private Map<String, Object> calculateAverages(String locationId) {
        
    }




}
