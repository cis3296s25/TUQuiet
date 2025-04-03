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
  }

  function handleFormSubmission(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!noiseLevel || !crowdLevel) {
      setError("Please select both noise level and crowd level.");
      return;
    }

    setIsSubmitting(true);

    const reportData = {
      locationId: spot.id,
      noiseLevel: parseInt(noiseLevel),
      crowdLevel: parseInt(crowdLevel),
      description: description
    };

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
      <h1 className="font-bold text-2xl ">{spot.name} - Report</h1>

      <div className="ml-1">
        <form onSubmit={handleFormSubmission} className="p-5 border-1 rounded-xl max-w-100">
          <label className="text-xl">Noise Level:</label><br />
          {[1,2,3,4,5].map(val => (
            <div key={`noise-${val}`}>
              <input
                className="radio mt-2"
                type="radio"
                id={`noise-${val}`}
                name="Noise Level"
                value={val}
                onChange={updateNoiseLevel}
              />
              <label className="ml-2">{val}</label><br />
            </div>
          ))}

          <label className="text-xl mt-4">Crowd Level:</label><br />
          {[1,2,3,4,5].map(val => (
            <div key={`crowd-${val}`}>
              <input
                className="radio mt-2"
                type="radio"
                id={`crowd-${val}`}
                name="Crowd Level"
                value={val}
                onChange={updateCrowdLevel}
              />
              <label className="ml-2">{val}</label><br />
            </div>
          ))}

          <br />
          <textarea
            className="textarea textarea-bordered w-full mt-2"
            placeholder="Additional description..."
            value={description}
            onChange={updateDescription}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-error mt-4"
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