import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EmployeesStats from '../pages/EmployeesStats';


jest.mock('../components/Navbar', () => () => <div>MockNavbar</div>);
jest.mock('../components/LoadingSpinner', () => () => <div>Loading...</div>);

describe('EmployeesStats', () => {
  test('shows loading spinner initially and hides it after timeout', async () => {
    render(<EmployeesStats />);

  
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('MockNavbar')).toBeInTheDocument();

 
    await waitFor(
      () => {

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      },
      { timeout: 2500 } 
    );

    expect(screen.getByText('MockNavbar')).toBeInTheDocument();
  });
});
