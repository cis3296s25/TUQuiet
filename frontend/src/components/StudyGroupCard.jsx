import { useState, useEffect, useRef } from "react";

//icons
import { Calendar, Clock, Users, Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import websocketService from "@/utils/websocketService";
import "@/utils/animations.css"; // import animation style

function StudyGroupCard({ group }) {
  const [participantsCurrent, setParticipantsCurrent] = useState(
    group.participantsCurrent
  );
  const [likes, setLikes] = useState(group.likes);
  const [comments, setComments] = useState(group.comments);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [joinName, setJoinName] = useState("");

  // State to track whether the visitor has already joined or liked. Since we dont have user auth its per visit of page
  const [hasJoined, setHasJoined] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [autoJoinCommentId, setAutoJoinCommentId] = useState(null);

  // animation state management
  const [isUpdated, setIsUpdated] = useState(false);
  const [updatedCommentId, setUpdatedCommentId] = useState(null);
  const [participantAnimation, setParticipantAnimation] = useState(null);
  const [likesAnimation, setLikesAnimation] = useState(null);
  const cardRef = useRef(null);

  // set up websocket subscription
  useEffect(() => {
    // subscribe to real-time updates for this study group
    const subscription = websocketService.subscribeToStudyGroup(
      group.id,
      handleWebSocketMessage
    );

    // unsubscribe when component unmounts
    return () => {
      websocketService.unsubscribe(`/topic/study-groups/${group.id}`);
    };
  }, [group.id]);

  // handle websocket messages
  const handleWebSocketMessage = (message) => {
    console.log("websocket message received:", message);

    switch (message.action) {
      case "COMMENT_ADDED":
        // update comment list when a new comment is added

        // When receiving a new comment from the websocket, make sure it's not already in the list.
        // This prevents duplicate comments from showing up when:
        // 1. The user submits a comment (triggers a websocket broadcast),
        // 2. The websocket sends it back to the same user who posted it.
        setComments((prevComments) => {
          if (prevComments.some((c) => c.id === message.data.id)) {
            return prevComments; // already exists, skip
          }
          return [...prevComments, message.data];
        });
        setUpdatedCommentId(message.data.id);
        setIsUpdated(true);

        // reset animation state after 3 seconds
        setTimeout(() => {
          setIsUpdated(false);
          setUpdatedCommentId(null);
        }, 3000);
        break;

      case "PARTICIPANT_LEFT":
        // remove comment and update participant count when a participant leaves
        setComments((prevComments) =>
          prevComments.filter(
            (comment) => comment.id !== message.data.commentId
          )
        );
        // set participant decrease animation
        setParticipantAnimation("count-decrease");

        // reset animation state after 3 seconds
        setTimeout(() => {
          setParticipantAnimation(null);
        }, 3000);
        break;

      case "PARTICIPANTS_UPDATED":
        // update participant count when a participant joins or leaves
        if (message.data.participantsCurrent === "+1") {
          setParticipantAnimation("count-increase");

          // reset animation state after 3 seconds
          setTimeout(() => {
            setParticipantAnimation(null);
          }, 3000);
        } else if (message.data.participantsCurrent === "-1") {
          setParticipantAnimation("count-decrease");

          // reset animation state after 3 seconds
          setTimeout(() => {
            setParticipantAnimation(null);
          }, 3000);
        }
        break;

      case "LIKES_UPDATED":
        // update like count when a like is added or removed
        if (message.data.likes === "+1") {
          setLikesAnimation("count-increase");

          // reset animation state after 3 seconds
          setTimeout(() => {
            setLikesAnimation(null);
          }, 3000);
        } else if (message.data.likes === "-1") {
          setLikesAnimation("count-decrease");

          // reset animation state after 3 seconds
          setTimeout(() => {
            setLikesAnimation(null);
          }, 3000);
        }
        break;

      default:
        console.log("unhandled message type:", message.action);
    }
  };

  // Format the posting date and event date so they're easier to read.
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
  const handleJoin = async () => {
    if (!hasJoined) {
      if (
        joinName.trim() === "" ||
        participantsCurrent >= group.participantsMax
      )
        return;

      setParticipantsCurrent((prev) => prev + 1);
      const id = `comment-auto-${Date.now()}`;
      const autoComment = {
        id,
        author: joinName.trim(),
        timestamp: new Date().toISOString(),
        content: `${joinName.trim()} is attending.`,
        isAutoJoin: true,
      };

      try {
        const response = await fetch(
          `http://localhost:8080/api/studyGroups/submitAutoJoinComment/${group.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(autoComment),
          }
        );
        const commentData = await response.json();
        if (commentData.status === "success") {
          setAutoJoinCommentId(commentData.comment.id);
          setHasJoined(true);
        } else console.log("Error: " + commentData);
      } catch (error) {
        console.error("Failed submitting comment with error: ", error);
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:8080/api/studyGroups/deleteAutoJoinComment/${group.id}/${autoJoinCommentId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const commentData = await response.json();
        if (commentData.status === "success") {
          setHasJoined(false);
          setParticipantsCurrent((prev) => prev - 1);

          setAutoJoinCommentId(null);
        } else console.log("Error: " + commentData);
      } catch (error) {
        console.error("Failed submitting comment with error: ", error);
      }
    }
  };

  //increase like count or decrease
  const handleLike = async () => {
    if (!hasLiked) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/studyGroups/like/${group.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setHasLiked(true);
          setLikes((prev) => prev + 1);
        } else console.log("Error: " + commentData);
      } catch (error) {
        console.error("Failed submitting comment with error: ", error);
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:8080/api/studyGroups/removeLike/${group.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setHasLiked(false);
          setLikes((prev) => prev - 1);
        } else console.log("Error: " + commentData);
      } catch (error) {
        console.error("Failed submitting comment with error: ", error);
      }
    }
  };

  //SET THIS UP TO POST TO BACKEND
  const handleCommentSubmit = async () => {
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
      const response = await fetch(
        `http://localhost:8080/api/studyGroups/submitComment/${group.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comment),
        }
      );
      const commentData = await response.json();
      if (commentData.status === "success") {
        // websocket will notify so no need to update state
        // setComments((prev) => [...prev, commentData.comment]);
      } else console.log("Error: " + commentData);
    } catch (error) {
      console.error("Failed submitting comment with error: ", error);
    }
    // Clear both inputs after posting.
    setCommenterName("");
    setNewComment("");
  };

  return (
    <Card
      className={`w-full h-auto break-words ${isUpdated ? "update-highlight" : ""}`}
      ref={cardRef}
    >
      <CardHeader>
      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-2 w-full">

          <CardTitle>{group.name}</CardTitle>
          <CardTitle>{group.courseCode}</CardTitle>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-2 w-full">

          <CardDescription>{group.major}</CardDescription>
          <CardDescription>{group.postedAt} </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl">{group.title}</CardTitle>
        <CardDescription className="mt-2 pb-5">
          {group.description}
        </CardDescription>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-w-[30rem]">
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
            <CardDescription>
              {participantsCurrent}/{group.participantsMax}
            </CardDescription>
          </div>
        </div>

        <hr className="mt-5 mb-5"></hr>

        {/* Comments Section */}
        <CardTitle className="mb-3">Comments</CardTitle>
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 mb-5 break-words">
            <CardDescription className="text-white">
              {comment.author}
            </CardDescription>
            <CardDescription className="text-white">
              {comment.content}
            </CardDescription>
          </div>
        ))}

        {/* Comment Form */}
        <div className="flex flex-col space-y-2 md:flex-row items-center md:space-x-2">
          <Input
            placeholder="Name"
            value={commenterName}
            onChange={(e) => setCommenterName(e.target.value)}
            className="w-full md:w-24 " // Adjust width as needed for a short input.
            data-testid="commenter-name-input"
          />

          <Input
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full md:flex-1 " // Takes up the remaining space.
          />

          <Button onClick={handleCommentSubmit} className=" w-full md:w-auto px-3 py-1">
            Post
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">

        <div className="space-x-2">
          <Button variant="outline" onClick={handleLike}>
            👍 <span className={likesAnimation}>{likes}</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">

          <Input
            placeholder="Name"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            data-testid="join-name-input"
          ></Input>
          <Button onClick={handleJoin} disabled={!joinName.trim()}>
            {hasJoined ? "Leave Group" : "Join Group"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default StudyGroupCard;
