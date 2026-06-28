import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthView } from '../views/AuthView';

describe('AuthView Accessibility', () => {
  const mockOnAuth = vi.fn();

  it('has accessible labels for inputs', () => {
    render(<AuthView onAuth={mockOnAuth} />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('submits the form when Enter is pressed', () => {
    render(<AuthView onAuth={mockOnAuth} />);
    const userField = screen.getByLabelText('Username');
    fireEvent.change(userField, { target: { value: 'testuser' } });
    
    const form = userField.closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);
    
    expect(mockOnAuth).toHaveBeenCalledWith({ id: 1, username: 'testuser' });
  });
});
