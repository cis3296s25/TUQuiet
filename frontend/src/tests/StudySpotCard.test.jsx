import { expect, test } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
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
    const nameElement = screen.getAllByTestId('spot-name-1')[0];
    expect(nameElement).not.toBeNull();
});

// test('StudySpotCard renders description correctly', () => {
//     render(<StudySpotCard spot={spot} />);
//     const descriptionElement = screen.getByText("This is a test spot.", {exact: true});
//     expect(descriptionElement).not.toBeNull();
// });

test('StudySpotCard shows N/A when crowd level is not provided', () => {
    renderSpotCard(spot, {});
    const crowdLevelElement = screen.getByTestId('crowd-level-1');
    expect(crowdLevelElement.textContent).toEqual('N/A');
});

test('StudySpotCard shows N/A when noise level is not provided', () => {
    renderSpotCard(spot, {});
    const noiseLevelElement = screen.getByTestId('noise-level-1');
    expect(noiseLevelElement.textContent).toEqual('N/A');
});


test('StudySpotCard renders crowd level correctly', () => {
    renderSpotCard(spot, averages);

    const crowdLevelLabelElement = screen.getByTestId('crowd-level-label-1');
    const crowdLevelElement = screen.getByTestId('crowd-level-1');
    expect(crowdLevelLabelElement).not.toBeNull();
    expect(crowdLevelElement.textContent).toEqual('3');
});

test('StudySpotCard renders noise level correctly', () => {
    renderSpotCard(spot, averages);

    const noiseLevelLabelElement = screen.getByTestId('noise-level-label-1');
    const noiseLevelElement = screen.getByTestId('noise-level-1');
    expect(noiseLevelLabelElement).not.toBeNull();
    expect(noiseLevelElement.textContent).toEqual('2');
});

test('StudySpotCard renders last report time correctly', () => {
    renderSpotCard(spot, averages);

    const lastReportTimeElement = screen.getByTestId('last-report-time-1');
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
    const cardElement = screen.getByTestId('spot-card-1');
    fireEvent.click(cardElement);

    const formElement = screen.getByTestId('reporting-form');
    expect(formElement).not.toBeNull();
});
