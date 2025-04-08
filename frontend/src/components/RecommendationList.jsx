import React from "react";
import RecommendedSpotCard from "./RecommendedSpotCard";

function RecommendationList({ recommendationData, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (recommendationData.length === 0) {
    return (
      <div className="alert alert-info">
        <div>
          <span>No recommendations available.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendationData.map((spot, index) => (
        <RecommendedSpotCard key={spot.id} spot={spot} rank={index + 1} />
      ))}
    </div>
  );
}

export default RecommendationList;
