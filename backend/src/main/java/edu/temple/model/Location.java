package edu.temple.model;

public class Location {
    private int id;
    private String name;

    public Location() {}

    public Location(int id, String name){
        this.id = id;
        this.name = name;
    }

    public int getId(){
        return id;
    }

    public String getName(){
        return name;
    }


    
    public void setId(int id){
        this.id = id;
    }

    public void setName(String name){
        this.name = name;  

    }

  

    
}
