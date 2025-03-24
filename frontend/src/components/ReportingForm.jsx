import React, { useState } from "react";

function ReportingForm({ spot }) {
  const [noiseLevel, setNoiseLevel] = useState(1);
  const [crowdLevel, setCrowdLevel] = useState(1);
  const [description, setDescription] = useState("");

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
    //make POST Call here and take user to form page
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

          <label className="mt-2">Description</label>
          <br />
          <input
            type="text"
            maxLength="256"
            onChange={updateDescription}
            className="input mt-2 h-15"
            placeholder="Type Here"
          />
          <br />

          <button
            type="submit"
            className="btn  btn-error mt-4 "
            onClick={handleFormSubmission}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default ReportingForm;
