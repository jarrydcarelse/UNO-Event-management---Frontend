import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import EventTasks from '../pages/EventTasks';
import axios from 'axios';

jest.mock('axios');
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">MockNavbar</div>);
jest.mock('../components/LoadingSpinner', () => () => <div data-testid="spinner">Loading...</div>);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ eventId: '123' }),
}));

describe('EventTasks Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders loading spinner initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    
    render(
      <MemoryRouter initialEntries={['/event-tasks/123']}>
        <EventTasks />
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('displays event details and tasks after loading', async () => {
    const mockEvent = {
      id: 123,
      title: 'Test Event',
      description: 'Test Description',
      date: '2025-12-01T00:00:00.000Z',
    };

    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2025-11-20T00:00:00.000Z',
        priority: 'High',
        assignedToEmail: 'user@example.com',
        completed: false,
        budget: 'R5000',
        eventId: 123,
        archived: false,
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        dueDate: '2025-11-25T00:00:00.000Z',
        priority: 'Low',
        assignedToEmail: 'user2@example.com',
        completed: true,
        budget: 'R3000',
        eventId: 123,
        archived: false,
      },
    ];

    const mockUsers = [
      { id: 1, email: 'user@example.com' },
      { id: 2, email: 'user2@example.com' },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events/123')) {
        return Promise.resolve({ data: mockEvent });
      }
      if (url.includes('/api/eventtasks/byevent/123')) {
        return Promise.resolve({ data: mockTasks });
      }
      if (url.includes('/api/users')) {
        return Promise.resolve({ data: mockUsers });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(
      <MemoryRouter initialEntries={['/event-tasks/123']}>
        <EventTasks />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('separates pending and completed tasks correctly', async () => {
    const mockEvent = {
      id: 123,
      title: 'Test Event',
      description: 'Test Description',
      date: '2025-12-01T00:00:00.000Z',
    };

    const mockTasks = [
      {
        id: 1,
        title: 'Pending Task',
        description: 'Pending',
        dueDate: '2025-11-20T00:00:00.000Z',
        priority: 'High',
        assignedToEmail: 'user@example.com',
        completed: false,
        budget: 'R5000',
        eventId: 123,
        archived: false,
      },
      {
        id: 2,
        title: 'Completed Task',
        description: 'Completed',
        dueDate: '2025-11-25T00:00:00.000Z',
        priority: 'Low',
        assignedToEmail: 'user2@example.com',
        completed: true,
        budget: 'R3000',
        eventId: 123,
        archived: false,
      },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events/123')) return Promise.resolve({ data: mockEvent });
      if (url.includes('/api/eventtasks/byevent/123')) return Promise.resolve({ data: mockTasks });
      if (url.includes('/api/users')) return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Not found'));
    });

    render(
      <MemoryRouter initialEntries={['/event-tasks/123']}>
        <EventTasks />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
      expect(screen.getByText('Pending Task')).toBeInTheDocument();
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });
  });

  test('calculates progress percentage correctly', async () => {
    const mockEvent = {
      id: 123,
      title: 'Test Event',
      description: 'Test Description',
      date: '2025-12-01T00:00:00.000Z',
    };

    const mockTasks = [
      { id: 1, title: 'Task 1', completed: true, budget: 'R1000', assignedToEmail: 'user@example.com', dueDate: '2025-11-20T00:00:00.000Z', priority: 'High', description: 'Desc', eventId: 123, archived: false },
      { id: 2, title: 'Task 2', completed: true, budget: 'R2000', assignedToEmail: 'user@example.com', dueDate: '2025-11-20T00:00:00.000Z', priority: 'High', description: 'Desc', eventId: 123, archived: false },
      { id: 3, title: 'Task 3', completed: false, budget: 'R3000', assignedToEmail: 'user@example.com', dueDate: '2025-11-20T00:00:00.000Z', priority: 'High', description: 'Desc', eventId: 123, archived: false },
      { id: 4, title: 'Task 4', completed: false, budget: 'R4000', assignedToEmail: 'user@example.com', dueDate: '2025-11-20T00:00:00.000Z', priority: 'High', description: 'Desc', eventId: 123, archived: false },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events/123')) return Promise.resolve({ data: mockEvent });
      if (url.includes('/api/eventtasks/byevent/123')) return Promise.resolve({ data: mockTasks });
      if (url.includes('/api/users')) return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Not found'));
    });

    render(
      <MemoryRouter initialEntries={['/event-tasks/123']}>
        <EventTasks />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Overall Progress: 50%/i)).toBeInTheDocument();
      expect(screen.getByText(/Tasks Completed: 2 \| 4/i)).toBeInTheDocument();
    });
  });

  test('opens add task modal when Add Task button is clicked', async () => {
    const mockEvent = {
      id: 123,
      title: 'Test Event',
      description: 'Test Description',
      date: '2025-12-01T00:00:00.000Z',
    };

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events/123')) return Promise.resolve({ data: mockEvent });
      if (url.includes('/api/eventtasks/byevent/123')) return Promise.resolve({ data: [] });
      if (url.includes('/api/users')) return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Not found'));
    });

    render(
      <MemoryRouter initialEntries={['/event-tasks/123']}>
        <EventTasks />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });

    const addButton = screen.getByText(/Add Task/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const mockUsers = [
      { id: 1, email: 'user@example.com' },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/users')) {
        return Promise.resolve({ data: mockUsers });
      }
      if (url.includes('/api/eventtasks/byevent/123')) {
        return Promise.reject(new Error('API Error'));
      }
      if (url.includes('/api/events/123')) {
        return Promise.reject(new Error('API Error'));
      }
      return Promise.reject(new Error('Not found'));
    });

    render(
      <MemoryRouter initialEntries={['/event-tasks/123']}>
        <EventTasks />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load event data/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
