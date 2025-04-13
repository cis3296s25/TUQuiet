import * as React from "react"
import StudyGroupCard from "../components/StudyGroupCard";
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"


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
    const [searchTerm, setSearchTerm] = React.useState("");

    // simulate fetching data from backend
    React.useEffect(() => {
      setTimeout(() => {
        setStudyGroups(mockData);
      }, 500);
    }, []);

    const addStudyGroup = (newGroup) => {
      fetch('http://localhost:8080/api/studyGroups/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGroup),
          })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
      
              toast.success("Study Group Posted", {
                description: newGroup.postedAt,
              })
      
            })
            .catch(error => {
              console.error('Error submitting study group:', error);
              setError('Failed to submit study group. Please try again.');
              setIsSubmitting(false);
            });
    };

    //LIKES AND COMMENTS WILL ALSO NEED SEPERATE POSTS, THAT WILL BE DONE INN STUDY GROUP CARD




    const filteredStudyGroups = studyGroups.filter((group) => {
      const term = searchTerm.toLowerCase();
      return (
        group.title.toLowerCase().includes(term) ||
        group.courseCode.toLowerCase().includes(term) ||
        group.major.toLowerCase().includes(term) 


      )
    });

    
    return (
    <>
    <div className="flex justify-center w-full ">
      <div className="flex flex-col w-full max-w-[2000px] min-w-[800px] ">

        <div className="w-[95%] mt-8 mb-2  space-y-7 ml-5">

          <Popover>
            <PopoverTrigger><Button>Create A Study Group Post</Button></PopoverTrigger>
            <PopoverContent className="w-150 bg-zinc-800" ><StudyGroupForm onSubmit={addStudyGroup}/></PopoverContent>
          </Popover>

          <Input placeholder="Try searching by title, course number, or major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-200"
          ></Input>
        </div>
        
        <div className="p-4 space-y-5">
          {filteredStudyGroups.map((object) => (<StudyGroupCard key={object.id} group={object} />)) }
        </div>
        </div>
        </div>
    </>)
  }

export default StudyGroup;
