import { expect, test, vitest } from 'vitest';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { mockFetch, restoreFetch } from './utils/MockFetch';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StudySpotCard from '../components/StudySpotCard';

const spot = {
    id: 1,
    name: "Test Spot",
    description: "This is a test spot.",
    img: "test_image.jpg",
};

const averages = {
    averageCrowdLevel: 3,
    averageNoiseLevel: 2,
    reportCount: 5,
    lastReportTime: "2023-10-01T12:00:00Z",
};
const renderSpotCard = (spot = {}, averages = {}) => {
    return render(<StudySpotCard spot={spot} averages={averages} isLoadingAverages={false}/>);
};


test('StudySpotCard renders name correctly', () => {
    renderSpotCard(spot, averages);
    const nameElement = screen.getAllByTestId('spot-name')[0];
    expect(nameElement).not.toBeNull();
});

// test('StudySpotCard renders description correctly', () => {
//     render(<StudySpotCard spot={spot} />);
//     const descriptionElement = screen.getByText("This is a test spot.", {exact: true});
//     expect(descriptionElement).not.toBeNull();
// });

test('StudySpotCard shows N/A when crowd level is not provided', () => {
    renderSpotCard(spot, {});
    const crowdLevelElement = screen.getByTestId('crowd-level');
    expect(crowdLevelElement.textContent).toEqual('N/A');
});

test('StudySpotCard shows N/A when noise level is not provided', () => {
    renderSpotCard(spot, {});
    const noiseLevelElement = screen.getByTestId('noise-level');
    expect(noiseLevelElement.textContent).toEqual('N/A');
});


test('StudySpotCard renders crowd level correctly', () => {
    renderSpotCard(spot, averages);

    const crowdLevelLabelElement = screen.getByTestId('crowd-level-label');
    const crowdLevelElement = screen.getByTestId('crowd-level');
    expect(crowdLevelLabelElement).not.toBeNull();
    expect(crowdLevelElement.textContent).toEqual('3');
});

test('StudySpotCard renders noise level correctly', () => {
    renderSpotCard(spot, averages);

    const noiseLevelLabelElement = screen.getByTestId('noise-level-label');
    const noiseLevelElement = screen.getByTestId('noise-level');
    expect(noiseLevelLabelElement).not.toBeNull();
    expect(noiseLevelElement.textContent).toEqual('2');
});

test('StudySpotCard renders last report time correctly', () => {
    renderSpotCard(spot, averages);

    screen.debug();
    const lastReportTimeElement = screen.getByTestId('last-report-time');
    expect(lastReportTimeElement).not.toBeNull();
});

test('StudySpotCard opens form when clicked', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="/"
                    element={<StudySpotCard spot={spot} averages={averages} isLoadingAverages={false}/>}
                />
            </Routes>
        </MemoryRouter>
    )
    const cardElement = screen.getByTestId('spot-card');
    fireEvent.click(cardElement);

    const formElement = screen.getByTestId('reporting-form');
    expect(formElement).not.toBeNull();
});
