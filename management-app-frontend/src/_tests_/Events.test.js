import React from 'react';
import { render, screen } from '@testing-library/react';
import Events from '../pages/Events';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';


jest.mock('axios');


const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Events Page', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => 'mock-token');

    jest.clearAllMocks();
  });

  test('shows loading initially', () => {
    renderWithRouter(<Events />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
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
    expect(await screen.findByRole('heading', { name: /events/i })).toBeInTheDocument();
  });
});
