// __tests__/SignUp.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../signup/SignUp';
import axios from 'axios';
import { useRouter } from 'next/router';

jest.mock('axios');

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SignUp Component', () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  test('renders signup form correctly', () => {
    render(<SignUp />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat Password/i)).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    render(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Repeat Password/i), {
      target: { value: 'different123' },
    });
    fireEvent.click(screen.getByText(/Sign Up/i));
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('calls API and redirects on successful signup', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Registration successful!' },
    });

    render(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Repeat Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() =>
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  test('shows error message on signup failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: 'User already exists.' },
      },
    });

    render(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Repeat Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/Sign Up/i));

    expect(await screen.findByText(/User already exists/i)).toBeInTheDocument();
  });
});
