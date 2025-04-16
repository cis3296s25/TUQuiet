import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecommendationList from '../components/RecommendationList';

const mockRecommendationData = [
  {
    id: 1,
    name: "Quiet Study Room",
    buildingName: "Charles Library",
    averageNoiseLevel: 2,
    averageCrowdLevel: 3,
    reportCount: 5,
    lastReportTime: "2025-04-13T12:00:00Z",
  },
  {
    id: 2,
    name: "Main Study Area",
    buildingName: "Tech Center",
    averageNoiseLevel: 4,
    averageCrowdLevel: 5,
    reportCount: 10,
    lastReportTime: "2025-04-13T14:00:00Z",
  },
];

test('renders loading spinner when isLoading is true', () => {
  render(<RecommendationList recommendationData={[]} isLoading={true} />);

  expect(screen.getByTestId("loading-spinner")).not.toBeNull();
});

test('renders "No recommendations available" when recommendationData is empty', () => {
  render(<RecommendationList recommendationData={[]} isLoading={false} />);

  expect(screen.getByText(/No recommendations available/i)).not.toBeNull();
});

test('renders RecommendedSpotCard components for each recommendation', () => {
  render(<RecommendationList recommendationData={mockRecommendationData} isLoading={false} />);

  expect(screen.getByText("Quiet Study Room")).not.toBeNull();
  expect(screen.getByText("Charles Library")).not.toBeNull();
  expect(screen.getByText("Main Study Area")).not.toBeNull();
  expect(screen.getByText("Tech Center")).not.toBeNull();
});