package edu.temple.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import edu.temple.model.Location;

import edu.temple.repository.LocationRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LocationController {

    private final LocationRepository locationRepository;

    @Autowired
    public LocationController(LocationRepository locationRepository){
        this.locationRepository = locationRepository;
    }

    
    @GetMapping("locations/building/{buildingId}")
    public List<Location> getLocationsByBuildingId(@PathVariable int buildingId){
        return locationRepository.getLocationsByBuilding(buildingId);
    }


    
}
