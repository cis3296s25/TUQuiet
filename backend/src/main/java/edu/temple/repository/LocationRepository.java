package edu.temple.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import edu.temple.model.Location;

@Repository
public class LocationRepository {
    
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public LocationRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Location> getLocationsByBuilding(int buildingId){
        String sql ="""
                SELECT locationid AS id, locationname AS name
                FROM location
                WHERE buildingid = ?
                """;
        return jdbcTemplate.query(sql, (resultSet, rowNum) -> new Location(
            resultSet.getInt("id"),
            resultSet.getString("name")
        ), buildingId);
        
    }
}
