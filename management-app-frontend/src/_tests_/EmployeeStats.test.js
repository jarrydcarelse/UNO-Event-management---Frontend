import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EmployeesStats from '../employeesstats/EmployeesStats';

// Mock child components to isolate test
jest.mock('../components/Navbar', () => () => <div>MockNavbar</div>);
jest.mock('../components/LoadingSpinner', () => () => <div>Loading...</div>);

describe('EmployeesStats', () => {
  test('shows loading spinner initially and hides it after timeout', async () => {
    render(<EmployeesStats />);

    // Initially shows loading spinner
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('MockNavbar')).toBeInTheDocument();

    // Wait for the loading state to end
    await waitFor(
      () => {
        // After 2 seconds the spinner should be gone
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      },
      { timeout: 2500 } // slightly more than 2000ms to be safe
    );

    // Component still renders Navbar
    expect(screen.getByText('MockNavbar')).toBeInTheDocument();
  });
});
