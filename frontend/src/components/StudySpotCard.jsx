import { useState, useEffect, useRef } from "react";
import ReportingForm from "./ReportingForm"; // Import your form component
import websocketService from "@/utils/websocketService";
import "@/utils/animations.css"; // import animation style

const SpotCard = ({ spot, averages, onFormSubmit, isLoadingAverages }) => {
  const [showForm, setShowForm] = useState(false);
  const [, setForceUpdate] = useState(0); // Force re-render state
  const [spotAverages, setSpotAverages] = useState(averages);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateType, setUpdateType] = useState(null);
  const cardRef = useRef(null);
  
  // websocket subscription setup
  useEffect(() => {
    // initial data setup
    setSpotAverages(averages);
    
    // subscribe to real-time updates for this study spot
    const subscription = websocketService.subscribeToStudySpot(
      spot.id, 
      handleWebSocketMessage
    );
    
    // unsubscribe when component unmounts
    return () => {
      websocketService.unsubscribe(`/topic/study-spots/${spot.id}`);
    };
  }, [spot.id, averages]);
  
  // handle websocket message
  const handleWebSocketMessage = (message) => {
    console.log('study spot update received:', message);
    
    if (message.action === 'REPORT_UPDATED') {
      // set update state for animation effect
      setSpotAverages(message.data);
      setIsUpdated(true);
      setUpdateType('update-highlight');
      
      // reset update state after 3 seconds
      setTimeout(() => {
        setIsUpdated(false);
        setUpdateType(null);
      }, 3000);
    }
  };

  // Force component to update every 5 seconds to refresh timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setForceUpdate(prev => prev + 1); // Trigger re-render
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format the averages for display
  const noiseLevel = isLoadingAverages ? (
    <span className="loading loading-spinner loading-xs"></span>
  ) : (
    spotAverages?.averageNoiseLevel ?? "N/A" 
  );
  const crowdLevel = isLoadingAverages ? "" : spotAverages?.averageCrowdLevel ?? "N/A";

  const reportCount = spotAverages?.reportCount || 0;
  
  let lastReportTime = null;
  if (spotAverages?.lastReportTime) {
    try {
      // Log the raw timestamp for debugging
      console.log("Processing timestamp:", spotAverages.lastReportTime);
      
      // Get the timestamp string
      const timestamp = spotAverages.lastReportTime;
      
      // Validate timestamp format
      if (!timestamp || typeof timestamp !== 'string') {
        console.error("Invalid timestamp format:", timestamp);
        lastReportTime = "Unknown time";
      } else {
        // Parse the timestamp - format: "YYYY-MM-DD HH:MM:SS.ssssss"
        const [datePart, timePart] = timestamp.split(' ');
        
        if (!datePart || !timePart) {
          console.error("Malformed timestamp:", timestamp);
          lastReportTime = "Unknown time";
        } else {
          // Parse date components
          const [year, month, day] = datePart.split('-').map(Number);
          
          // Handle seconds with microseconds
          let [hours, minutes, seconds] = timePart.split(':');
          hours = parseInt(hours, 10);
          minutes = parseInt(minutes, 10);
          seconds = parseFloat(seconds);
          
          // Create date object using UTC to avoid timezone issues
          // Note: months are 0-indexed in JavaScript
          const date = new Date(Date.UTC(
            year,
            month - 1, 
            day,
            hours,
            minutes,
            Math.floor(seconds),
            (seconds % 1) * 1000 // Convert fractional seconds to milliseconds
          ));
          
          console.log("Parsed date (UTC):", date.toISOString());
          
          // Get current time for comparison
          const now = new Date();
          console.log("Current time:", now.toISOString());
          
          // Calculate time difference in seconds
          const diffInMs = now.getTime() - date.getTime();
          const diffInSeconds = Math.round(diffInMs / 1000);
          
          console.log("Time difference (seconds):", diffInSeconds);
          
          // Format the relative time with improved thresholds
          if (diffInSeconds < 0) {
            // Server time might be ahead of client time
            console.log("⚠️ Future date detected - clock sync issue");
            lastReportTime = "just now";
          } 
          else if (diffInSeconds < 30) {
            // Increased threshold to avoid flickering
            lastReportTime = "just now";
          }
          else if (diffInSeconds < 60) {
            lastReportTime = `${diffInSeconds} seconds ago`;
          }
          else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            lastReportTime = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
          }
          else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            lastReportTime = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
          }
          else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            lastReportTime = `${days} day${days !== 1 ? 's' : ''} ago`;
          }
          else {
            // Format older dates as calendar date
            lastReportTime = date.toLocaleDateString();
          }
          
          console.log("Formatted time:", lastReportTime);
        }
      }
    } catch (error) {
      console.error("Error formatting date:", error, error.stack);
      lastReportTime = "Unknown time";
    }
  }

  return (
    <div className="relative">
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 ">
          <div className="dark:bg-[#2b2b2b] bg-[#ffffff]  rounded-lg  w-96 relative overflow-hidden">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <ReportingForm spot={spot} onSubmit={(result) => {if (result.success) {onFormSubmit(); setShowForm(false);}
            }} />
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className={`border-1 rounded-xl border-none dark:bg-[#171717] bg-[#f4f4f4] min-h-42 cursor-pointer ${isUpdated ? updateType : ''}`}
        onClick={() => setShowForm(true)} data-testid = {`spot-card-${spot.id}`}
      >
        <div className="p-3">
          <h2 className="text-xl font-semibold mb-2" data-testid = {`spot-name-${spot.id}`}>{spot.name}</h2>
          
          {/* Add noise and crowd level display */}
          <div className="mt-2">
            <div className="flex justify-between">
              <span className="text-gray-400" data-testid = {`noise-level-label-${spot.id}`}>Noise:</span>
              <span className={`font-medium ${isUpdated ? 'value-changed' : ''}`} data-testid = {`noise-level-${spot.id}`}>{noiseLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400" data-testid = {`crowd-level-label-${spot.id}`}>Crowd:</span>
              <span className={`font-medium ${isUpdated ? 'value-changed' : ''}`} data-testid = {`crowd-level-${spot.id}`}>{crowdLevel}</span>
            </div>
            {reportCount > 0 && (
              <>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  Based on {reportCount} report{reportCount !== 1 ? 's' : ''}
                </div>
                {lastReportTime && (
                  <div className="text-xs text-gray-500 mt-1 text-right" data-testid = {`last-report-time-${spot.id}`}>
                    Last updated: {lastReportTime}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotCard;
