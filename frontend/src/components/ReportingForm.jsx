import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"


function ReportingForm({ spot, onSubmit }) {
  const [noiseLevel, setNoiseLevel] = useState(null);
  const [crowdLevel, setCrowdLevel] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

    if (!noiseLevel || !crowdLevel) {
      setError("Please select both noise level and crowd level.");
      return;
    }

    setIsSubmitting(true);

    const reportData = {
      locationId: spot.id,
      noiseLevel: parseInt(noiseLevel),
      crowdLevel: parseInt(crowdLevel),
      description,
    };

    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        onSubmit?.({ success: true, data });
        setIsSubmitting(false);
        setNoiseLevel(null);
        setCrowdLevel(null);
        setDescription("");

        
      toast.success("Success", {
        description: "Report Successfully Recieved",
      } )

      })
      .catch(error => {
        console.error('Error submitting report:', error);
        setError('Failed to submit report. Please try again.');
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <h1 className="font-bold text-2xl text-gray-900 bg-[#ffffff] dark:bg-[#2b2b2b] dark:text-white mb-4 ml-4 mt-4">
        {spot.name} - Report
      </h1>

      <div className="ml-1">
        <form
          onSubmit={handleFormSubmission}
          data-testid="reporting-form"
          className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6 text-gray-900 dark:text-white"
        >
          <div className="mb-4">
            <label className="text-xl">Noise Level:</label>
            <p className="text-gray-400 whitespace-pre text-sm">1-Silent    5-Very Loud</p>
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
            <label className="text-xl">Crowd Level: </label>
            <p className="text-gray-400 whitespace-pre text-sm">1-Empty   5-Packed</p>
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

          <div className="mb-4">
            <label>Optional Notes: </label>
            <textarea
              value={description}
              onChange={updateDescription}
              className="w-full dark:bg-[#1f1f1f] bg-[#e0e0e0] p-2 rounded text-white mt-1"
              rows={4}
            />
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
