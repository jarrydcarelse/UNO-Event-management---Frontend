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
    axios.get.mockImplementation(() => new Promise(() => {})); // simulate loading
    render(<Tasks />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders tasks after fetch', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: 'Task 1',
          description: 'Do something',
          dueDate: new Date().toISOString(),
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
          dueDate: new Date().toISOString(),
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
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<Tasks />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    });
  });
});
