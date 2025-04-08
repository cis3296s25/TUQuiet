import React from "react";
import { formatRelativeTime } from "../utils/formatTime";

// Temple University colors
const TEMPLE_CHERRY = "#9E1B34";
const TEMPLE_GRAY = "#A7A9AC";

function RecommendedSpotCard({ spot, rank }) {
  return (
    <div className="relative mb-6">
      {/* Rank indicator */}
      <div className="badge absolute -top-2 -left-2 z-10 w-8 h-8 flex items-center justify-center text-lg font-bold text-white" 
           style={{ backgroundColor: TEMPLE_CHERRY }}>
        {rank}
      </div>
      
      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 border border-opacity-20 transform hover:-translate-y-1 overflow-hidden"
           style={{ borderColor: TEMPLE_CHERRY }}>
        {/* Left accent border */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: TEMPLE_CHERRY }}></div>
        
        <div className="card-body p-4">
          <div className="flex justify-between items-start">
            <h3 className="card-title text-lg" style={{ color: TEMPLE_CHERRY }}>{spot.name}</h3>
          </div>
          
          <div className="badge badge-outline mb-2">{spot.buildingName}</div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="bg-base-300 p-3 rounded-lg">
              <span className="text-sm font-medium mb-2">Noise Level:</span>
              <div className="flex items-center mt-1">
                <progress 
                  className="progress w-full mr-2" 
                  value={spot.averageNoiseLevel} 
                  max="5"
                  style={{ "--value-color": TEMPLE_CHERRY }}
                ></progress>
                <span className="badge" style={{ backgroundColor: TEMPLE_CHERRY, color: "white" }}>{spot.averageNoiseLevel}</span>
              </div>
            </div>
            
            <div className="bg-base-300 p-3 rounded-lg">
              <span className="text-sm font-medium mb-2">Crowd Level:</span>
              <div className="flex items-center mt-1">
                <progress 
                  className="progress w-full mr-2" 
                  value={spot.averageCrowdLevel} 
                  max="5"
                  style={{ "--value-color": TEMPLE_GRAY }}
                ></progress>
                <span className="badge" style={{ backgroundColor: TEMPLE_GRAY, color: "black" }}>{spot.averageCrowdLevel}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-end gap-2 mt-3">
            <div className="badge badge-neutral">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {spot.reportCount} report{spot.reportCount !== 1 ? 's' : ''}
            </div>
            {spot.lastReportTime && (
              <div className="badge badge-outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatRelativeTime(spot.lastReportTime)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendedSpotCard;
