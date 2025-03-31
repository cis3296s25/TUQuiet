import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportingForm({ spot, onSubmit }) {
  const [noiseLevel, setNoiseLevel] = useState(1);
  const [crowdLevel, setCrowdLevel] = useState(1);
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
    setIsSubmitting(true);
    setError(null);
    
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
        onSubmit();
      }
      
      // Navigate back with state to trigger refresh
      navigate(0, {
        state: {
          formSubmitted: true,
          spotId: spot.id
        }
      });
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
        <form className=" p-5 border-1 rounded-xl max-w-100">
          <label className="text-xl">Noise Level:</label>
          <br />
          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="1"
            name="Noise Level"
            value="1"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2 pt-2">1</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="2"
            name="Noise Level"
            value="2"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2">2</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="3"
            name="Noise Level"
            value="3"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2">3</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="4"
            name="Noise Level"
            value="4"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2">4</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="5"
            name="Noise Level"
            value="5"
            onChange={updateNoiseLevel}
          />
          <label className="ml-2">5</label>
          <br />

          <label className="text-xl">Crowd Level:</label>
          <br />
          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="1"
            name="Crowd Level"
            value="1"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2">1</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="2"
            name="Crowd Level"
            value="2"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2">2</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="3"
            name="Crowd Level"
            value="3"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2">3</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="4"
            name="Crowd Level"
            value="4"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2">4</label>
          <br />

          <input
            className="radio mt-2"
            required={true}
            type="radio"
            id="5"
            name="Crowd Level"
            value="5"
            onChange={updateCrowdLevel}
          />
          <label className="ml-2">5</label>
          <br />

          {/* <label className="mt-2">Description</label>
          <br />
          <input
            type="text"
            maxLength="256"
            onChange={updateDescription}
            className="input mt-2 h-15"
            placeholder="Type Here"
          /> */}
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
