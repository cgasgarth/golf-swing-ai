import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { DashboardView } from '../views/DashboardView';

describe('DashboardView Initial State', () => {
  const mockLogout = vi.fn();

  test('shows empty state initially and hides analysis grid', () => {
    render(<DashboardView user={{ id: '1', username: 'testuser' }} onLogout={mockLogout} />);
    
    expect(screen.getByText('Ready for Analysis')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByText('TrackMan Metrics')).not.toBeInTheDocument();
  });
});

describe('DashboardView Phase Tabs', () => {
  const mockLogout = vi.fn();

  test('phase tabs are buttons with role="tab" and are selectable', () => {
    render(<DashboardView user={{ id: '1', username: 'testuser' }} onLogout={mockLogout} />);
    
    const loadDemoBtn = screen.getByText('Load Demo Swing');
    fireEvent.click(loadDemoBtn);
    
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
    render(<DashboardView user={{ id: '1', username: 'testuser' }} onLogout={mockLogout} />);
    
    const loadDemoBtn = screen.getByText('Load Demo Swing');
    fireEvent.click(loadDemoBtn);
    
    expect(screen.getByText('Selected: demo-swing.mp4')).toBeInTheDocument();
    expect(screen.getByText('ADDRESS')).toBeInTheDocument(); // First phase of DEMO_ANALYSIS
    
    // Verify demo tips are displayed (DEMO_TIPS contains "Improve Shoulder Tilt" and "The Pause Drill")
    expect(await screen.findByText(/Improve Shoulder Tilt/i)).toBeInTheDocument();
    expect(await screen.findByText(/The Pause Drill/i)).toBeInTheDocument();
  });
});

describe('DashboardView API Calls', () => {
  const mockLogout = vi.fn();
  const mockUser = { id: '123', username: 'testuser' };

  test('fetchTips sends phase and metrics to /swings/tips when phase is selected', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    render(<DashboardView user={mockUser} onLogout={mockLogout} />);
    
    const loadDemoBtn = screen.getByText('Load Demo Swing');
    fireEvent.click(loadDemoBtn);

    await waitFor(() => {
      const lastCall = fetchSpy.mock.calls[0];
      if (!lastCall) throw new Error('Fetch not called');
      const options = lastCall[1];
      if (!options) throw new Error('Fetch options missing');
      const bodyStr = options.body as string;
      const body = JSON.parse(bodyStr);
      expect(lastCall[0]).toBe('/swings/tips');
      expect(options.method).toBe('POST');
      expect(body).toHaveProperty('phase');
      expect(body).toHaveProperty('metrics');
    });

    fetchSpy.mockRestore();
  });

  test('successful upload and analyze flow', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ swingId: 456 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [{ phase: 'address', timestamp: 0, metrics: { clubAngle: 40, shoulderTilt: 12, hipRotation: 30, tempo: '3:1' } }]
        }),
      } as Response)
      .mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

    render(<DashboardView user={mockUser} onLogout={mockLogout} />);
    
    const fileInput = screen.getByTestId('video-upload-input');
    const file = new File(['video content'], 'test-swing.mp4', { type: 'video/mp4' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const analyzeBtn = screen.getByText('Upload & Analyze');
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByText('ADDRESS')).toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledWith('/swings/upload', expect.anything());
    expect(fetchSpy).toHaveBeenCalledWith('/swings/analyze', expect.anything());
    
    fetchSpy.mockRestore();
  });

  test('handles upload failure and uses fallback mock data', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<DashboardView user={mockUser} onLogout={mockLogout} />);
    
    const fileInput = screen.getByTestId('video-upload-input');
    const file = new File(['video content'], 'test-swing.mp4', { type: 'video/mp4' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const analyzeBtn = screen.getByText('Upload & Analyze');
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByText(/Analysis failed. Using mock data for demonstration/i)).toBeInTheDocument();
      expect(screen.getByText('ADDRESS')).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

});


