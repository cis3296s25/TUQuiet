import React from "react";
import FeedItem from "./FeedItem";

function FeedList({ feedData, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" data-testid="loading-spinner"></span>
      </div>
    );
  }

  if (feedData.length === 0) {
    return (
      <div className="alert alert-info">
        <div>
          <span>No reports available.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedData.map(report => (
        <FeedItem key={report.id} report={report} />
      ))}
    </div>
  );
}

export default FeedList;
