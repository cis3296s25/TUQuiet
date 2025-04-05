import { expect, test, vitest } from 'vitest';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { mockFetch, restoreFetch } from './utils/MockFetch';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BuildingCard from '../components/BuildingCard';

// The render setup for the tests
// Modify if additional changes are made to the Sidebar component
const renderWithRouter = (initialEntries = ['/'], building = { id: 1, name: "Test Building", description: "This is a test building.", img: "test_image.jpg" }) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route
                    path="/"
                    element={<BuildingCard building={building} />}
                />
            </Routes>
        </MemoryRouter>
    );
};

test('BuildingCard renders correctly', () => {
    renderWithRouter();

    const nameElement = screen.getByText("Test Building", {exact: true});
    const descriptionElement = screen.getByText("This is a test building.", {exact: true});
    
    expect(nameElement).not.toBeNull();
    expect(descriptionElement).not.toBeNull();
});

test('BuildingCard renders prediction chart with no data', () => {
    renderWithRouter();

    const fallbackMessage = screen.getByText('No prediction data yet.');
    expect(fallbackMessage).not.toBeNull();
});


// THIS TEST DOES NOT CURRENTLY WORK
test('BuildingCard renders prediction chart with data', async () => {
    mockFetch([
        { time: '10:00', noise: 3, crowd: 4 },
        { time: '12:00', noise: 2, crowd: 5 },
    ]);

    renderWithRouter();


    await waitFor(() => {
        const chartElement = screen.getByTestId('prediction-chart');
        expect(chartElement).not.toBeNull();
    });


    restoreFetch();
});