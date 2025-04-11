import React from "react";
import { formatRelativeTime } from "../utils/formatTime";

// Temple University colors
const TEMPLE_CHERRY = "#9E1B34";
const TEMPLE_GRAY = "#A7A9AC";

function FeedItem({ report }) {
  return (
    <div className="relative mb-6">
      <div className="card bg-[#171717] shadow-xl hover:shadow-2xl transition-all duration-300 border border-opacity-20 transform hover:-translate-y-1 overflow-hidden" style={{ borderColor: TEMPLE_CHERRY }}>
        {/* Left accent border */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: TEMPLE_CHERRY }}></div>
        
        <div className="card-body p-4">
          <div className="flex justify-between items-start">
            <h3 className="card-title text-lg text-white">{report.locationName}</h3>
            <span className="badge" style={{ backgroundColor: TEMPLE_GRAY, color: "black" }}>
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
              {formatRelativeTime(report.timestamp)}
            </span>
          </div>
          
          <div className="badge badge-outline mb-2">{report.buildingName}</div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="bg-[#212121] p-3 rounded-lg">
              <span className="text-sm font-medium mb-2">Noise Level:</span>
              <div className="flex items-center mt-1">
                <progress 
                  className="progress w-full mr-2" 
                  value={report.noiseLevel} 
                  max="5"
                  style={{ "--value-color": TEMPLE_CHERRY }}
                ></progress>
                <span className="badge" style={{ backgroundColor: TEMPLE_CHERRY, color: "white" }}>{report.noiseLevel}</span>
              </div>
            </div>
            
            <div className="bg-[#212121] p-3 rounded-lg">
              <span className="text-sm font-medium mb-2">Crowd Level:</span>
              <div className="flex items-center mt-1">
                <progress 
                  className="progress w-full mr-2" 
                  value={report.crowdLevel} 
                  max="5"
                  style={{ "--value-color": TEMPLE_GRAY }}
                ></progress>
                <span className="badge" style={{ backgroundColor: TEMPLE_GRAY, color: "black" }}>{report.crowdLevel}</span>
              </div>
            </div>
          </div>
          
          {report.description && (
            <div className="bg-[#212121] p-3 rounded-lg text-sm italic border-l-4" style={{ borderColor: TEMPLE_CHERRY }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke={TEMPLE_CHERRY}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              "{report.description}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedItem;
