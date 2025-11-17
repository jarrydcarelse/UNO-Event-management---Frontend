import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../pages/SignUp';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form correctly', () => {
    renderWithRouter(<SignUp />);
    expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat Password/i)).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Repeat Password/i), {
      target: { value: 'different123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('calls API and redirects on successful signup', async () => {
    jest.useFakeTimers();
    axios.post.mockResolvedValueOnce({
      data: { message: 'Registration successful!' },
    });

    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Repeat Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() =>
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument()
    );

    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    
    jest.useRealTimers();
  });

  test('shows error message on signup failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: 'User already exists.' },
      },
    });

    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Repeat Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(await screen.findByText(/User already exists/i)).toBeInTheDocument();
  });
});
