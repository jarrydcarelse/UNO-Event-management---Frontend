import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login'; 
import axios from 'axios';


jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('axios');

describe('Login Page', () => {
  test('renders login form and allows user to input email and password', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows error on login failure', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    const errorMessage = await screen.findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls axios and navigates on successful login', async () => {
    const mockPush = jest.fn();
    const token = 'fake-jwt-token';
    jest.mocked(require('next/router').useRouter).mockReturnValue({ push: mockPush });

    axios.post.mockResolvedValue({
      data: { token },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'adminpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/login'),
        {
          email: 'admin@example.com',
          password: 'adminpass',
        },
        expect.any(Object)
      );
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
