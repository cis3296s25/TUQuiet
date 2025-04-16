import { expect, test, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeedItem from '../components/FeedItem';

const renderFeedItem = (mockReport) => (
    render(
        <MemoryRouter>
            <FeedItem report={mockReport} />
        </MemoryRouter>
    )
);

test('renders FeedItem with correct data', () => {
  const mockReport = {
    id: 1,
    locationName: "Quiet Room",
    buildingName: "Charles Library",
    noiseLevel: 2,
    crowdLevel: 3,
    description: "A few people talking quietly",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  };

  renderFeedItem(mockReport);

  expect(screen.getByText("Quiet Room")).not.toBeNull();
  expect(screen.getByText("Charles Library")).not.toBeNull();
  expect(screen.getByText("2")).not.toBeNull();
  expect(screen.getByText("3")).not.toBeNull();
  expect(screen.getByText(/A few people talking quietly/i)).not.toBeNull();
});

test('renders FeedItem without description gracefully', () => {
  const mockReport = {
    id: 2,
    locationName: "Main Study Area",
    buildingName: "Tech Center",
    noiseLevel: 4,
    crowdLevel: 5,
    description: "",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  };

  renderFeedItem(mockReport);

  expect(screen.getByText("Main Study Area")).not.toBeNull();
  expect(screen.getByText("Tech Center")).not.toBeNull();
  expect(screen.getByText("4")).not.toBeNull();
  expect(screen.getByText("5")).not.toBeNull();
  expect(screen.queryByText(/description/i)).toBeNull();
});

