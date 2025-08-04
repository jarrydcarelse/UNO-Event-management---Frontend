// src/_tests_/Dashboard.test.js

// Mock react-router-dom BEFORE importing Dashboard
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));


// Mock child components as simple strings to avoid React scope errors
jest.mock('../components/Navbar', () => () => 'MockNavbar');
jest.mock('../components/LoadingSpinner', () => () => 'Loading...');

// Mock axios
jest.mock('axios');

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import axios from 'axios';

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('redirects to login if token is missing', () => {
    localStorage.removeItem('token');
    render(<Dashboard />);
    // You will need to check if your mockNavigate is called, but
    // since useNavigate returns jest.fn(), you'll want to 
    // store that in a variable and check calls, or alternatively 
    // check some UI change or console output depending on your code.
  });

  test('displays loading spinner initially', () => {
    render(<Dashboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders stats and tasks after loading', async () => {
    const mockEvents = [{ id: 1, title: 'Test Event', date: new Date(), status: 'In Progress', progress: 50 }];
    const mockTasks = [{
      id: 1,
      title: 'Test Task',
      description: 'Test Desc',
      dueDate: new Date().toISOString(),
      completed: false,
      assignedToEmail: 'user@example.com'
    }];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events')) return Promise.resolve({ data: mockEvents });
      if (url.includes('/api/eventtasks')) return Promise.resolve({ data: mockTasks });
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/active events/i)).toBeInTheDocument();
      expect(screen.getByText(/open tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/recent tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/test event/i)).toBeInTheDocument();
      expect(screen.getByText(/test task/i)).toBeInTheDocument();
    });
  });
});
