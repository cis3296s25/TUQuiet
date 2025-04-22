import React, { useState, useEffect } from "react";
import FeedList from "../components/FeedList";
import RecommendationList from "../components/RecommendationList";
// import { mockFeedData } from "../mockData/feedData"; // Removed unused import
import { getApiUrl } from "../utils/apiService";

// Temple University colors
const TEMPLE_CHERRY = "#9E1B34";
const TEMPLE_CHERRY_LIGHT = "#C13A51";
const TEMPLE_GRAY = "#A7A9AC";

function RecommendationsPage() {

  const [feedData, setFeedData] = useState([]);
  const [recommendationData, setRecommendationData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // used for resorting
  const [filterType, setFilterType] = useState("combined"); //combined, noise, or crowd
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("0");


  useEffect(() => {
      const fetchFeed = async () => {
        try {
          const response = await fetch(getApiUrl(`api/reports/feed/${selectedBuilding}`));
          if (!response.ok) {
            console.error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
            setFeedData([]);
            return;
          }
          const data = await response.json();
          console.log("Feed data:", data);
          setFeedData(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Failed fetching feed with error: ", error);
          setFeedData([]);
        }
      }
      fetchFeed();
    }, [selectedBuilding]
  );

  // api call
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(getApiUrl("api/reports/recommendations"));
        if (!res.ok) {
          console.error(`Failed to fetch recommendations: ${res.status} ${res.statusText}`);
          setOriginalData([]);
          setRecommendationData([]);
          return;
        }
        const data = await res.json();
        console.log("Recommendations data:", data);
        const validData = Array.isArray(data) ? data : [];
        setOriginalData(validData);
        setRecommendationData(sortByFilter(validData, filterType));
      } catch (err) {
        console.error("Error fetching data for recommended spots", err);
        setOriginalData([]);
        setRecommendationData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [filterType]);

  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType); //update filter selected
    setRecommendationData(sortByFilter(originalData, newFilterType)); //re sort using full data
  };

  const sortByFilter = (data, filter) => {
    // spread syntax so the og array is untouched
    return [...data].sort((a, b) => {
      if (filter === "noise") return a.averageNoiseLevel - b.averageNoiseLevel; //basic sorting on array
      if (filter === "crowd") return a.averageCrowdLevel - b.averageCrowdLevel;

      // Combined average sort
      const aAvg = (a.averageNoiseLevel + a.averageCrowdLevel) / 2;
      const bAvg = (b.averageNoiseLevel + b.averageCrowdLevel) / 2;
      return aAvg - bAvg;
    });
  };

  /**
   * Handle building filter change
   */
  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);
    
    // Let the fetchFeed function handle updating the feed data
    // This will trigger the useEffect that fetches feed data
    
    // Filter recommendation data based on selected building
    if (buildingId === "0") {
      // Use the original data from the API
      setRecommendationData(sortByFilter([...originalData], filterType));
    } else {
      // Filter the original data by building ID
      const filteredData = originalData.filter(
        (spot) => spot.buildingId === parseInt(buildingId)
      );
      setRecommendationData(sortByFilter([...filteredData], filterType));
    }
  };

  // Button styles based on filter type
  const getButtonStyle = (buttonType) => {
    if (buttonType === filterType) {
      return {
        backgroundColor: TEMPLE_CHERRY,
        borderColor: TEMPLE_CHERRY,
        color: "white",
      };
    } else {
      return {
        backgroundColor: "transparent",
        borderColor: TEMPLE_CHERRY,
        color: TEMPLE_CHERRY,
      };
    }
  };

  return (
    <div className="flex h-screen  flex-col ">
      {/* Feed Column */}
      <div className="w-full flex flex-col border-r border-base-300">
        {/* Fixed Header with Title */}
        <div className="p-4 bg-base-200 sticky top-0 z-99 shadow-md ">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-2xl font-bold flex items-center gap-2"
              
            >
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
            
            {isLoading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
          </div>
          <p className="p-2"> Recent reports will always show the top 5 most recent reports made on TUQuiet.</p>
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
                data-testid="filter-dropdown"
              >
                <option value="0">All Buildings</option>
                <option value="1">Charles Library</option>
                <option value="2">Tech Center</option>
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
      <div className=" flex flex-col">
        {/* Fixed Header with Filters */}
        <div className="p-4 bg-base-200 sticky top-0 z-99 shadow-md over">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-2xl font-bold flex items-center gap-2"
              
            >
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
            {isLoading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
          </div>
          <p className="p-2 pb-7"> View a Ranking of all reported Study spots in one place. 1 being the least crowded and quitest while the the highest ranking will be most likely a ruckus of a study spot. Here you can choose how to rank each spot. Rank by strictly noise, crowd density, or a mix of both. This is your fastest way to find a quiet spot on campus.</p>
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
                  d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 12h.01M9.464 8.464a5 5 0 000 7.072M6.636 5.636a9 9 0 000 12.728"
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

          <div
            className="badge badge-lg text-white"
            style={{ backgroundColor: TEMPLE_CHERRY }}
          >
            {filterType === "noise" && "Sorted by noise level (quietest first)"}
            {filterType === "crowd" &&
              "Sorted by crowd level (least crowded first)"}
            {filterType === "combined" &&
              "Sorted by combined noise and crowd levels"}
          </div>
        </div>

        {/* Scrollable Recommendations Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <RecommendationList
            recommendationData={recommendationData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default RecommendationsPage;
