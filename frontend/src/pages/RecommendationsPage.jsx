import React, { useState } from "react";
import FeedList from "../components/FeedList";
import RecommendationList from "../components/RecommendationList";
import { mockFeedData } from "../mockData/feedData"; // needs to be replaced with api call
import { mockRecommendationData } from "../mockData/recommendationData"; // needs to be replaced with api call

// Temple University colors
const TEMPLE_CHERRY = "#9E1B34";
const TEMPLE_CHERRY_LIGHT = "#C13A51";
const TEMPLE_GRAY = "#A7A9AC";

function RecommendationsPage() {
  const [feedData] = useState(mockFeedData);
  const [recommendationData, setRecommendationData] = useState(mockRecommendationData);
  const [filterType, setFilterType] = useState("combined");
  const [isLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("All Buildings");

  /**
   * Handle filter change for recommendation sorting
   */
  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
    
    if (newFilterType === "noise") {
      setRecommendationData([...mockRecommendationData].sort((a, b) => a.averageNoiseLevel - b.averageNoiseLevel));
    } else if (newFilterType === "crowd") {
      setRecommendationData([...mockRecommendationData].sort((a, b) => a.averageCrowdLevel - b.averageCrowdLevel));
    } else {
      // Combined sorting (average of noise and crowd)
      setRecommendationData([...mockRecommendationData].sort((a, b) => {
        const aAvg = (a.averageNoiseLevel + a.averageCrowdLevel) / 2;
        const bAvg = (b.averageNoiseLevel + b.averageCrowdLevel) / 2;
        return aAvg - bAvg;
      }));
    }
  };

  /**
   * Handle building filter change
   */
  const handleBuildingChange = (e) => {
    setSelectedBuilding(e.target.value);
    // In a real implementation, this would filter the data based on the selected building
  };

  // Button styles based on filter type
  const getButtonStyle = (buttonType) => {
    if (buttonType === filterType) {
      return {
        backgroundColor: TEMPLE_CHERRY,
        borderColor: TEMPLE_CHERRY,
        color: "white"
      };
    } else {
      return {
        backgroundColor: "transparent",
        borderColor: TEMPLE_CHERRY,
        color: TEMPLE_CHERRY
      };
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      {/* Feed Column */}
      <div className="w-2/5 flex flex-col border-r border-base-300">
        {/* Fixed Header with Title */}
        <div className="p-4 bg-base-200 sticky top-0 z-10 shadow-md h-[160px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: TEMPLE_CHERRY }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke={TEMPLE_CHERRY}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 7-7-7"
                />
              </svg>
              Recent Reports
            </h2>
            {isLoading && <span className="loading loading-spinner loading-md"></span>}
          </div>
          
          {/* Building Filter */}
          <div className="mb-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Filter by Building</span>
              </label>
              <select 
                className="select select-bordered w-full" 
                value={selectedBuilding}
                onChange={handleBuildingChange}
                style={{ borderColor: TEMPLE_GRAY }}
              >
                <option>All Buildings</option>
                <option>Charles Library</option>
                <option>Tech Center</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Scrollable Feed Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <FeedList feedData={feedData} isLoading={isLoading} />
        </div>
      </div>
      
      {/* Recommendations Column */}
      <div className="w-3/5 flex flex-col">
        {/* Fixed Header with Filters */}
        <div className="p-4 bg-base-200 sticky top-0 z-10 shadow-md h-[160px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: TEMPLE_CHERRY }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke={TEMPLE_CHERRY}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Recommended Study Spaces
            </h2>
            {isLoading && <span className="loading loading-spinner loading-md"></span>}
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <button 
              className="btn btn-sm"
              onClick={() => handleFilterChange("noise")}
              style={getButtonStyle("noise")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 01-1.414-7.071m-2.829 9.9a9 9 0 010-12.728"
                />
              </svg>
              Noise Level
            </button>
            <button 
              className="btn btn-sm"
              onClick={() => handleFilterChange("crowd")}
              style={getButtonStyle("crowd")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Crowd Level
            </button>
            <button 
              className="btn btn-sm"
              onClick={() => handleFilterChange("combined")}
              style={getButtonStyle("combined")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Combined
            </button>
          </div>
          
          <div className="badge badge-lg text-white" style={{ backgroundColor: TEMPLE_CHERRY }}>
            {filterType === "noise" && "Sorted by noise level (quietest first)"}
            {filterType === "crowd" && "Sorted by crowd level (least crowded first)"}
            {filterType === "combined" && "Sorted by combined noise and crowd levels"}
          </div>
        </div>
        
        {/* Scrollable Recommendations Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <RecommendationList recommendationData={recommendationData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default RecommendationsPage;
