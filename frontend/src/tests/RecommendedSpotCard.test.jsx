import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecommendedSpotCard from '../components/RecommendedSpotCard';

const mockSpot = {
  id: 1,
  name: "Quiet Study Room",
  buildingName: "Charles Library",
  averageNoiseLevel: 2,
  averageCrowdLevel: 3,
  reportCount: 5,
  lastReportTime: "2025-04-13T12:00:00Z",
};

test('renders spot name and building name correctly', () => {
  render(<RecommendedSpotCard spot={mockSpot} rank={1} />);

  expect(screen.getByText("Quiet Study Room")).not.toBeNull();
  expect(screen.getByText("Charles Library")).not.toBeNull();
});

test('renders noise and crowd levels correctly', () => {
  render(<RecommendedSpotCard spot={mockSpot} rank={1} />);

  expect(screen.getByText("2")).not.toBeNull();
  expect(screen.getByText("3")).not.toBeNull();
});

test('renders report count correctly', () => {
  render(<RecommendedSpotCard spot={mockSpot} rank={1} />);

  expect(screen.getByText("5 reports")).not.toBeNull();
});

test('renders rank correctly', () => {
  render(<RecommendedSpotCard spot={mockSpot} rank={1} />);

  expect(screen.getByText("1")).not.toBeNull();
});