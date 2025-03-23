import React from "react";
import { Link } from "react-router-dom";

function StudySpotCard({ spot }) {
  return (
    <Link>
      <div className="border-1 rounded-md border-white max-w-100 h-25">
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-4">{spot.name}</h2>
        </div>
      </div>
    </Link>
  );
}

export default StudySpotCard;
