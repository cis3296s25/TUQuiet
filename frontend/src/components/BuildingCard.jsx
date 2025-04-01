import { Link } from "react-router-dom";

function BuildingCard({ building }) {
  return (
    <Link to={`/Building/${building.id}`} state={{ building }}>
      <div className="border-1 rounded-sm border-white max-w-100">
        <img src={building.img} className="w-full h-50 object-cover " />
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-4">{building.name}</h2>
        </div>
      </div>
    </Link>
  );
}

export default BuildingCard;
