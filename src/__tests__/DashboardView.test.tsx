import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { DashboardView } from '../views/DashboardView';

describe('DashboardView Phase Tabs', () => {
  const mockLogout = vi.fn();

  test('phase tabs are buttons with role="tab" and are selectable', () => {
    render(<DashboardView onLogout={mockLogout} />);
    
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);
    
    const secondTab = tabs[1];
    expect(secondTab).toBeInTheDocument();
    
    fireEvent.click(secondTab);
    
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });
});

describe('DashboardView Demo Loading', () => {
  const mockLogout = vi.fn();

  test('loads demo swing and sets correct state', async () => {
    render(<DashboardView onLogout={mockLogout} />);
    
    const loadDemoBtn = screen.getByText('Load Demo Swing');
    fireEvent.click(loadDemoBtn);
    
    expect(screen.getByText('Selected: demo-swing.mp4')).toBeInTheDocument();
    expect(screen.getByText('ADDRESS')).toBeInTheDocument(); // First phase of DEMO_ANALYSIS
    
    // Verify demo tips are displayed (DEMO_TIPS contains "Improve Shoulder Tilt" and "The Pause Drill")
    expect(await screen.findByText(/Improve Shoulder Tilt/i)).toBeInTheDocument();
    expect(await screen.findByText(/The Pause Drill/i)).toBeInTheDocument();
  });
});


