import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PredictionChart from "./PredictionChart";

function BuildingCard({ building }) {
  const [predictionData, setPredictionData] = useState([]);

  // fetch prediction data from backend
  useEffect(() => {
    fetch(`http://localhost:8080/api/reports/predictions/${building.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Prediction data received:", data); 
        setPredictionData(data);
      })
      .catch((err) => console.error("Prediction fetch error:", err));
  }, [building.id]);

  return (
    <Link to={`/Building/${building.id}`} state={{ building }}>
      <div className="border-1 rounded-lg overflow-hidden border-none max-w-100 bg-[#2f2f2f] light:bg-[#f4f4f4]">
        <img src={building.img} className="w-full h-50 object-cover" alt={building.name} />
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-4">{building.name}</h2>
          <p className="mb-2">{building.description}</p>

          {/* Show prediction chart */}
          <PredictionChart data={predictionData} />
        </div>
      </div>
    </Link>
  );
}

export default BuildingCard;
