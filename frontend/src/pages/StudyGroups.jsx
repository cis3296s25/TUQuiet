import * as React from "react"
import StudyGroupCard from "../components/StudyGroupCard";
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"


import StudyGroupForm from "../components/StudyGroupForm";

// THIS WILL BE FETCHED FROM DB
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
    const [studyGroups, setStudyGroups] = React.useState([]);

    // simulate fetching data from backend
    React.useEffect(() => {
      setTimeout(() => {
        setStudyGroups(mockData);
      }, 500);
    }, []);



    const addStudyGroup = (newGroup) => {

      //HERE IS WHERE WE WOULD NORMALLY POST newGroup TO BACKEND API
      setStudyGroups((prev) => [newGroup, ...prev]);
      toast.success("Study Group Posted", {
        description: newGroup.postedAt,
      } )
    };

    //LIKES AND COMMENTS WILL ALSO NEED SEPERATE POSTS, THAT WILL BE DONE INN STUDY GROUP CARD




    
    return (
    <>
    <div className="flex justify-center w-full">
      <div className="flex flex-col w-full max-w-[2000px] min-w-[800px] ">
        <div className="ml-9 mt-8 mb-6 flex justify-center">
        <Popover>
          <PopoverTrigger><Button>Create A Study Group Post</Button></PopoverTrigger>
          <PopoverContent className="w-150"><StudyGroupForm onSubmit={addStudyGroup}/></PopoverContent>
        </Popover>
        </div>
        
        <div className="p-4 space-y-5">
          {studyGroups.map((object) => (<StudyGroupCard key={object.id} group={object} />)) }
        </div>
        </div>
        </div>
    </>)
  }

export default StudyGroup;
