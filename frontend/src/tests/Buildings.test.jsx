import { expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Buildings from '../pages/Buildings';
import { mockFetch, restoreFetch } from './utils/MockFetch';

const renderBuildings = () => {
    return render(
        <MemoryRouter>
            <Buildings />
        </MemoryRouter>
    );
};

test('Buildings renders loading skeleton while fetching data', () => {
    mockFetch(new Promise(() => {}));

    renderBuildings();

    const skeletonElement = screen.getByText(/Find A Place To Study/i);
    expect(skeletonElement).not.toBeNull();

    restoreFetch();
});

test('Buildings renders building cards after data is fetched', async () => {
    const mockBuildings = [
        { id: 1, name: 'Library', description: 'A quiet place to study.', img: 'library.jpg' },
        { id: 2, name: 'Cafeteria', description: 'A lively place to study.', img: 'cafeteria.jpg' },
    ];

    mockFetch(mockBuildings);

    renderBuildings();

    await waitFor(() => {
        const buildingCards = screen.getAllByTestId('building-spot-card');
        expect(buildingCards).toHaveLength(mockBuildings.length);

        mockBuildings.forEach((building) => {
            expect(screen.getByText(building.name)).not.toBeNull();
        });
    });

    restoreFetch();
});

test('Buildings handles fetch errors gracefully', async () => {
    mockFetch({}, false);

    renderBuildings();

    await waitFor(() => {
        const errorMessage = screen.queryByText(/Error fetching buildings/i);
        expect(errorMessage).toBeNull();
    });

    restoreFetch();
});

