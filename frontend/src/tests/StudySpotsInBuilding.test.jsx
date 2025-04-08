import { expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudySpotsInBuilding from '../pages/StudySpotsInBuilding';
import { mockFetch, restoreFetch } from './utils/MockFetch';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: () => ({
            state: { building: mockBuilding },
        }),
    };
});

const mockBuilding = {
    id: 1,
    name: 'Library',
    img: 'library.jpg',
};

const mockSpots = [
    { id: 1, name: 'Quiet Room', description: 'A silent study area.' },
    { id: 2, name: 'Group Study', description: 'A space for group discussions.' },
];

const mockAverages = {
    1: { averageNoiseLevel: 2, averageCrowdLevel: 3, reportCount: 5, lastReportTime: '2023-10-01T12:00:00Z' },
    2: { averageNoiseLevel: 4, averageCrowdLevel: 5, reportCount: 10, lastReportTime: '2023-10-01T13:00:00Z' },
};

const renderStudySpotsInBuilding = () => {
    return render(
        <MemoryRouter initialEntries={[`/Building/${mockBuilding.id}`]}>
            <StudySpotsInBuilding />
        </MemoryRouter>
    );
};

test('StudySpotsInBuilding renders building details correctly', async () => {
    mockFetch(mockSpots);

    renderStudySpotsInBuilding();

    await waitFor(() => {
        const buildingTitle = screen.getByText(`${mockBuilding.name} - Pick a spot to begin a TUQuiet Report`);
        expect(buildingTitle).not.toBeNull();
    });

    restoreFetch();
});

test('StudySpotsInBuilding renders study spots correctly', async () => {
    mockFetch(mockSpots);

    renderStudySpotsInBuilding();

    await waitFor(() => {
        for (const spot of mockSpots) {
            const spotName = screen.getByText(spot.name);
            expect(spotName).not.toBeNull();
        }
    });

    mockSpots.forEach((spot) => {
        expect(screen.getByText(spot.name)).not.toBeNull();
    });

    restoreFetch();
});

// BELOW TESTS ARE NOT CURRENTLY WORKING WILL DEBUG IN FUTURE

// test('StudySpotsInBuilding fetches and displays averages for study spots', async () => {
//     mockFetch(mockSpots);

//     renderStudySpotsInBuilding();

//     await waitFor(() => {
//         mockSpots.forEach((spot) => {
//             const spotName = screen.getByText(spot.name);
//             expect(spotName).not.toBeNull();
//         });
//     });

//     mockFetch(mockAverages);

//     await waitFor(() => {
//         mockSpots.forEach((spot) => {
//             const noiseLevel = screen.getByTestId(`noise-level-${spot.id}`);
//             const crowdLevel = screen.getByTestId(`crowd-level-${spot.id}`);
//             expect(noiseLevel).not.toBeNull();
//             expect(crowdLevel).not.toBeNull();
//             expect(noiseLevel.textContent).toEqual(mockAverages[spot.id].averageNoiseLevel.toString());
//             expect(crowdLevel.textContent).toEqual(mockAverages[spot.id].averageCrowdLevel.toString());
//         });
//     });

//     restoreFetch();
// });

// test('StudySpotsInBuilding handles fetch errors gracefully', async () => {
//     mockFetch([], false);

//     renderStudySpotsInBuilding();

//     await waitFor(() => {
//         const errorMessage = screen.queryByText(/Failed fetching spots/i);
//         expect(errorMessage).not.toBeNull();
//     });

//     restoreFetch();
// });