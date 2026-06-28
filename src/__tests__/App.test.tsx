import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App Skeleton', () => {
  it('renders AuthView initially', () => {
    render(<App />);
    expect(screen.getByText('Golf Swing AI Login')).toBeInTheDocument();
  });

  it('navigates to DashboardView after login', () => {
    render(<App />);
    const loginBtn = screen.getByText('Login / Register');
    fireEvent.click(loginBtn);
    expect(screen.getByText('Swing Analysis')).toBeInTheDocument();
  });

  it('navigates back to AuthView after logout', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Login / Register'));
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('Golf Swing AI Login')).toBeInTheDocument();
  });
});
