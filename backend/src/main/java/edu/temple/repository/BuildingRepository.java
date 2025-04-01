package edu.temple.repository;

import edu.temple.model.Building;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BuildingRepository {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public BuildingRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public List<Building> findAll(){
        String sql = "SELECT buildingid AS id, buildingname AS name, buildingimagelink AS img from building";
        return jdbcTemplate.query(sql, (resultSet, rowNum) -> new Building(
            resultSet.getInt("id"),
            resultSet.getString("name"),
            resultSet.getString("img")
        ));
    }
}
