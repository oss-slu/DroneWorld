/* eslint-env jest */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FuzzyDashboard from '../components/FuzzyDashboard';

const renderDashboard = (initialEntries) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path='/dashboard' element={<FuzzyDashboard />} />
        <Route path='/reports' element={<div>Reports Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('FuzzyDashboard routing behavior', () => {
  test('shows fallback UI for direct /dashboard access without route state', () => {
    renderDashboard(['/dashboard']);

    expect(screen.getByText(/No Report Selected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Open a report from the Reports page/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Go to Reports/i }));
    expect(screen.getByText('Reports Page')).toBeInTheDocument();
  });

  test('renders monitor data from route state and supports back navigation', () => {
    const routeState = {
      data: {
        CircularDeviationMonitor: [],
        CollisionMonitor: [
          {
            type: 'text/plain',
            passContent: { Drone_1: ['No collision detected'] },
            failContent: {},
            fuzzyPath: 'fuzzy_path',
          },
        ],
        LandspaceMonitor: [],
        UnorderedWaypointMonitor: [],
        OrderedWaypointMonitor: [],
        PointDeviationMonitor: [],
        MinSepDistMonitor: [],
        NoFlyZoneMonitor: [],
        htmlFiles: [{ name: 'inspect.html', url: '/reports/inspect.html' }],
      },
      file: {
        fuzzy: false,
        fileName: '2026-03-08-10-57-11_Batch_2',
        fail: 0,
      },
      mainJson: { monitors: {} },
    };

    renderDashboard([{ pathname: '/dashboard', state: routeState }]);

    expect(
      screen.getByText(/2026-03-08-10-57-11_Batch_2 Detailed Report/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Acceptance Test: Drones shall avoid collisions with other drones and the environment/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Interactable HTMLs/i)).toBeInTheDocument();

    const htmlLink = screen.getByRole('link', { name: 'inspect.html' });
    expect(htmlLink).toBeInTheDocument();
    expect(htmlLink).toHaveAttribute('href', expect.stringContaining('/reports/inspect.html'));

    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Reports Page')).toBeInTheDocument();
  });
});
