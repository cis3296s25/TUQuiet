import * as React from "react"
import StudyGroupCard from "../components/StudyGroupCard";
import { Button } from "@/components/ui/button"


const mockData = [
    {
      id: "group1",
      courseCode: "CIS 3296",
      postedAt: "2025-04-08T17:45:00",
      name: "Gino Russo",
      major: "Comp Sci",
      title: "Software Design Final Exam",
      description: "Go over stuff from previous quizzes and tests",
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
    },
    {
      id: "group2",
      courseCode: "MATH 2043",
      major: "Math",
      postedAt: "2025-04-09T12:00:00",
      name: "Alex Carter",
      title: "Calculus III Review",
      description: "Practice problems for the final exam",
      date: "2025-04-11",
      time: "14:00",
      location: "Science Education Building, Room 204",
      participantsCurrent: 2,
      participantsMax: 5,
      comments: [
        {
          id: "comment2",
          author: "Sam Lee",
          timestamp: "2025-04-09T13:30:00",
          content: "Can we focus on vector calculus?",
        },
      ],
      likes: 4,
    },
    {
      id: "group3",
      courseCode: "ENG 0802",
      postedAt: "2025-04-07T09:15:00",
      name: "Maya Patel",
      major: "Comp Sci",
      title: "Analytical Reading Group",
      description: "Discuss assigned readings and essay prep",
      date: "2025-04-12",
      time: "10:00",
      location: "Tuttleman Learning Center, Room 305",
      participantsCurrent: 4,
      participantsMax: 8,
      comments: [],
      likes: 1,
    },
  ];
  
  function StudyGroup() {
    return (
    <>
        <Button className="font-bold p4 ml-5 mt-5">Create Study Group</Button>
        <div className="p-4 space-y-5">
        {mockData.map((object) => (<StudyGroupCard key={object.id} group={object} />)) }
        </div>
    </>)
  }

export default StudyGroup;
