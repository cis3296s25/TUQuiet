import { expect, test, vitest } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportingForm from '../components/ReportingForm';


// Mock the fetch function globally
// Allows us to mock the fetch API for our tests
export const mockFetch = (response = {}, success = true) => {
    global.fetch = vitest.fn(() =>
        Promise.resolve({
            ok: success,
            json: () => Promise.resolve(response),
        })
    );
};

export const restoreFetch = () => {
    global.fetch.mockRestore();
};

test('Radio button is selected', () => {
    const { getByLabelText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={() => {}} />
        </MemoryRouter>
    );

    const crowdLevelInput = getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);
    expect(crowdLevelInput.checked).toBe(true);
});

test('Radio button changes crowd level', () => {
    const { getByLabelText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={() => {}} />
        </MemoryRouter>
    );

    const crowdLevelInput = getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);
    expect(crowdLevelInput.value).toBe('5');
});

test('Radio button changes noise level', () => {
    const { getByLabelText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={() => {}} />
        </MemoryRouter>
    );

    const noiseLevelInput = getByLabelText('5', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput);
    expect(noiseLevelInput.value).toBe('5');
});

test('Radio button changes crowd level multiple times', () => {
    const { getByLabelText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={() => {}} />
        </MemoryRouter>
    );

    const crowdLevelInput = getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);
    expect(crowdLevelInput.value).toBe('5');

    const crowdLevelInput2 = getByLabelText('3', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput2);
    expect(crowdLevelInput2.value).toBe('3');
});

test('Radio button changes noise level multiple times', () => {
    const { getByLabelText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={() => {}} />
        </MemoryRouter>
    );

    const noiseLevelInput = getByLabelText('5', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput);
    expect(noiseLevelInput.value).toBe('5');

    const noiseLevelInput2 = getByLabelText('3', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput2);
    expect(noiseLevelInput2.value).toBe('3');
});

test('Does not submit form when no radio button is selected', async () => {
    mockFetch({ success: true });
    const handleSubmit = vitest.fn();
    const { getByText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={handleSubmit} />
        </MemoryRouter>
    );

    const submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    restoreFetch();
});

test('Does not submit form when only one radio button is selected', async () => {
    mockFetch({ success: true });
    const handleSubmit = vitest.fn();
    const { getByLabelText, getByText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={handleSubmit} />
        </MemoryRouter>
    );

    const crowdLevelInput = getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);

    const submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    restoreFetch();
});

test('Submits form when radio buttons are selected', async () => {
    mockFetch({ success: true });

    const handleSubmit = vitest.fn();
    const { getByLabelText, getByText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={handleSubmit} />
        </MemoryRouter>
    );

    const crowdLevelInput = getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    fireEvent.click(crowdLevelInput);

    const noiseLevelInput = getByLabelText('5', { selector: 'input[name="Noise Level"]' });
    fireEvent.click(noiseLevelInput);

    const submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
    });

    restoreFetch();
});