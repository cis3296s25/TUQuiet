import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedList from '../components/FeedList';
import { MemoryRouter } from 'react-router-dom';

const renderFeedList = (feedData, isLoading) => (
  render(
    <MemoryRouter>
      <FeedList feedData={feedData} isLoading={isLoading} />
    </MemoryRouter>
  )
);

test('renders loading spinner when isLoading is true', () => {
  renderFeedList([], true);

  expect(screen.getByTestId("loading-spinner")).not.toBeNull();
});

test('renders "No reports available" when feedData is empty', () => {
  renderFeedList([], false);

  expect(screen.getByText(/No reports available/i)).not.toBeNull();
});

test('renders FeedItem components for each report in feedData', () => {
  const mockFeedData = [
    {
      id: 1,
      locationName: "Quiet Room",
      buildingName: "Charles Library",
      noiseLevel: 2,
      crowdLevel: 3,
      description: "A few people talking quietly",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: 2,
      locationName: "Main Study Area",
      buildingName: "Tech Center",
      noiseLevel: 4,
      crowdLevel: 5,
      description: "Busy with group projects",
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
  ];

  renderFeedList(mockFeedData, false);

  expect(screen.getByText("Quiet Room")).not.toBeNull();
  expect(screen.getByText("Charles Library")).not.toBeNull();
  expect(screen.getByText("Main Study Area")).not.toBeNull();
  expect(screen.getByText("Tech Center")).not.toBeNull();
});