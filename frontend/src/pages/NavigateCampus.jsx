import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { buildingList } from "./Buildings";

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Define map container style
const mapContainerStyle = {
  height: "70vh",
  width: "100%",
  borderRadius: "0.5rem"
};

// Default center location (Temple University)
const defaultCenter = {
  lat: 39.9813,
  lng: -75.1564
};

// List of required Google Maps libraries
const libraries = ["places"];

// Define coordinates for each building
const buildingCoordinates = {
  "Charles Library": { lat: 39.982352537254, lng: -75.15523479935123 },
  "Paley Hall": { lat: 39.98109113275884, lng: -75.15450569508008 },
  "TECH Center": { lat: 39.9801478811468, lng: -75.15318804823382 },
  "Tuttleman Learning Center": { lat: 39.980160367714234, lng: -75.15514863098312 },
  "Howard Gittis Student Center": { lat: 39.979372800225235, lng: -75.15497242520222 },
  "Alter Hall": { lat: 39.980297926975474, lng: -75.15578374063327 }
};

function NavigateCampus() {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [accuracy, setAccuracy] = useState(50); // Default accuracy radius (meters)
  const placesServiceRef = useRef(null);

  // Handle Google Maps API loading
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries
  });

  // Fetch building locations using coordinates
  const fetchBuildingCoordinates = useCallback(() => {
    // Get detailed information for each building using coordinates
    buildingList.forEach(building => {
      // Get coordinates for the building name
      const coordinates = buildingCoordinates[building.name];
      
      if (!coordinates) {
        console.log(`Coordinates not found: ${building.name}`);
        // Use existing coordinates if not found
        setMarkers(prevMarkers => {
          if (!prevMarkers.some(m => m.id === building.id)) {
            return [...prevMarkers, building];
          }
          return prevMarkers;
        });
        return;
      }

      // Update building information with coordinates
      const updatedBuilding = {
        ...building,
        position: [
          coordinates.lat,
          coordinates.lng
        ]
      };
      
      // Update marker list
      setMarkers(prevMarkers => {
        // Check if the building already exists
        const existingIndex = prevMarkers.findIndex(m => m.id === building.id);
        if (existingIndex >= 0) {
          // Update if it exists
          const updatedMarkers = [...prevMarkers];
          updatedMarkers[existingIndex] = updatedBuilding;
          return updatedMarkers;
        } else {
          // Add new if it doesn't exist
          return [...prevMarkers, updatedBuilding];
        }
      });
    });
  }, []);

  useEffect(() => {
    // Detect mobile environment
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Set location accuracy (meters)
          if (position.coords.accuracy) {
            setAccuracy(position.coords.accuracy);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Callback when map is loaded
  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  // Callback when map is unmounted
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Show building information when marker is clicked
  const handleMarkerClick = (building) => {
    setSelectedBuilding(building);
  };

  // Close InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedBuilding(null);
  };

  // Execute detailed information search using coordinates when map is loaded
  useEffect(() => {
    if (map && isLoaded) {
      fetchBuildingCoordinates();
    }
  }, [map, isLoaded, fetchBuildingCoordinates]);

  // Display loading message
  if (loadError) {
    return <div className="p-4 text-red-500">Error loading Google Maps.</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading map...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="font-bold text-4xl mt-5 mb-5">Navigate Campus</h1>
      <div className="relative" style={{ height: "70vh", width: "100%" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentPosition}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
          }}
        >
          {/* Current location marker (styled like Google Maps UI) */}
          <Marker
            position={currentPosition}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10, // Reduced size to 1/5
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2
            }}
            zIndex={100}
          />
          {/* Current location label */}
          <InfoWindow
            position={currentPosition}
            options={{
              pixelOffset: new window.google.maps.Size(0, -10),
              disableAutoPan: true // Prevent auto-panning when opening
            }}
          >
            <div style={{ backgroundColor: 'white', padding: '0.4px', borderRadius: '2px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: 'black' }}>Current Location</span>
            </div>
          </InfoWindow>
          
          {/* Building location markers */}
          {markers.map((building) => (
            <Marker
              key={building.id}
              position={{
                lat: building.position[0],
                lng: building.position[1]
              }}
              onClick={() => handleMarkerClick(building)}
            />
          ))}

          {/* Info window for selected building */}
          {selectedBuilding && (
            <InfoWindow
              position={{
                lat: selectedBuilding.position[0],
                lng: selectedBuilding.position[1]
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="max-w-xs">
                <img 
                  src={selectedBuilding.img} 
                  alt={selectedBuilding.name} 
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="font-bold text-lg text-black">{selectedBuilding.name}</h3>
                <p className="text-sm mb-2 text-black">{selectedBuilding.description}</p>
                <Link 
                  to={`/Building/${selectedBuilding.id}`} 
                  state={{ building: selectedBuilding }}
                  className="bg-red-500 text-white px-4 py-1 rounded block text-center"
                >
                  View Study Space
                </Link>
              </div>
            </InfoWindow>
          )}

          {/* Add My Location button */}
          <div className="absolute bottom-5 right-5">
            <button
              className="bg-white p-2 rounded-full shadow-md"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    const pos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    };
                    // Update location accuracy
                    if (position.coords.accuracy) {
                      setAccuracy(position.coords.accuracy);
                    }
                    setCurrentPosition(pos);
                    map.panTo(pos);
                  });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1A73E8">
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
              </svg>
            </button>
          </div>
        </GoogleMap>
      </div>

      {/* Building list for mobile environment */}
      {isMobile && (
        <div className="mt-5">
          <h2 className="font-bold text-xl mb-3">Building List</h2>
          <div className="grid grid-cols-1 gap-4">
            {buildingList.map((building) => (
              <Link 
                key={building.id} 
                to={`/Building/${building.id}`}
                state={{ building }}
                className="border border-gray-300 rounded-md p-4 flex items-center hover:bg-gray-100"
              >
                <img 
                  src={building.img} 
                  alt={building.name} 
                  className="w-16 h-16 object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold">{building.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{building.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavigateCampus; 