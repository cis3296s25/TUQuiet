import React from "react";
import { Link, useParams } from "react-router-dom";


function StudySpotCard({ spot }) {
  const {BuildingId} = useParams();

  return (
    <Link to={`/Building/${BuildingId}/spot/${spot.id}`} state={{spot}} >
      <div className="border-1 rounded-md border-white max-w-100 h-25">
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-4">{spot.name}</h2>
        </div>
      </div>
    </Link>
  );
}

export default StudySpotCard;
