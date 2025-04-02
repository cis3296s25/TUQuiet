package edu.temple.model;

import java.time.LocalDateTime;

public class Report {

    private Integer reportId;

    private Integer locationId; 

    private Integer noiseLevel;

    private Integer crowdLevel;

    private String description;

    private Integer userId;

    private LocalDateTime timeOfReport;

    public Report() {}

    public Report(Integer reportId, Integer locationId, Integer noiseLevel,
                  Integer crowdLevel, String description, Integer userId,
                  LocalDateTime timeOfReport) {
        this.reportId = reportId;
        this.locationId = locationId;
        this.noiseLevel = noiseLevel;
        this.crowdLevel = crowdLevel;
        this.description = description;
        this.userId = userId;
        this.timeOfReport = timeOfReport;
    }

    public Integer getReportId() {
        return reportId;
    }

    public void setReportId(Integer reportId) {
        this.reportId = reportId;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public Integer getNoiseLevel() {
        return noiseLevel;
    }

    public void setNoiseLevel(Integer noiseLevel) {
        this.noiseLevel = noiseLevel;
    }

    public Integer getCrowdLevel() {
        return crowdLevel;
    }

    public void setCrowdLevel(Integer crowdLevel) {
        this.crowdLevel = crowdLevel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDateTime getTimeOfReport() {
        return timeOfReport;
    }

    public void setTimeOfReport(LocalDateTime timeOfReport) {
        this.timeOfReport = timeOfReport;
    }
}