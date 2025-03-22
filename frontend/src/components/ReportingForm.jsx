import React, {useState} from "react";

function ReportingForm({ formBuilding }){

    const[noiseLevel, setNoiseLevel] = useState(1);
    const[crowdLevel, setCrowdLevel] = useState(1);
    const[description, setDescription] = useState('');

    function updateNoiseLevel(e){
        setNoiseLevel(e.target.value);
    }

    function updateCrowdLevel(e){
        setCrowdLevel(e.target.value);
    }

    function updateDescription(e){
        setDescription(e.target.value);
        //figure out a way to debug this so it doesn't call every letter typed
    }

    function handleFormSubmission(){
        //make POST Call here and take user to form page
    }

    return(
        <div>
        <form>
            <label>Noise Level:</label><br/>
            <input required="true" type="radio" id="1" name="Noise Level" value="1" onChange={updateNoiseLevel}/>
            <label>1</label><br/>

            <input required="true" type="radio" id="2" name="Noise Level" value="2" onChange={updateNoiseLevel}/>
            <label>2</label><br/>

            <input required="true" type="radio" id="3" name="Noise Level" value="3" onChange={updateNoiseLevel}/>
            <label>3</label><br/>

            <input required="true" type="radio" id="4" name="Noise Level" value="4" onChange={updateNoiseLevel}/>
            <label>4</label><br/>

            <input required="true" type="radio" id="5" name="Noise Level" value="5" onChange={updateNoiseLevel}/>
            <label>5</label><br/>


            <label>Crowd Level:</label><br/>
            <input required="true" type="radio" id="1" name="Crowd Level" value="1" onChange={updateCrowdLevel}/>
            <label>1</label><br/>

            <input required="true" type="radio" id="2" name="Crowd Level" value="2" onChange={updateCrowdLevel}/>
            <label>2</label><br/>

            <input required="true" type="radio" id="3" name="Crowd Level" value="3" onChange={updateCrowdLevel}/>
            <label>3</label><br/>

            <input required="true" type="radio" id="4" name="Crowd Level" value="4" onChange={updateCrowdLevel}/>
            <label>4</label><br/>

            <input required="true" type="radio" id="5" name="Crowd Level" value="5" onChange={updateCrowdLevel}/>
            <label>5</label><br/>

            <label>Description</label><br/>
            <input type="text" maxLength="256" onChange={updateDescription}/><br/>

            <button type="submit" onClick={handleFormSubmission}>Submit</button>

        </form>
        <div>NoiseLevel {noiseLevel}, CrowdLevel {crowdLevel}, Description: {description}</div>
        </div>
    );
}

export default ReportingForm;