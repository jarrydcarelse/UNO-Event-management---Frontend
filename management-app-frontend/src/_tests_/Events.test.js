import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Events from '../pages/Events';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';


jest.mock('axios');
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">MockNavbar</div>);
jest.mock('../components/LoadingSpinner', () => () => <div data-testid="spinner">Loading...</div>);

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Events Page', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => 'mock-token');

    jest.clearAllMocks();
  });

  test('shows loading initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<Events />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders events and requests after loading', async () => {

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events')) {
        return Promise.resolve({
          data: [
            { id: 1, title: 'Event 1', description: 'Client 1', date: new Date().toISOString() }
          ],
        });
      }
      if (url.includes('/api/users')) {
        return Promise.resolve({ data: [{ email: 'test@example.com' }] });
      }
      if (url.includes('/api/EventRequests')) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              title: 'Request 1',
              date: new Date().toISOString(),
              requesterName: 'John',
              status: 'Pending',
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<Events />);

    expect(await screen.findByText('Event 1')).toBeInTheDocument();
    expect(await screen.findByText('Request 1')).toBeInTheDocument();
    expect(await screen.findByText('All Events')).toBeInTheDocument();
  });

  test('filters events based on search query', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/events')) {
        return Promise.resolve({
          data: [
            { id: 1, title: 'Birthday Party', description: 'Client A', date: new Date().toISOString() },
            { id: 2, title: 'Corporate Meeting', description: 'Client B', date: new Date().toISOString() },
          ],
        });
      }
      if (url.includes('/api/users')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/EventRequests')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<Events />);

    await screen.findByText('Birthday Party');
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'birthday' } });

    expect(screen.getByText('Birthday Party')).toBeInTheDocument();
    expect(screen.queryByText('Corporate Meeting')).not.toBeInTheDocument();
  });

  test('opens add event modal when button clicked', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: [] }));

    renderWithRouter(<Events />);

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const addButton = screen.getByText(/Add New Event/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Event')).toBeInTheDocument();
    });
  });
});
