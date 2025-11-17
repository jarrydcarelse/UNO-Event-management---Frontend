import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import Tasks from '../pages/Tasks';
import axios from 'axios';

jest.mock('axios');
jest.mock('../components/Navbar', () => () => <div>MockNavbar</div>);
jest.mock('../components/LoadingSpinner', () => () => <div>Loading...</div>);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Component Snapshots', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('Dashboard renders correctly with data', async () => {
    const mockEvents = [
      { id: 1, title: 'Event 1', date: new Date('2025-12-01'), status: 'In Progress', progress: 50 },
      { id: 2, title: 'Event 2', date: new Date('2025-12-15'), status: 'Completed', progress: 100 },
    ];

    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2025-11-20T00:00:00.000Z',
        completed: false,
        assignedToEmail: 'user1@example.com',
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        dueDate: '2025-11-25T00:00:00.000Z',
        completed: true,
        assignedToEmail: 'user2@example.com',
      },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events')) return Promise.resolve({ data: mockEvents });
      if (url.includes('/api/eventtasks')) return Promise.resolve({ data: mockTasks });
      return Promise.resolve({ data: [] });
    });

    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(container).toMatchSnapshot();
  });

  test('Events page renders correctly', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: [] }));

    const { container } = render(
      <BrowserRouter>
        <Events />
      </BrowserRouter>
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(container).toMatchSnapshot();
  });

  test('Tasks page renders correctly with empty state', async () => {
    axios.get.mockResolvedValue({ data: [] });

    const { container } = render(<Tasks />);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(container).toMatchSnapshot();
  });
});
