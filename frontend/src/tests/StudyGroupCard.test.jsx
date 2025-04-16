import { expect, test, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StudyGroupCard from '../components/StudyGroupCard';

const renderStudyGroupCard = (group) => {
    return render(<StudyGroupCard {...group} />);
}

const mockStudyGroup = {
    id: 1,
    name: "Study Group 1",
    description: "A study group for math enthusiasts.",
    location: "Room 101, Charles Library",
    time: "2025-04-13T12:00:00Z",
    participantsCurrent: 5,
    participantsMax: 10,
    likes: 10,
    comments: [],
}

test('renders StudyGroupCard with correct data', () => {

    renderStudyGroupCard({ group: mockStudyGroup });

    expect(screen.getByText("Study Group 1")).not.toBeNull();
    expect(screen.getByText("A study group for math enthusiasts.")).not.toBeNull();
    expect(screen.getByText("Room 101, Charles Library")).not.toBeNull();
    expect(screen.getByText("2025-04-13T12:00:00Z")).not.toBeNull();
    expect(screen.getByText("5/10")).not.toBeNull();
});

test('handles comment submission', () => {

  render(<StudyGroupCard group={mockStudyGroup} />);

  const nameInput = screen.getByTestId("commenter-name-input");
  const commentInput = screen.getByPlaceholderText("Leave a comment...");
  const postButton = screen.getByText("Post");

  fireEvent.change(nameInput, { target: { value: "Charlie" } });
  fireEvent.change(commentInput, { target: { value: "Great group!" } });

  fireEvent.click(postButton);

  expect(screen.getByText("Charlie")).not.toBeNull();
  expect(screen.getByText("Great group!")).not.toBeNull();

  expect(nameInput.value).toBe("");
  expect(commentInput.value).toBe("");
});

test('handles comment submission with empty name', () => {
    render(<StudyGroupCard group={mockStudyGroup} />);

    const commentInput = screen.getByPlaceholderText("Leave a comment...");
    const postButton = screen.getByText("Post");

    fireEvent.change(commentInput, { target: { value: "Great group!" } });

    fireEvent.click(postButton);

    expect(screen.queryByText("Great group!")).toBeNull();
});

test('handles comment submission with empty comment', () => {
    render(<StudyGroupCard group={mockStudyGroup} />);

    const nameInput = screen.getByTestId("commenter-name-input");
    const postButton = screen.getByText("Post");

    fireEvent.change(nameInput, { target: { value: "Charlie" } });

    fireEvent.click(postButton);

    expect(screen.queryByText("Charlie")).toBeNull();
});

test('handles like button click', () => {
    
    render(<StudyGroupCard group={mockStudyGroup} />);
    
    const likeButton = screen.getByText("👍 10");
    
    fireEvent.click(likeButton);
    
    expect(screen.getByText("👍 11")).not.toBeNull();
});

test('handles unlike button click', () => {
    
    render(<StudyGroupCard group={mockStudyGroup} />);
    
    const likeButton = screen.getByText("👍 10");
    
    fireEvent.click(likeButton);

    expect(screen.getByText("👍 11")).not.toBeNull();

    fireEvent.click(likeButton);
    
    expect(screen.getByText("👍 10")).not.toBeNull();
});


test("handles join group button click", () => {

    render(<StudyGroupCard group={mockStudyGroup} />);

    const nameForPostInput = screen.getByTestId("join-name-input");
    const joinButton = screen.getByText("Join Group");

    fireEvent.change(nameForPostInput, { target: { value: "Joey" } });
    fireEvent.click(joinButton);

    expect(joinButton.textContent).toBe("Leave Group");
    expect(screen.getByText("6/10")).not.toBeNull();
});

test("handles leave group button click", () => {

    render(<StudyGroupCard group={mockStudyGroup} />);

    const nameForPostInput = screen.getByTestId("join-name-input");
    const joinButton = screen.getByText("Join Group");

    fireEvent.change(nameForPostInput, { target: { value: "Joey" } });
    fireEvent.click(joinButton);

    expect(joinButton.textContent).toBe("Leave Group");
    expect(screen.getByText("6/10")).not.toBeNull();

    fireEvent.click(joinButton);

    expect(joinButton.textContent).toBe("Join Group");
    expect(screen.getByText("5/10")).not.toBeNull();
});

test('handles join group button click with empty name', () => {
    render(<StudyGroupCard group={mockStudyGroup} />);

    const joinButton = screen.getByText("Join Group");

    fireEvent.click(joinButton);

    expect(joinButton.textContent).toBe("Join Group");
});

test('handles join group button with max participants reached', () => {
    const groupWithMaxParticipants = {
        ...mockStudyGroup,
        participantsCurrent: 10,
    };

    render(<StudyGroupCard group={groupWithMaxParticipants} />);

    const nameForPostInput = screen.getByTestId("join-name-input");
    const joinButton = screen.getByText("Join Group");

    fireEvent.change(nameForPostInput, { target: { value: "Joey" } });
    fireEvent.click(joinButton);

    expect(joinButton.textContent).toBe("Join Group");

    expect(screen.getByText("10/10")).not.toBeNull();
});

