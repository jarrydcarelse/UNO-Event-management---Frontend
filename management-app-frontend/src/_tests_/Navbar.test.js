import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation links', () => {
    renderWithRouter(<Navbar isOpen={true} setIsOpen={jest.fn()} />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
  });

  test('toggles sidebar open/closed', () => {
    const setIsOpen = jest.fn();
    renderWithRouter(<Navbar isOpen={true} setIsOpen={setIsOpen} />);

    const toggleButton = screen.getByRole('button', { name: /collapse menu/i });
    fireEvent.click(toggleButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test('renders collapsed state correctly', () => {
    const { container } = renderWithRouter(<Navbar isOpen={false} setIsOpen={jest.fn()} />);

    const sidebar = container.querySelector('.sidebar');
    expect(sidebar).toHaveClass('collapsed');
  });

  test('renders expanded state correctly', () => {
    const { container } = renderWithRouter(<Navbar isOpen={true} setIsOpen={jest.fn()} />);

    const sidebar = container.querySelector('.sidebar');
    expect(sidebar).not.toHaveClass('collapsed');
  });

  test('navigates to correct routes when links are clicked', () => {
    renderWithRouter(<Navbar isOpen={true} setIsOpen={jest.fn()} />);

    const dashboardLink = screen.getByText(/Dashboard/i).closest('a');
    const eventsLink = screen.getByText(/Events/i).closest('a');
    const tasksLink = screen.getByText(/Tasks/i).closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(eventsLink).toHaveAttribute('href', '/events');
    expect(tasksLink).toHaveAttribute('href', '/tasks');
  });

  test('matches snapshot when open', () => {
    const { container } = renderWithRouter(<Navbar isOpen={true} setIsOpen={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  test('matches snapshot when closed', () => {
    const { container } = renderWithRouter(<Navbar isOpen={false} setIsOpen={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
