import { expect, test, vitest } from 'vitest';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { mockFetch, restoreFetch } from './utils/MockFetch';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Sidebar from '../components/Sidebar';

const renderDashboardLayout = (initialEntries = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/" element={<DashboardLayout />} />
            </Routes>
        </MemoryRouter>
    );
}

test('DashboardLayout renders Sidebar', () => {
    renderDashboardLayout();
    const sidebarElement = screen.getByTestId('sidebar');
    expect(sidebarElement).not.toBeNull();
});

test('DashboardLayout renders Outlet', () => {
    renderDashboardLayout();
    const outletElement = screen.getByTestId('dashboard-outlet');
    expect(outletElement).not.toBeNull();
});
