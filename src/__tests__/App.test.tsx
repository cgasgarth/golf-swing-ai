import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('fetches and displays AI tips from API when phase changes', async () => {
    const mockTips = [
      { id: 'api-1', title: 'API Drill', description: 'API Description', targetPhase: 'top', category: 'drill' }
    ];
    
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url === '/api/swings/tips') {
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
    fireEvent.click(screen.getByText('Login / Register'));

    fireEvent.click(screen.getByText('top'));
    
    await waitFor(() => {
      expect(screen.getByText(/DRILL: API Drill/)).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith('/api/swings/tips', expect.any(Object));
  });
});
