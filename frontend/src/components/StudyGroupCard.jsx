import { useState } from "react"

//icons
import { Calendar, Clock, Users, Map } from 'lucide-react';

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



function StudyGroupCard({ group }) {

  const [participantsCurrent, setParticipantsCurrent] = useState(group.participantsCurrent);
  const [likes, setLikes] = useState(group.likes);
  const [comments, setComments] = useState(group.comments);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [joinName, setJoinName] = useState("");

  // State to track whether the visitor has already joined or liked. Since we dont have user auth its per visit of page
  const [hasJoined, setHasJoined] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [autoJoinCommentId, setAutoJoinCommentId] = useState(null);



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
    if (!hasJoined) {
      if (joinName.trim() === "" || participantsCurrent >= group.participantsMax) return;

      setParticipantsCurrent((prev) => prev + 1);
      setHasJoined(true);

      const id = `comment-auto-${Date.now()}`;
      const autoComment = {
        id,
        author: joinName.trim(),
        timestamp: new Date().toISOString(),
        content: `${joinName.trim()} is attending.`,
        isAutoJoin: true,
      };

      setAutoJoinCommentId(id);
      setComments((prev) => [...prev, autoComment]);
    } else {
      setParticipantsCurrent((prev) => prev - 1);
      setHasJoined(false);

      // Remove the auto join comment from current session
      setComments((prev) => prev.filter((c) => c.id !== autoJoinCommentId));
      setAutoJoinCommentId(null);
    }
  };

  //ADJUST HANDLE LIKE AND HANDLE COMMENTSUBMIT AND HANDLE JOIN TO DO POSTS TO THE BACKEND, ENSURE THAT 
  //BECAUSE LACK OF USER AUTH THAT EACH ONE OF THOSE CAN ONLY BE CLICKED ONCE PER PAGE VISIT, SO SOMONE
  //ON THE PAGE CANNOT SPAM ANY OF THOSE BUTTONS TO RUN UP THE NUMBER, THE ONLY POST YOU SHOULD BE ABLE TO DO
  //MORE THEN ONCE PER PAGE VISIT IS COMMENT. I WOULD SET THAT UP BY USING THE STATES I ALREADY HAVE ADDED
  //HASLIKED AND HASJOINED. DONT LET THEM MAKE ANOHTER UPDATE IF ONE IS TRUE, PAGE VISIT LOADS WITH THEM
  //OFF BY DEFAULT

  //increase like count or decrease
  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };


  //SET THIS UP TO POST TO BACKEND
  const handleCommentSubmit = async() => {
    // Ensure both the name and comment inputs are filled in.
    if (commenterName.trim() === "" || newComment.trim() === "") return;

    const comment = {
      id: `comment-${Date.now()}`, // Unique id based on timestamp.
      author: commenterName.trim(),
      timestamp: new Date().toISOString(),
      content: newComment.trim(),
      isAutoJoin: true, // custom flag for this session
    };

    
    try {
      const response = await fetch(`http://localhost:8080/api/studyGroups/submitComment/${group.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      const commentData = await response.json();
      if(commentData.status === "success")
        setComments((prev) => [...prev, commentData.comment]);
      else
        console.log("Error: " + commentData);
    } catch (error) {
      console.error("Failed fetching groups with error: ", error);
    }
    // Clear both inputs after posting.
    setCommenterName("");
    setNewComment("");
  };

  return (
    <Card className="w-full">
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
            <CardDescription>{participantsCurrent}/{group.participantsMax}</CardDescription>
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
          <Button variant="outline" onClick={handleLike}>
            👍 {likes}
          </Button>
        </div>

        <div className="flex space-x-4">
          <Input
            placeholder="Name"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
          >
          </Input>
          <Button onClick={handleJoin} disabled={!joinName.trim()}>
            {hasJoined ? "Leave Group" : "Join Group"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default StudyGroupCard;
