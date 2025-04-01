package edu.temple.model;

public class Building {
    private int id;
    private String name;
    private String img;

    // default constructor
    public Building() {}

    public Building(int id, String name, String img){
        this.id = id;
        this.name = name;
        this.img = img;
    }

    public int getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    public String getImg(){
        return img;
    }


    
    public void setId(int id){
        this.id = id;
    }

    public void setName(String name){
        this.name = name;  

    }

    public void setImg(String img){
        this.img = img;       
    }
}
