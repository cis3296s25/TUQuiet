import React from "react";
import BuildingCard from "../components/BuildingCard";

function Buildings() {
  const buildingList = [
    {
      id: 1,
      name: "Charles Library",
      description: "Main Campus Library",
      img: "https://www.architecturalrecord.com/ext/resources/Issues/2020/11-November/Charles-Library-01-B.jpg?1604349861",
    },
    {
      id: 2,
      name: "Paley Hall",
      description:
        "Former main library, now repurposed for study spaces and classrooms.",
      img: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
      id: 3,
      name: "TECH Center",
      description:
        "Temple’s primary student technology hub with computer labs and group study rooms.",
      img: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
      id: 4,
      name: "Tuttleman Learning Center",
      description:
        "Academic building with various study areas and tutoring services.",
      img: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
      id: 5,
      name: "Howard Gittis Student Center",
      description:
        "Temple’s central student hub featuring lounges, dining, and quiet study areas.",
      img: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
      id: 6,
      name: "Alter Hall",
      description:
        "Home to the Fox School of Business, with study lounges and a rooftop deck.",
      img: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
  ];

  return (
    <div className="p-10">
      <h1 className="font-bold text-4xl mt-5 mb-10">Find A Place To Study</h1>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 max-w-[1200px]">
        {buildingList.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>
    </div>
  );
}

export default Buildings;
