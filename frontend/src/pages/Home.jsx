import React from "react";
import BuildingCard from "../components/BuildingCard";
import StudyGroupCard from "../components/StudyGroupCard";
import StudySpotCard from "../components/StudySpotCard";
import { Button } from "@/components/ui/button";

// --- Mock Data Objects --- //

const mockBuilding = {
  id: "building1",
  name: "Temple University Library",
  description:
    "A quiet, modern space designed with study in mind—featuring real-time popularity data similar to heat maps.",
  img: "https://cdn10.phillymag.com/wp-content/uploads/sites/3/2019/09/temple-exterior.jpg", 
};

const mockPredictionData = [
  { time: "08:00", noise: 2, crowd: 3 },
  { time: "10:00", noise: 4, crowd: 5 },
  { time: "12:00", noise: 3, crowd: 4 },
  { time: "14:00", noise: 2, crowd: 3 },
  { time: "16:00", noise: 3, crowd: 4 },
  { time: "18:00", noise: 4, crowd: 5 },
  { time: "20:00", noise: 2, crowd: 3 },
  { time: "22:00", noise: 1, crowd: 2 },
];


const mockStudyGroup = {
  id: "group1",
  courseCode: "CIS 3296",
  postedAt: "2025-04-08T17:45:00",
  name: "Gino Russo",
  major: "Comp Sci",
  title: "Software Design Final Exam",
  description:
    "Join us to review past tests and quizzes, and collaborate on project ideas for a comprehensive study session.",
  date: "2025-04-10",
  time: "18:30",
  location: "Anderson Hall, Room 108",
  participantsCurrent: 3,
  participantsMax: 6,
  comments: [
    {
      id: "comment1",
      author: "Jamie Smith",
      timestamp: "2025-04-10T10:04:00",
      content: "I'll bring my notes!",
    },
  ],
  likes: 2,
};

const mockStudySpots = [
  {
    spot: {
      id: "spot1",
      name: "Quiet Corner - TECH",
      description: "Low foot traffic. Ideal for deep work.",
      img: "https://cdn10.phillymag.com/wp-content/uploads/sites/3/2019/09/temple-exterior.jpg",
    },
    averages: {
      averageNoiseLevel: 2.3,
      averageCrowdLevel: 2.8,
      reportCount: 15,
      lastReportTime: "2025-04-12 14:32:00.000000",
    },
  },
  {
    spot: {
      id: "spot2",
      name: "4th Floor Paley",
      description: "Silent study. Great views of campus.",
      img: "https://via.placeholder.com/400x200",
    },
    averages: {
      averageNoiseLevel: 1.2,
      averageCrowdLevel: 2.1,
      reportCount: 22,
      lastReportTime: "2025-04-12 15:05:00.000000",
    },
  },
  {
    spot: {
      id: "spot3",
      name: "Library Basement",
      description: "Cool & quiet — fewer people go here.",
      img: "https://via.placeholder.com/400x200",
    },
    averages: {
      averageNoiseLevel: 2.8,
      averageCrowdLevel: 4.2,
      reportCount: 18,
      lastReportTime: "2025-04-12 15:15:00.000000",
    },
  },
  {
    spot: {
      id: "spot4",
      name: "Science Ed Lounge",
      description: "Chill vibe. Some discussion groups.",
      img: "https://via.placeholder.com/400x200",
    },
    averages: {
      averageNoiseLevel: 3.5,
      averageCrowdLevel: 3.9,
      reportCount: 9,
      lastReportTime: "2025-04-12 14:10:00.000000",
    },
  },
  {
    spot: {
      id: "spot5",
      name: "Engineering Lobby",
      description: "Bit noisy at times. Best with headphones.",
      img: "https://via.placeholder.com/400x200",
    },
    averages: {
      averageNoiseLevel: 4.2,
      averageCrowdLevel: 4.8,
      reportCount: 25,
      lastReportTime: "2025-04-12 14:58:00.000000",
    },
  },
  {
    spot: {
      id: "spot6",
      name: "Student Center Atrium",
      description: "Busy but spacious. Natural light is nice.",
      img: "https://via.placeholder.com/400x200",
    },
    averages: {
      averageNoiseLevel: 3.8,
      averageCrowdLevel: 4.0,
      reportCount: 30,
      lastReportTime: "2025-04-12 15:30:00.000000",
    },
  },
];


const mockAverages = {
  averageNoiseLevel: 2.5,
  averageCrowdLevel: 3.5,
  reportCount: 12, // optional
  lastReportTime: "2025-04-12 15:42:00.000000" // optional
};




function Home() {
  return (
    <div>
      
      <section className="bg-[#7a0926] text-white py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-8xl font-bold mb-4"><span style={{ fontFamily: "Bumbbled" }}>Welcome</span> to TUQuiet</h1>
          <p className="text-lg mb-8">
            Find the quietest study spots, check real-time popularity data, and
            join a social feed to connect with fellow students for collaborative
            study sessions.
          </p>
          <Button className="bg-white text-[#ce1141] hover:bg-gray-100">
            Get Studying
          </Button>
        </div>
      </section>

      
      <section className="py-16 px-5 ">
        <div className="max-w-[2000px] mx-auto ">
          <h2 className="text-4xl font-bold text-center mb-10">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-50">
           
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4">
                Real-Time Popularity
              </h3>
              <p className="text-center mb-4">
                See predictive data similar to Google’s heat maps showing the times
                study spots are will be quitest.
              </p>
              
              <div className="pointer-events-none">
              <BuildingCard building={mockBuilding} predictionOverride={mockPredictionData} />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4">
                Social Study Groups
              </h3>
              <p className="text-center mb-4">
                Create or join study group posts and connect with classmates for
                collaborative learning.
              </p>
              <StudyGroupCard group={mockStudyGroup} />
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4">
                Quiet Spots Ranking
              </h3>
              <p className="text-center mb-4 ">
                Read user-generated reports ranking study spots from the quietest
                to the loudest to help you choose the best place to focus.
              </p>
              <div className="grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-4 pointer-events-none">
              
                {mockStudySpots.map(({ spot, averages }) => (
                  <StudySpotCard
                    key={spot.id}
                    spot={spot}
                    averages={averages}
                    onFormSubmit={() => {}}
                    isLoadingAverages={false}
                    disableNavigation={true}
                  />
                ))}


              </div>
            </div>
          </div>
        </div>
      </section>

     
      <footer className="bg-[#555555] py-6 text-center">
        <p className="text-sm text-gray-1000">
         Built by Andrew Coffman, Gino Russo, John Currie, Roland Guy, Hyunsoo Jin
        </p>
      </footer>
    </div>
  );
}

export default Home;
