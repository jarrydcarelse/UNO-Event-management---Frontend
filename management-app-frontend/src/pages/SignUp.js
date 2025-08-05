import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SignUp from '../pages/SignUp';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

beforeEach(() => {
  axios.post.mockReset();
});

test('renders signup form elements', () => {
  renderWithRouter(<SignUp />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/repeat password/i)).toBeInTheDocument();
  expect(screen.getByText(/sign up/i)).toBeInTheDocument();
});

test('shows error if passwords do not match', async () => {
  renderWithRouter(<SignUp />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: '123456' } });
  fireEvent.change(screen.getByLabelText(/repeat password/i), { target: { value: 'abcdef' } });

  fireEvent.click(screen.getByText(/^sign up$/i));
  expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
});

test('submits signup form and redirects on success', async () => {
  axios.post.mockResolvedValueOnce({ data: { message: 'Registration successful!' } });

  renderWithRouter(<SignUp />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText(/repeat password/i), { target: { value: 'password123' } });

  fireEvent.click(screen.getByText(/^sign up$/i));

  expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
});

test('shows error on failed signup', async () => {
  axios.post.mockRejectedValueOnce({
    response: { data: { message: 'User already exists' } },
  });

  renderWithRouter(<SignUp />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'duplicate@example.com' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass' } });
  fireEvent.change(screen.getByLabelText(/repeat password/i), { target: { value: 'pass' } });

  fireEvent.click(screen.getByText(/^sign up$/i));
  expect(await screen.findByText(/user already exists/i)).toBeInTheDocument();
});
