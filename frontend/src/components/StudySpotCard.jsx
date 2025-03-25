import { useState } from "react";
import ReportingForm from "./ReportingForm"; // Import your form component

const SpotCard = ({ spot, averages }) => {
  const [showForm, setShowForm] = useState(false);
  
  // Format the averages for display
  const noiseLevel = averages?.averageNoiseLevel || "N/A";
  const crowdLevel = averages?.averageCrowdLevel || "N/A";
  const reportCount = averages?.reportCount || 0;

  return (
    <div className="relative">
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <ReportingForm spot={spot} onSubmit={() => setShowForm(false)} />
            {/* For some reason clicking submit does not close form, needs to be looked into but to me it does seem like it would work */}
          </div>
        </div>
      )}

      <div
        className="border-1 rounded-md border-white max-w-100 cursor-pointer"
        onClick={() => setShowForm(true)}
      >
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-2">{spot.name}</h2>
          
          {/* Add noise and crowd level display */}
          <div className="mt-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Noise:</span>
              <span className="font-medium">{noiseLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Crowd:</span>
              <span className="font-medium">{crowdLevel}</span>
            </div>
            {reportCount > 0 && (
              <div className="text-xs text-gray-500 mt-1 text-right">
                Based on {reportCount} report{reportCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotCard;
