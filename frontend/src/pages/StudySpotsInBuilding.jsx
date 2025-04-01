import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import backArrow from "../assets/backArrow.png";
import StudySpotCard from "../components/StudySpotCard";

function StudySpotsInBuilding() {
  const { BuildingId } = useParams();
  const location = useLocation();
  const building = location.state.building;

  const [spots, setSpots] = useState([]);
  const [spotAverages, setSpotAverages] = useState({}); // Add state for spot averages
  const [isLoadingAverages, setIsLoadingAverages] = useState(false);

  //fetch study spot and populate array with data based on building clicked on
  useEffect(() => {
    const fetchSpots = async () =>{
      try{
      const response = await fetch(`http://localhost:8080/locations/building/${BuildingId}`);
      const data = await response.json();
      setSpots(data);
      } catch (error){
        console.error("Failed fetching spots with error: ", error);
      }

    }

    fetchSpots();
  }
    , [BuildingId] );
  
  // Fetch averages for all spots in this building
  useEffect(() => {
    const fetchAverages = async () => {
      setIsLoadingAverages(true);
      const averagesData = {};
      
      // Fetch data for each spot
      for (const spot of spots) {
        try {
          const response = await fetch(`http://localhost:8080/api/reports/location/${spot.id}`);
          const data = await response.json();
          averagesData[spot.id] = data;
        } catch (error) {
          console.error(`Error fetching data for spot ${spot.id}:`, error);
        }
      }
      
      setSpotAverages(averagesData);
      setIsLoadingAverages(false);
    };
    
    fetchAverages();
  }, [spots]);

  // Add refresh mechanism for when returning from form submission
  useEffect(() => {
    // Check if we're returning from a form submission
    if (location.state?.formSubmitted && location.state?.spotId) {
      const refreshSpotData = async (spotId) => {
        setIsLoadingAverages(true);

        try {
          const response = await fetch(`http://localhost:8080/api/reports/location/${spotId}`);
          const data = await response.json();
          setSpotAverages(prev => ({
            ...prev,
            [spotId]: data
          }));
        } catch (error) {
          console.error(`Error refreshing data for spot ${spotId}:`, error);
        } finally {
      setIsLoadingAverages(false);

        }
      };
      
      refreshSpotData(location.state.spotId);
    }
  }, [location.state]);


  return (
    <div className="p-10">
      {/* come back to this to figure out how to pass prop down so we can get name of building clicked on */}
      <div className="flex space-x-3">
        <Link
          to={`/Building`}
          className="hover:bg-[#171717] border-0 rounded-lg"
        >
          <img src={backArrow} className="max-h-10" />
        </Link>
        <h1 className="font-bold text-4xl">
          {building?.name || "Building"} - Pick a spot to begin a TUQuiet Report
        </h1>
      </div>
      <div className="mt-10">
        <img src={building.img} className="border-1 rounded-xl w-[1000px] " />
      </div>
      <h1 className="mt-8 mb-4 font-bold text-2xl">Study Spots</h1>
      <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 max-w-[1000px] ">
        {spots.map((spot) => (
          <StudySpotCard 
            key={spot.id} 
            spot={spot} 
            averages={spotAverages[spot.id]} 
            isLoadingAverages={isLoadingAverages} 
          />
        ))}
      </div>
    </div>
  );
}

export default StudySpotsInBuilding;
