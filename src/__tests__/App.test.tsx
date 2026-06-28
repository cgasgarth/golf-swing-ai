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
    const userField = screen.getByPlaceholderText('Username');
    fireEvent.change(userField, { target: { value: 'testuser' } });
    const loginBtn = screen.getByText('Login / Register');
    fireEvent.click(loginBtn);
    expect(screen.getByText('Swing Analysis')).toBeInTheDocument();
  });

  it('navigates back to AuthView after logout', () => {
    render(<App />);
    const userField = screen.getByPlaceholderText('Username');
    fireEvent.change(userField, { target: { value: 'testuser' } });
    fireEvent.click(screen.getByText('Login / Register'));
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('Golf Swing AI Login')).toBeInTheDocument();
  });

  it('updates metrics and drills when phase markers are clicked', () => {
    render(<App />);
    const userField = screen.getByPlaceholderText('Username');
    fireEvent.change(userField, { target: { value: 'testuser' } });
    fireEvent.click(screen.getByText('Login / Register'));

    // Click 'top' phase: should see 90 deg and Wall Drill
    fireEvent.click(screen.getByText('top'));
    expect(screen.getByText(/Club Angle: 90°/)).toBeInTheDocument();
    expect(screen.getByText(/DRILL: Wall Drill/)).toBeInTheDocument();

    // Click 'takeaway' phase: should see 50 deg and Tempo Rhythm
    fireEvent.click(screen.getByText('takeaway'));
    expect(screen.getByText(/Club Angle: 50°/)).toBeInTheDocument();
    expect(screen.getByText(/TIP: Tempo Rhythm/)).toBeInTheDocument();

    // Click 'address' phase: should see 40 deg and no drills
    fireEvent.click(screen.getByText('address'));
    expect(screen.getByText(/Club Angle: 40°/)).toBeInTheDocument();
    expect(screen.getByText('No specific drills for this phase.')).toBeInTheDocument();
  });
});
