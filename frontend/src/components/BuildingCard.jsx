import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PredictionChart from "./PredictionChart";

function BuildingCard({ building, predictionOverride = null }) {
  const [predictionData, setPredictionData] = useState([]);

  useEffect(() => {
    if (predictionOverride) {
      setPredictionData(predictionOverride);
      return;
    }

    fetch(`/api/reports/predictions/${building.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Prediction data received:", data);
        setPredictionData(data);
      })
      .catch((err) => console.error("Prediction fetch error:", err));
  }, [building.id, predictionOverride]);


  return (
    <Link to={`/Building/${building.id}`} state={{ building }} data-testid="building-spot-card">
      <div className="border-1 rounded-lg overflow-hidden border-none dark:bg-[#171717] bg-[#f4f4f4]">
        <img src={building.img} className="w-full h-80 object-cover" alt={building.name} />
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-4 line-clamp-1">{building.name}</h2>
          <p className="mb-2">{building.description}</p>
          <PredictionChart data={predictionData} data-testid="prediction-chart" />
        </div>
      </div>
    </Link>
  );
}

export default BuildingCard;
