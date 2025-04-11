import {useState} from "react"
 
//icons
import { Calendar, Clock, Users, Map   } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



function StudyGroupCard({ group }) {

    const [participantsCount, setParticipantsCount] = useState(group.participantsCurrent);
    const [likes, setLikes] = useState(group.likes);
    const [comments, setComments] = useState(group.comments);
    const [newComment, setNewComment] = useState("");
    const [commenterName, setCommenterName] = useState("");


     // Format the posting date and event date so they’re easier to read.
    const formattedPostedAt = new Date(group.postedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    const formattedDate = new Date(group.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });


    // event handlers

    // increase join count
    const handleJoin = () => {
        if (participantsCount < group.participantsMax){
            setParticipantsCount(prev => prev + 1);
        }
    }

    //increase like count
    const handleLike = () => {
        setLikes(prev => prev + 1);
    
    }

    const handleCommentSubmit = () => {
        // Ensure both the name and comment inputs are filled in.
        if (commenterName.trim() === "" || newComment.trim() === "") return;
    
        const comment = {
          id: `comment-${Date.now()}`, // Unique id based on timestamp.
          author: commenterName.trim(),
          timestamp: new Date().toISOString(),
          content: newComment.trim(),
        };
    
        setComments((prev) => [...prev, comment]);
        // Clear both inputs after posting.
        setCommenterName("");
        setNewComment("");
      };

    return (
        <Card className="max-w-[1500px] min-w-[500px]">
        <CardHeader>
            
        <div className="flex justify-between items-center w-full">
            <CardTitle>{group.name}</CardTitle>
            <CardTitle>{group.courseCode}</CardTitle>
        </div>

        <div className="flex justify-between items-center w-full">
          <CardDescription>{group.major}</CardDescription>
          <CardDescription>{group.postedAt} </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            <CardTitle className="text-xl">{group.title}</CardTitle>
            <CardDescription className="mt-2 pb-5">{group.description}</CardDescription>

            <div className="grid grid-cols-2 gap-1 w-[30rem]">
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <CardDescription>{group.date}</CardDescription>
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <CardDescription>{group.time}</CardDescription>
                </div>
                <div className="flex items-center">
                    <Map className="h-4 w-4 text-muted-foreground mr-2" />
                    <CardDescription>{group.location}</CardDescription>
                </div>
                <div className="flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground mr-2" />
                    <CardDescription>{participantsCount}/{group.participantsMax}</CardDescription>
                </div>
            </div>

            <hr className="mt-5 mb-5"></hr>
            

            {/* Comments Section */}
            <CardTitle className="mb-3">Comments</CardTitle>
            {comments.map((comment) => (
            <div key={comment.id} className="p-3 mb-5">
                <CardDescription className="text-white">
                {comment.author}
                </CardDescription>
                <CardDescription className="text-white">
                {comment.content}
                </CardDescription>
            </div>
            ))}


             {/* Comment Form */}
            <div className="flex items-center space-x-2">

            <Input
                placeholder="Name"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                className="w-24" // Adjust width as needed for a short input.
            />
        
            <Input
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1" // Takes up the remaining space.
            />
           
            <Button onClick={handleCommentSubmit} className="px-3 py-1">
                Post
            </Button>
            </div>

         
        </CardContent>
        <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button variant="outline" onClick={handleLike}>👍{likes}</Button>
        </div>
          <Button onClick={handleJoin} >
            {(participantsCount !== group.participantsMax) ? "Join Group" : "Group Full"}
            </Button>
        </CardFooter>
      </Card>
    )
}

export default StudyGroupCard;
