package edu.temple.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reportid")
    private Integer reportId;

    @Column(name = "locationid")
    private Integer locationId; 

    @Column(name = "noiselevel")
    private Integer noiseLevel;

    @Column(name = "crowdlevel")
    private Integer crowdLevel;

    @Column(name = "description")
    private String description;

    @Column(name = "userid")
    private Integer userId;

    @Column(name = "timeofreport")
    private LocalDateTime timeOfReport;
}