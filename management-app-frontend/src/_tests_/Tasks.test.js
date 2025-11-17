import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Tasks from '../pages/Tasks';
import axios from 'axios';

jest.mock('axios');
jest.mock('../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../components/LoadingSpinner', () => () => <div data-testid="spinner" />);

describe('Tasks Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders loading state initially', async () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<Tasks />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders tasks after fetch', async () => {
    const fixedDate = '2025-11-15T10:00:00.000Z';
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: 'Task 1',
          description: 'Do something',
          dueDate: fixedDate,
          priority: 'High',
          assignedToEmail: 'user@example.com',
          completed: false,
          budget: 500,
          eventId: 123,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Do another thing',
          dueDate: fixedDate,
          priority: 'Low',
          assignedToEmail: 'another@example.com',
          completed: true,
          budget: 1000,
          eventId: 123,
        },
      ],
    });

    const { container } = render(<Tasks />);
    await waitFor(() => {
      expect(screen.getByText('Tasks Overview')).toBeInTheDocument();
    });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('shows error message on fetch fail', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<Tasks />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('calculates progress percentage correctly', async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, title: 'Task 1', completed: false, assignedToEmail: 'user@example.com', dueDate: '2025-11-15T00:00:00.000Z', priority: 'High', description: 'Desc', budget: 500, eventId: 123 },
        { id: 2, title: 'Task 2', completed: true, assignedToEmail: 'user@example.com', dueDate: '2025-11-15T00:00:00.000Z', priority: 'Low', description: 'Desc', budget: 1000, eventId: 123 },
        { id: 3, title: 'Task 3', completed: true, assignedToEmail: 'user@example.com', dueDate: '2025-11-15T00:00:00.000Z', priority: 'Medium', description: 'Desc', budget: 750, eventId: 123 },
        { id: 4, title: 'Task 4', completed: false, assignedToEmail: 'user@example.com', dueDate: '2025-11-15T00:00:00.000Z', priority: 'High', description: 'Desc', budget: 500, eventId: 123 },
      ],
    });

    render(<Tasks />);

    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText(/Total Tasks/i)).toBeInTheDocument();
    });
  });

  it('displays both in-progress and completed tasks in separate sections', async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, title: 'Active Task', completed: false, assignedToEmail: 'user@example.com', dueDate: '2025-11-15T00:00:00.000Z', priority: 'High', description: 'Active', budget: 500, eventId: 123 },
        { id: 2, title: 'Done Task', completed: true, assignedToEmail: 'user@example.com', dueDate: '2025-11-15T00:00:00.000Z', priority: 'Low', description: 'Done', budget: 1000, eventId: 123 },
      ],
    });

    render(<Tasks />);

    await waitFor(() => {
      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings.some(h => h.textContent === 'In Progress')).toBe(true);
      expect(headings.some(h => h.textContent === 'Completed')).toBe(true);
      expect(screen.getByText('Active Task')).toBeInTheDocument();
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
  });
});
