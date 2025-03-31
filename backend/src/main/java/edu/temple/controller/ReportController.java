package edu.temple.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.temple.model.Report;
import edu.temple.repository.ReportRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    // POST: store user input into database
    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody Map<String, Object> body) {
        try {
            Report report = new Report();
            report.setLocationId(Integer.parseInt(body.get("locationId").toString())); // ✅ updated
            report.setNoiseLevel(Integer.parseInt(body.get("noiseLevel").toString()));
            report.setCrowdLevel(Integer.parseInt(body.get("crowdLevel").toString()));
            report.setDescription(body.get("description") != null ? body.get("description").toString() : null);
            report.setUserId(null);
            report.setTimeOfReport(LocalDateTime.now());

            reportRepository.save(report);

            Map<String, Object> averages = calculateAverages(report.getLocationId());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Report saved to database.",
                    "averages", averages
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Failed to save report.",
                    "error", e.getMessage()
            ));
        }
    }

    // GET: look for the average noise/crowd level in certain locationId
    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getLocationAverages(@PathVariable Integer locationId) { // ✅ updated
        Map<String, Object> averages = calculateAverages(locationId);
        return ResponseEntity.ok(averages);
    }

    // Helper method for average calculation
    private Map<String, Object> calculateAverages(Integer locationId) { // ✅ updated
        List<Report> reports = reportRepository.findByLocationId(locationId);

        if (reports.isEmpty()) {
            return Map.of(
                    "averageNoiseLevel", 0,
                    "averageCrowdLevel", 0,
                    "reportCount", 0
            );
        }

        double avgNoise = reports.stream().mapToInt(Report::getNoiseLevel).average().orElse(0.0);
        double avgCrowd = reports.stream().mapToInt(Report::getCrowdLevel).average().orElse(0.0);

        return Map.of(
                "averageNoiseLevel", Math.round(avgNoise * 10.0) / 10.0,
                "averageCrowdLevel", Math.round(avgCrowd * 10.0) / 10.0,
                "reportCount", reports.size()
        );
    }

    // GET: predictive graph data based on timeline
    @GetMapping("/predictions/{locationId}")
    public ResponseEntity<?> getPredictedData(@PathVariable Integer locationId) { // ✅ updated
        List<Report> reports = reportRepository.findByLocationId(locationId);

        // group report by hour
        Map<Integer, List<Report>> groupedByHour = new HashMap<>();
        for (Report report : reports) {
            int hour = report.getTimeOfReport().getHour();
            groupedByHour.computeIfAbsent(hour, k -> new ArrayList<>()).add(report);
        }

        // generate 24hr data
        List<Map<String, Object>> response = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            List<Report> hourReports = groupedByHour.getOrDefault(hour, new ArrayList<>());

            double avgNoise = hourReports.stream().mapToInt(Report::getNoiseLevel).average().orElse(0.0);
            double avgCrowd = hourReports.stream().mapToInt(Report::getCrowdLevel).average().orElse(0.0);

            String formattedTime = String.format("%02d:00", hour);

            response.add(Map.of(
                    "time", formattedTime,
                    "noise", Math.round(avgNoise * 10) / 10.0,
                    "crowd", Math.round(avgCrowd * 10) / 10.0
            ));
        }

        return ResponseEntity.ok(response);
    }
}