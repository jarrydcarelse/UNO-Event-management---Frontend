// __tests__/Employees.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Employees from '../pages/Employees';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock child components
jest.mock('../components/Navbar', () => () => <div>MockNavbar</div>);
jest.mock('../components/LoadingSpinner', () => () => <div>Loading...</div>);

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Employees', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner initially', () => {
    // axios.get won't resolve immediately, so loading stays true
    axios.get.mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter>
        <Employees />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByText(/MockNavbar/i)).toBeInTheDocument();
  });

  test('renders employees list after loading', async () => {
    const mockEmployees = [
      { id: 1, name: 'Alice', role: 'Developer' },
      { id: 2, name: 'Bob', role: 'Designer' },
    ];

    axios.get.mockResolvedValue({ data: mockEmployees });

    render(
      <BrowserRouter>
        <Employees />
      </BrowserRouter>
    );

    // Wait for loading to finish and employees to be rendered
    await waitFor(() => {
      mockEmployees.forEach(emp => {
        expect(screen.getByText(emp.name)).toBeInTheDocument();
        expect(screen.getByText(emp.role)).toBeInTheDocument();
      });
    });
  });

  test('handles fetch error gracefully', async () => {
    // Optionally test error case if you implement error UI/logging
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    axios.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <Employees />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching employees:',
        expect.any(Error)
      );
      // Could test for fallback UI if you add any
    });

    consoleSpy.mockRestore();
  });
});
