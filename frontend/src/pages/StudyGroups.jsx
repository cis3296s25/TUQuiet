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


var groupData = [];

function StudyGroup() {
  const [studyGroups, setStudyGroups] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    fetchGroups();
  }, []
  );

  const fetchGroups = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/studyGroups/getGroups`);
      groupData = await response.json();
      setStudyGroups(groupData);
    } catch (error) {
      console.error("Failed fetching groups with error: ", error);
    }

  }

  const addStudyGroup = async (newGroup) => {
    try {
      const response = await fetch('http://localhost:8080/api/studyGroups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup),
      });
      const data = await response.json();
      console.log('Success:', data);
  
      toast.success("Study Group Posted", {
        description: newGroup.postedAt,
      });
      
      fetchGroups();
  
    } catch (error) {
      console.error('Error submitting study group:', error);
      setError('Failed to submit study group. Please try again.');
      setIsSubmitting(false);
    }
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
              <PopoverContent className="w-150 bg-zinc-800" ><StudyGroupForm onSubmit={addStudyGroup} /></PopoverContent>
            </Popover>

            <Input placeholder="Try searching by title, course number, or major..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-200"
            ></Input>
          </div>

          <div className="p-4 space-y-5">
            {filteredStudyGroups.map((object) => (<StudyGroupCard key={object.id} group={object} />))}
          </div>
        </div>
      </div>
    </>)
}

export default StudyGroup;
