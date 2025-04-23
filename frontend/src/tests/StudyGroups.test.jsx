import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import StudyGroups from '../pages/StudyGroups';

test('renders StudyGroups page without data correctly', () => {
    render(<StudyGroups />);

    expect(screen.getByText("Create A Study Group Post")).not.toBeNull();
    expect(screen.getByTestId("group-search-input")).not.toBeNull();
});