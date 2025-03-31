package edu.temple.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.temple.model.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findByLocationId(Integer locationId); 
}