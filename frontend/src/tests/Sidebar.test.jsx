import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import SideBar from '../components/SideBar';


// The render setup for the tests
// Modify if additional changes are made to the Sidebar component
const renderWithRouter = (initialEntries = ['/'], routeConfig = {}) => {
    const defaultRoutes = {
        '/': <><SideBar /><div>Home Page</div></>,
        '/Building': <><SideBar /><div>Building Page</div></>,
    };

    const routes = { ...defaultRoutes, ...routeConfig };

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                {Object.entries(routes).map(([path, element]) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Routes>
        </MemoryRouter>
    );
};

test('Sidebar renders correctly', () => {
    renderWithRouter();

    const buildingsElement = screen.getByText('Buildings');
    expect(buildingsElement).not.toBeNull();
});

test('TUQuiet link navigates correctly to landing page', () => {
    renderWithRouter(['/Building']);

    const homeLinkElement = screen.getByTestId('home-link');
    fireEvent.click(homeLinkElement);

    expect(screen.getByText('Home Page')).toBeTruthy();
});

test('Buildings link navigates correctly', () => {
    renderWithRouter(['/']);

    const buildingsElement = screen.getByText('Buildings');
    fireEvent.click(buildingsElement);

    expect(screen.getByText('Building Page')).toBeTruthy();
});