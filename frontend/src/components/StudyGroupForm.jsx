import React, {useState} from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



function StudyGroupForm({onSubmit}){
    const [name, setName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [major, setMajor] = useState("");
    const [participantsMax, setParticipantsMax] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        const newStudyGroup = {
            id: "group" + Date.now(),
            courseCode,
            major,
            postedAt: new Date().toISOString(),
            name,
            title,
            description,
            date,
            time,
            location,
            participantsCurrent: 0,
            participantsMax: Number(participantsMax),
            comments: [],
            likes: 0,
        };

        // calling the parent callback passed to the component
        onSubmit(newStudyGroup);
         // Clear form fields after submission.
        setName("");
        setCourseCode("");
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setMajor("");
        setParticipantsMax("");


    }



    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-zinc-800 rounded-md">
            <div className='flex flex-col'>
                <label>Organizer Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required data-testid="groupForm-name-input"></Input>
            </div><div className='flex flex-col'>
                <label>Major</label>
                <Input value={major} onChange={(e) => setMajor(e.target.value)} required data-testid="groupForm-major-input"></Input>
            </div>
            <div className="flex flex-col">
                <label>Course Code</label>
                <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required data-testid="groupForm-course-code-input"/>
            </div>
            <div className="flex flex-col">
                <label>Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required data-testid="groupForm-title-input"/>
            </div>
            <div className="flex flex-col">
                <label>Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} required data-testid="groupForm-description-input"/>
            </div>
            <div className="flex flex-col">
                <label>Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required data-testid="groupForm-date-input"/>
            </div>
            <div className="flex flex-col">
                <label>Time</label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required data-testid="groupForm-time-input"/>
            </div>
            <div className="flex flex-col">
                <label>Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} required data-testid="groupForm-location-input"/>
            </div>
            <div className="flex flex-col">
                <label>Max Participants</label>
                <Input
                type="number"
                value={participantsMax}
                onChange={(e) => setParticipantsMax(e.target.value)}
                required
                data-testid="groupForm-max-participants-input"
             />
            
            </div>
            <Button type="submit">Post</Button>
        </form>
    )
}


export default StudyGroupForm;