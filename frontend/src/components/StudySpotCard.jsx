import { useState } from "react";
import ReportingForm from "./ReportingForm"; // Import your form component

const SpotCard = ({ spot }) => {
  const [showForm, setShowForm] = useState(false);

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
        className="border-1 rounded-md border-white max-w-100 h-25 cursor-pointer"
        onClick={() => setShowForm(true)}
      >
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-4">{spot.name}</h2>
        </div>
      </div>
    </div>
  );
};

export default SpotCard;
