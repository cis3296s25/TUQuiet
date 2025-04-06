import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportingForm({ spot, onSubmit }) {
  const [noiseLevel, setNoiseLevel] = useState(null);
  const [crowdLevel, setCrowdLevel] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  console.log(`Spot Id = ${spot.id}`);

  function updateNoiseLevel(e) {
    setNoiseLevel(e.target.value);
  }

  function updateCrowdLevel(e) {
    setCrowdLevel(e.target.value);
  }

  function updateDescription(e) {
    setDescription(e.target.value);
    //figure out a way to debug this so it doesn't call every letter typed
  }

  function handleFormSubmission(e) {
    e.preventDefault();
    setError(null);

    // validation
    if (!noiseLevel || !crowdLevel) {
      setError("Please select both noise level and crowd level.");
      return;
    }

    setIsSubmitting(true);
    
    // Create report data
    const reportData = {
      locationId: spot.id,
      noiseLevel: parseInt(noiseLevel),
      crowdLevel: parseInt(crowdLevel),
      description: description
    };
    
    // Send POST request to backend
    fetch('http://localhost:8080/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      
      // Call onSubmit to close the form
      if (onSubmit) {
        onSubmit({
            success: true,
            data: data,
          });
      }
      
      setIsSubmitting(false);
      setNoiseLevel(1);
      setCrowdLevel(1);
      setDescription("");
    })
    .catch(error => {
      console.error('Error submitting report:', error);
      setError('Failed to submit report. Please try again.');
      setIsSubmitting(false);
    });
  }

  return (
    <>
    <h1 className="font-bold text-2xl text-gray-900 light:bg-[#ffffff] p-6 dark:text-white mb-4">
      {spot.name} - Report
    </h1>
  
    <div className="ml-1">
      <form
        onSubmit={handleFormSubmission}
        className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6 overflow-hidden text-gray-900 dark:text-white"
      >
        <div className="mb-4">
          <label className="text-xl">Noise Level:</label>
          <div className="flex gap-4 mt-2">
            {[1, 2, 3, 4, 5].map(level => (
              <label key={`noise-${level}`} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="Noise Level"
                  value={level}
                  onChange={updateNoiseLevel}
                  required
                />
                {level}
              </label>
            ))}
          </div>
        </div>
  
        <div className="mb-4">
          <label className="text-xl">Crowd Level:</label>
          <div className="flex gap-4 mt-2">
            {[1, 2, 3, 4, 5].map(level => (
              <label key={`crowd-${level}`} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="Crowd Level"
                  value={level}
                  onChange={updateCrowdLevel}
                  required
                />
                {level}
              </label>
            ))}
          </div>
        </div>
  
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
  
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  </>
  
  );
}

export default ReportingForm;
