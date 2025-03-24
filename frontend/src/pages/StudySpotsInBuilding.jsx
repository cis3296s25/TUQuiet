import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import backArrow from "../assets/backArrow.png";
import StudySpotCard from "../components/StudySpotCard";

function StudySpotsInBuilding() {
  const { BuildingId } = useParams();
  const location = useLocation();
  console.log(location);
  const building = location.state.building;
  console.log(building);

  const spotsByBuilding = {
    1: [
      { id: "1", name: "First Floor Lounge" }, 
      { id: "2", name: "Main Study Area" },
      { id: "3", name: "Quiet Room" },
      { id: "4", name: "Open Seating Near Windows" },
    ],
    2: [
      { id: "1", name: "Paley Library - Ground Floor" },
      { id: "2", name: "Paley Library - Silent Study Zone" },
      { id: "3", name: "Paley Library - Group Study Room A" },
      { id: "4", name: "Paley Library - Basement Study Pods" },
      { id: "5", name: "Paley Library - Third Floor Nook" },
    ],
    3: [
      { id: "1", name: "TECH Center - Open Lab" },
      { id: "2", name: "TECH Center - Booths" },
      { id: "3", name: "TECH Center - Media Editing Rooms" },
      { id: "4", name: "TECH Center - Collaboration Hub" },
      { id: "5", name: "TECH Center - Third Floor Quiet Space" },
    ],
    4: [
      { id: "1", name: "Tuttleman Learning Center - First Floor Tables" },
      { id: "2", name: "Tuttleman Learning Center - Lounge" },
      { id: "3", name: "Tuttleman Learning Center - Second Floor Cubicles" },
    ],
    5: [
      { id: "1", name: "Howard Gittis Student Center - Food Court Tables" },
      { id: "2", name: "Howard Gittis Student Center - Quiet Study Area" },
      { id: "3", name: "Howard Gittis Student Center - Second Floor Lounge" },
      { id: "4", name: "Howard Gittis Student Center - Balcony Seating" },
    ],
    6: [
      { id: "1", name: "Alter Hall - First Floor Commons" },
      { id: "2", name: "Alter Hall - Second Floor Study Lounge" },
      { id: "3", name: "Alter Hall - MBA Lounge" },
      { id: "4", name: "Alter Hall - Rooftop Study Deck" },
    ],
  };

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
        <h1 className="font-bold text-4xl">{building?.name || "Building"} - Pick a spot to begin a TUQuiet Report</h1>
      </div>
      <div className="mt-10">
        <img src={building.img} className="border-1 rounded-xl w-[1000px] " />
      </div>
      <h1 className="mt-8 mb-4 font-bold text-2xl">Study Spots</h1>
      <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 max-w-[1000px] ">
        {spotsByBuilding[BuildingId].map((spot) => (
          <StudySpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}

export default StudySpotsInBuilding;
