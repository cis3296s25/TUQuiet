export const mockFeedData = [
  {
    id: 1,
    locationId: 3,
    buildingId: 1,
    locationName: "Quiet Room",
    buildingName: "Charles Library",
    noiseLevel: 2,
    crowdLevel: 3,
    description: "A few people talking quietly",
    timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  },
  {
    id: 2,
    locationId: 1,
    buildingId: 1,
    locationName: "First Floor Lounge",
    buildingName: "Charles Library",
    noiseLevel: 4,
    crowdLevel: 5,
    description: "Very busy today with group projects",
    timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
  },
  {
    id: 3,
    locationId: 2,
    buildingId: 1,
    locationName: "Main Study Area",
    buildingName: "Charles Library",
    noiseLevel: 3,
    crowdLevel: 4,
    description: "",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 4,
    locationId: 4,
    buildingId: 1,
    locationName: "Open Seating Near Windows",
    buildingName: "Charles Library",
    noiseLevel: 1,
    crowdLevel: 2,
    description: "Nice and quiet by the windows today",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
  },
  {
    id: 5,
    locationId: 3,
    buildingId: 1,
    locationName: "Quiet Room",
    buildingName: "Charles Library",
    noiseLevel: 1,
    crowdLevel: 1,
    description: "Almost empty this morning",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: 6,
    locationId: 5,
    buildingId: 2,
    locationName: "Group Study Room 3",
    buildingName: "Tech Center",
    noiseLevel: 3,
    crowdLevel: 4,
    description: "Several groups working on projects",
    timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: 7,
    locationId: 6,
    buildingId: 2,
    locationName: "Computer Lab",
    buildingName: "Tech Center",
    noiseLevel: 2,
    crowdLevel: 3,
    description: "About half full, relatively quiet",
    timestamp: new Date(Date.now() - 90 * 60 * 1000) // 1.5 hours ago
  }
];
