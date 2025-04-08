export const mockRecommendationData = [
  {
    id: 1,
    locationId: 3,
    name: "Quiet Room",
    buildingName: "Charles Library",
    averageNoiseLevel: 1,
    averageCrowdLevel: 0,
    reportCount: 12,
    lastReportTime: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    locationId: 4,
    name: "Open Seating Near Windows",
    buildingName: "Charles Library",
    averageNoiseLevel: 2.0,
    averageCrowdLevel: 2.5,
    reportCount: 8,
    lastReportTime: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    locationId: 2,
    name: "Main Study Area",
    buildingName: "Charles Library",
    averageNoiseLevel: 3.0,
    averageCrowdLevel: 3.5,
    reportCount: 15,
    lastReportTime: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    locationId: 1,
    name: "First Floor Lounge",
    buildingName: "Charles Library",
    averageNoiseLevel: 4.0,
    averageCrowdLevel: 4.5,
    reportCount: 10,
    lastReportTime: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    locationId: 7,
    name: "Silent Study Room",
    buildingName: "Tech Center",
    averageNoiseLevel: 0,
    averageCrowdLevel: 1,
    reportCount: 5,
    lastReportTime: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    locationId: 6,
    name: "Computer Lab",
    buildingName: "Tech Center",
    averageNoiseLevel: 2.5,
    averageCrowdLevel: 3.0,
    reportCount: 7,
    lastReportTime: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    locationId: 5,
    name: "Group Study Room 3",
    buildingName: "Tech Center",
    averageNoiseLevel: 3.5,
    averageCrowdLevel: 4.0,
    reportCount: 6,
    lastReportTime: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];
