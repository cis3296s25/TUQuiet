import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mockFetch, restoreFetch } from './utils/MockFetch';
import RecommendationsPage from '../pages/RecommendationsPage';
import { mock } from 'node:test';
import { act } from 'react';

const mockFeedData = [
  {
    id: 1, 
    locationName: "Quiet Room",
    buildingName: "Charles Library",
    noiseLevel: 2,
    crowdLevel: 3,
    description: "A few people talking quietly",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    locationName: "Main Study Area",
    buildingName: "Tech Center",
    noiseLevel: 4,
    crowdLevel: 5,
    description: "Busy with group projects",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

const mockRecommendationData = [
  {
    id: 1,
    name: "Study Room 1",
    buildingName: "Charles Library",
    averageNoiseLevel: 2,
    averageCrowdLevel: 3,
    reportCount: 5,
    lastReportTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: "Study Room 2",
    buildingName: "Tech Center",
    averageNoiseLevel: 4,
    averageCrowdLevel: 5,
    reportCount: 10,
    lastReportTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

const renderRecommendationsPage = () => {

    return render(<RecommendationsPage />);
}

test('renders RecommendationsPage correctly', () => {
    renderRecommendationsPage();

    expect(screen.getByText("Recommended Study Spaces")).not.toBeNull();
    expect(screen.getByText("Recent Reports")).not.toBeNull();

    const filterDropdown = screen.getByTestId("filter-dropdown");

    expect(screen.getByText("Filter by Building")).not.toBeNull();
    expect(filterDropdown).not.toBeNull();
    expect(filterDropdown.innerHTML).toContain("All Buildings");
    expect(filterDropdown.innerHTML).toContain("Charles Library");
    expect(filterDropdown.innerHTML).toContain("Tech Center");

    expect(screen.getByText("Noise Level")).not.toBeNull();
    expect(screen.getByText("Crowd Level")).not.toBeNull();
    expect(screen.getByText("Combined")).not.toBeNull();
});

test('handles dropdown change', async () => {
    renderRecommendationsPage();

    const filterDropdown = screen.getByTestId("filter-dropdown");

    fireEvent.change(filterDropdown, { target: { value: "Charles Library" } });

    expect(filterDropdown.value).toBe("0");

    await waitFor(() => {
        expect(screen.getByText("Charles Library")).not.toBeNull();
    });

});

//Thse test should work in theory but their is a weird type error with the mockFeed data that needs to be

test('renders RecommendationsPage with feed', async () => {
  mockFetch(mockFeedData);

  render(<RecommendationsPage />);  

  await waitFor(() => {
    expect(screen.getByText("Quiet Room")).not.toBeNull();
    expect(screen.getByText("Main Study Area")).not.toBeNull();
  });

  restoreFetch();
});

test('renders RecommendationsPage with recommendations', async () => {
    mockFetch(mockRecommendationData);

    render(<RecommendationsPage />);

    await waitFor(() => {
        expect(screen.getByText("Study Room 1")).not.toBeNull();
        expect(screen.getByText("Study Room 2")).not.toBeNull();
    });
});

//Will need to look into how to handle the mocking here, as the filter function fetchs data multiple times which does not work with the current mockFetch implementation

// test('filters feed by building', async () => {

//   mockFetch(mockFeedData);

//   render(<RecommendationsPage />);


//   await waitFor(() => {
//     expect(screen.getByText("Quiet Room")).not.toBeNull();
//     expect(screen.getByText("Main Study Area")).not.toBeNull();
//   });

//   const filterDropdown = screen.getByTestId("filter-dropdown");
//   await act(() => {
//     fireEvent.change(filterDropdown, { target: { value: "1" } });
//  });

//   mockFetch(mockFeedData.filter(report => report.id === "1"));

//   await waitFor(() => {
//     expect(screen.getByText("Quiet Room")).not.toBeNull();
//     expect(screen.queryByText("Main Study Area")).toBeNull();
//   });

//   restoreFetch();
// });

// test('filters recommendations by building', async () => {
//     mockFetch(mockRecommendationData);

//     render(<RecommendationsPage />);

//     await waitFor(() => {
//         expect(screen.getByText("Study Room 1")).not.toBeNull();
//         expect(screen.getByText("Study Room 2")).not.toBeNull();
//     });

//     const filterDropdown = screen.getByTestId("filter-dropdown");
//     fireEvent.change(filterDropdown, { target: { value: "1" } });

//     mockFetch(mockRecommendationData.filter(recommendation => recommendation.id === "1"));

//     await waitFor(() => {
//         expect(screen.getByText("Study Room 1")).not.toBeNull();
//         expect(screen.queryByText("Study Room 2")).toBeNull();
//     });

//     restoreFetch();
// });

test('sorts recommendations by noise level', async () => {
    mockFetch(
        mockFeedData,
      );
    
        mockFetch(
        mockRecommendationData,
        );

  render(<RecommendationsPage />);

  await waitFor(() => {
    expect(screen.getByText("Study Room 1")).not.toBeNull();
    expect(screen.getByText("Study Room 2")).not.toBeNull();
  });

  const noiseButton = screen.getByText("Noise Level");
  fireEvent.click(noiseButton);

  await waitFor(() => {
    const recommendations = screen.getAllByText(/Study Room/);
    expect(recommendations[0].textContent).toBe("Study Room 1");
    expect(recommendations[1].textContent).toBe("Study Room 2");
  });

  restoreFetch();
});

test('handles empty feed and recommendation data', async () => {
  mockFetch(
    [],
  );

    mockFetch(
    [],
    );

  render(<RecommendationsPage />);

  await waitFor(() => {
    expect(screen.getByText(/no reports available/i)).not.toBeNull();
    expect(screen.getByText(/no recommendations available/i)).not.toBeNull();
  });

  restoreFetch();
});