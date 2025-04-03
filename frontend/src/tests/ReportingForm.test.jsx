import { expect, test } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import ReportingForm from '../components/ReportingForm';

test('Radio button is selected', () => {
    const { getByLabelText } = render(
        <MemoryRouter>
            <ReportingForm spot={{ id: 1 }} onSubmit={() => {}} />
        </MemoryRouter>
    );
    
    // Get the radio button for crowd level 5
    const crowdLevelInput = getByLabelText('5', { selector: 'input[name="Crowd Level"]' });
    
    // Simulate selecting the radio button
    fireEvent.click(crowdLevelInput);
    
    // Assert that the radio button is selected
    expect(crowdLevelInput.checked).toBe(true);
});