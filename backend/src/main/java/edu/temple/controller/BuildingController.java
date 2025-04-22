package edu.temple.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.temple.model.Building;
import edu.temple.repository.BuildingRepository;

@RestController
@CrossOrigin(origins = "*")
public class BuildingController {

    private final BuildingRepository buildingRepository;

    @Autowired
    public BuildingController(BuildingRepository buildingRepository){
        this.buildingRepository = buildingRepository;
    }

    @GetMapping("/buildings")
    public List<Building> getAllBuildings(){
        return buildingRepository.findAll(); 
    }

    
}
