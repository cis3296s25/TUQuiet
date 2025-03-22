import React from "react";
import ReportBase from "./../components/ReportBase.jsx"
import libraryImage from "./../assets/charlesLibrary.jpg"
import techCenterImage from "./../assets/techCenter.jpg"

function NoiseReporting() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Noise Reporting</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ReportBase 
                    name="Charles Library" 
                    image= {libraryImage}
                    link= {null}
                    crowdLevel={"High"}
                    noiseLevel={"Moderate"}
                />
                <ReportBase 
                    name="Tech Center" 
                    image= {techCenterImage}
                    link= {null}
                    crowdLevel={"High"}
                    noiseLevel={"High"}
                />
            </div>
        </div>
    )
}

export default NoiseReporting;