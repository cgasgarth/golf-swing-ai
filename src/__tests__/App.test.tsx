import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Skeleton', () => {
  it('renders AuthView initially', () => {
    render(<App />);
    expect(screen.getByText('Golf Swing AI Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeRequired();
    expect(screen.getByLabelText('Password')).toBeRequired();
  });

  it('navigates to DashboardView after login', async () => {
    render(<App />);
    const userField = screen.getByPlaceholderText('Username');
    fireEvent.change(userField, { target: { value: 'testuser' } });
    const passField = screen.getByPlaceholderText('Password');
    fireEvent.change(passField, { target: { value: 'testpass' } });
    const loginBtn = screen.getByText('Login / Register');
    fireEvent.click(loginBtn);
    await waitFor(() => {
      expect(screen.getByText('Swing Analysis')).toBeInTheDocument();
    });
  });

  it('navigates back to AuthView after logout', async () => {
    render(<App />);
    const userField = screen.getByPlaceholderText('Username');
    fireEvent.change(userField, { target: { value: 'testuser' } });
    const passField = screen.getByPlaceholderText('Password');
    fireEvent.change(passField, { target: { value: 'testpass' } });
    fireEvent.click(screen.getByText('Login / Register'));
    
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('Golf Swing AI Login')).toBeInTheDocument();
  });

  it('fetches and displays AI tips from API when phase changes', async () => {
    const mockTips = [
      { id: 'api-1', title: 'API Drill', description: 'API Description', targetPhase: 'top', category: 'drill' }
    ];
    
    global.fetch = vi.fn().mockImplementation((url: string) => {
       if (url === '/swings/tips') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTips),
        } as Response);
      }
      return Promise.reject(new Error('Unknown API'));
    }) as any;

    render(<App />);
    const userField = screen.getByPlaceholderText('Username');
    fireEvent.change(userField, { target: { value: 'testuser' } });
    const passField = screen.getByPlaceholderText('Password');
    fireEvent.change(passField, { target: { value: 'testpass' } });
    fireEvent.click(screen.getByText('Login / Register'));

    await waitFor(() => {
      expect(screen.getByText('Swing Analysis')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('top'));
    
    await waitFor(() => {
      expect(screen.getByText(/DRILL: API Drill/)).toBeInTheDocument();
    });
    
     expect(global.fetch).toHaveBeenCalledWith('/swings/tips', expect.any(Object));
  });
});
