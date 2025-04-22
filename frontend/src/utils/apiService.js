/**
 * API Service for centralizing API URL configuration
 * Uses environment variables with fallback to localhost for development
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Constructs a full API URL from an endpoint
 * @param {string} endpoint - The API endpoint (with or without leading slash)
 * @returns {string} The complete URL
 */
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with '/' if not already
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};

export default {
  getApiUrl
};
