import { expect, test, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mockFetch, restoreFetch } from './utils/MockFetch';
import StudyGroupForm from '../components/StudyGroupForm';

const renderStudyGroupForm = () => {
    return render(<StudyGroupForm />);
}

test('renders StudyGroupForm correctly', () => {
    renderStudyGroupForm();

    expect(screen.getByText("Organizer Name")).not.toBeNull();
    expect(screen.getByText("Major")).not.toBeNull();
    expect(screen.getByText("Course Code")).not.toBeNull();
    expect(screen.getByText("Title")).not.toBeNull();
    expect(screen.getByText("Description")).not.toBeNull();
    expect(screen.getByText("Date")).not.toBeNull();
    expect(screen.getByText("Time")).not.toBeNull();
    expect(screen.getByText("Location")).not.toBeNull();
    expect(screen.getByText("Max Participants")).not.toBeNull();

    expect(screen.getByText("Post")).not.toBeNull();
});

test('handles form submission', async () => {
    mockFetch({ status: 200, data: { message: 'Success' } });
    const handleSubmit = vitest.fn();

    render(<StudyGroupForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByTestId("groupForm-name-input"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByTestId("groupForm-major-input"), { target: { value: "Computer Science" } });
    fireEvent.change(screen.getByTestId("groupForm-course-code-input"), { target: { value: "CS101" } });
    fireEvent.change(screen.getByTestId("groupForm-title-input"), { target: { value: "Study Group" } });
    fireEvent.change(screen.getByTestId("groupForm-description-input"), { target: { value: "Let's study together!" } });
    fireEvent.change(screen.getByTestId("groupForm-date-input"), { target: { value: "2023-10-01" } });
    fireEvent.change(screen.getByTestId("groupForm-time-input"), { target: { value: "10:00" } });
    fireEvent.change(screen.getByTestId("groupForm-location-input"), { target: { value: "Library" } });
    fireEvent.change(screen.getByTestId("groupForm-max-participants-input"), { target: { value: "5" } });

    fireEvent.click(screen.getByText("Post"));


    await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
    });

    restoreFetch();
});

test('handles form submission with empty fields', async () => {
    mockFetch({ status: 400, data: { message: 'Error' } });
    const handleSubmit = vitest.fn();

    render(<StudyGroupForm onSubmit={handleSubmit} />);

    fireEvent.click(screen.getByText("Post"));

    await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    restoreFetch();
});