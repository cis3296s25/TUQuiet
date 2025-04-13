// Buildings.jsx
import { useState, useEffect } from "react";
import BuildingCard from "../components/BuildingCard"; // Adjust path if needed

function Buildings() {
  const [buildings, setBuildings] = useState([]); // State for fetched data
  const [isLoading, setIsLoading] = useState(true); // State for loading status

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("http://localhost:8080/buildings");
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <div className="p-10">
      <h1 className="font-bold text-4xl text-[#424242] dark:text-white mt-5 mb-10">
        Find A Place To Study
      </h1>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 max-w-[1200px]">
        {isLoading ? (
          // Show skeletons while loading
          <>
            <div className="skeleton h-68 w-full"></div>
          </>
        ) : Array.isArray(buildings) ? (
          // Show cards when data is loaded
          buildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))
        ) : (
          // fallback if buildings is not an array (fetch failed)
          <p className="text-red-500">Failed to load buildings.</p>
        )}
      </div>
    </div>
  );
}

export default Buildings;
