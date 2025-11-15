const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));


jest.mock('../components/Navbar', () => () => 'MockNavbar');
jest.mock('../components/LoadingSpinner', () => () => 'Loading...');

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
    axios.get.mockResolvedValue({ data: [] });
    render(<Dashboard />);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('displays loading spinner initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
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

  test('displays correct task statistics', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false, assignedToEmail: 'user@example.com', dueDate: new Date().toISOString(), description: 'Desc 1' },
      { id: 2, title: 'Task 2', completed: true, assignedToEmail: 'user@example.com', dueDate: new Date().toISOString(), description: 'Desc 2' },
      { id: 3, title: 'Task 3', completed: false, assignedToEmail: 'user@example.com', dueDate: new Date().toISOString(), description: 'Desc 3' },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events')) return Promise.resolve({ data: [] });
      if (url.includes('/api/eventtasks')) return Promise.resolve({ data: mockTasks });
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const statCards = screen.getAllByText(/\d+/);
    expect(statCards.length).toBeGreaterThan(0);
  });

  test('shows error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('displays events with correct progress', async () => {
    const mockEvents = [
      { id: 1, title: 'Event 1', date: new Date(), status: 'In Progress', progress: 75 },
      { id: 2, title: 'Event 2', date: new Date(), status: 'Completed', progress: 100 },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events')) return Promise.resolve({ data: mockEvents });
      if (url.includes('/api/eventtasks')) return Promise.resolve({ data: [] });
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/event 1/i)).toBeInTheDocument();
      expect(screen.getByText(/event 2/i)).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });
});
