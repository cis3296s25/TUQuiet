import { expect, test, vitest } from 'vitest';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { mockFetch, restoreFetch } from './utils/MockFetch';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ReportingForm from '../components/ReportingForm';

// The render setup for the tests
// Modify if additional changes are made to the Sidebar component
const renderWithRouter = (initialEntries = ['/'], spot = { id: 1 }, onSubmit = () => {}) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route
                    path="/"
                    element={<ReportingForm spot={spot} onSubmit={onSubmit} />}
                />
            </Routes>
        </MemoryRouter>
    );
};  

test('Radio button is selected', () => {
    renderWithRouter();

    const crowdLevelInput = screen.getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);
    expect(crowdLevelInput.checked).toBe(true);
});

test('Radio button changes crowd level', () => {
    renderWithRouter();

    const crowdLevelInput = screen.getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);
    expect(crowdLevelInput.value).toBe('5');
});

test('Radio button changes noise level', () => {
    renderWithRouter();

    const noiseLevelInput = screen.getByLabelText('5', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput);
    expect(noiseLevelInput.value).toBe('5');
});

test('Radio button changes crowd level multiple times', () => {
    renderWithRouter();

    const crowdLevelInput = screen.getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);
    expect(crowdLevelInput.value).toBe('5');

    const crowdLevelInput2 = screen.getByLabelText('3', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput2);
    expect(crowdLevelInput2.value).toBe('3');
});

test('Radio button changes noise level multiple times', () => {
    renderWithRouter();

    const noiseLevelInput = screen.getByLabelText('5', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput);
    expect(noiseLevelInput.value).toBe('5');

    const noiseLevelInput2 = screen.getByLabelText('3', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput2);
    expect(noiseLevelInput2.value).toBe('3');
});

test('Does not submit form when no radio button is selected', async () => {
    mockFetch({ success: true });
    const handleSubmit = vitest.fn();
    renderWithRouter(['/'], { id: 1 }, handleSubmit);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    restoreFetch();
});

test('Does not submit form when only one radio button is selected', async () => {
    mockFetch({ success: true });
    const handleSubmit = vitest.fn();
    renderWithRouter(['/'], { id: 1 }, handleSubmit);

    const crowdLevelInput = screen.getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    restoreFetch();
});

test('Submits form when radio buttons are selected', async () => {
    mockFetch({ success: true });

    const handleSubmit = vitest.fn();
    renderWithRouter(['/'], { id: 1 }, handleSubmit);

    const crowdLevelInput = screen.getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);

    const noiseLevelInput = screen.getByLabelText('5', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
    });

    restoreFetch();
});