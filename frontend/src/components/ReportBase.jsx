import React from "react";

function ReportBase({ name, image, link, crowdLevel, noiseLevel }) {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-lg p-4">
      <img src={image} alt={name} className="w-full h-40 object-cover rounded-xl" />
      <h2 className="text-xl text-gray-700 font-semibold mt-2">{name}</h2>
      <div className="mt-2">
        <p className="text-gray-700">Crowd Level: <span className="font-bold">{crowdLevel}</span></p>
        <p className="text-gray-700">Noise Level: <span className="font-bold">{noiseLevel}</span></p>
      </div>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-center w-full"
      >
        Submit a Report
      </a>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-center w-full"
      >
        Reserve a Room
      </a>
    </div>
  );
}

export default ReportBase;
