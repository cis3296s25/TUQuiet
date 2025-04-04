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
      <h1 className="font-bold text-2xl ">{spot.name} - Report</h1>

      <div className="ml-1">
      <form onSubmit={handleFormSubmission} className="p-5 border-1 rounded-xl max-w-100">
      <label className="text-xl">Noise Level:</label>
          <br />
          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="noise-1"
            name="Noise Level"
            value="1"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2 pt-2" htmlFor="noise-1">1</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="noise-2"
            name="Noise Level"
            value="2"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2" htmlFor="noise-2">2</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="noise-3"
            name="Noise Level"
            value="3"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2" htmlFor="noise-3">3</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="noise-4"
            name="Noise Level"
            value="4"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2" htmlFor="noise-4">4</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="noise-5"
            name="Noise Level"
            value="5"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2" htmlFor="noise-5">5</label>
          <br />

          <label className="text-xl">Crowd Level:</label>
          <br />
          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="crowd-1"
            name="Crowd Level"
            value="1"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2" htmlFor="crowd-1">1</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="crowd-2"
            name="Crowd Level"
            value="2"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2" htmlFor="crowd-2">2</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="crowd-3"
            name="Crowd Level"
            value="3"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2" htmlFor="crowd-3">3</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="crowd-4"
            name="Crowd Level"
            value="4"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2" htmlFor="crowd-4">4</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="crowd-5"
            name="Crowd Level"
            value="5"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2" htmlFor="crowd-5">5</label>
          <br />

        
          <br />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-error mt-4"
            onClick={handleFormSubmission}
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
