export function formatRelativeTime(timestamp) {
  try {
    if (!timestamp) return "Unknown time";
    
    // Parse the timestamp if it's a string
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    // Get current time for comparison
    const now = new Date();
    
    // Calculate time difference in seconds
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.round(diffInMs / 1000);
    
    // Format the relative time
    if (diffInSeconds < 0) {
      return "just now"; // Server time might be ahead of client time
    } else if (diffInSeconds < 30) {
      return "just now";
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.error("Error formatting date:", error, error.stack);
    return "Unknown time";
  }
}
