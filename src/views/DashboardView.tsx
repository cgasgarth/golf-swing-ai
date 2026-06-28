import React from 'react';
import { SwingMetrics, PhaseData } from '../types';

const MockMetrics: SwingMetrics = { clubAngle: 45, shoulderTilt: 12, hipRotation: 30, tempo: '3:1' };
const MockPhases: PhaseData[] = [
  { phase: 'address', timestamp: 0, metrics: MockMetrics },
  { phase: 'takeaway', timestamp: 1, metrics: MockMetrics },
  { phase: 'top', timestamp: 2, metrics: MockMetrics },
  { phase: 'downswing', timestamp: 3, metrics: MockMetrics },
  { phase: 'impact', timestamp: 4, metrics: MockMetrics },
  { phase: 'followthrough', timestamp: 5, metrics: MockMetrics },
];

export const DashboardView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="dashboard">
      <header>
        <h1>Swing Analysis</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      
      <div className="upload-section">
        <input type="file" accept="video/*" />
        <button>Upload & Analyze</button>
      </div>

      <div className="analysis-grid">
        <div className="video-player">
          <div className="placeholder">Video Player Area</div>
          <div className="timeline">
            {MockPhases.map(p => (
              <div key={p.phase} className="phase-marker">{p.phase}</div>
            ))}
          </div>
        </div>

        <div className="metrics-panel">
          <h3>TrackMan Metrics</h3>
          <div className="metric-card">Club Angle: {MockMetrics.clubAngle}°</div>
          <div className="metric-card">Shoulder Tilt: {MockMetrics.shoulderTilt}°</div>
          <div className="metric-card">Hip Rotation: {MockMetrics.hipRotation}°</div>
          <div className="metric-card">Tempo: {MockMetrics.tempo}</div>
        </div>

        <div className="tips-panel">
          <h3>AI Drills & Tips</h3>
          <p>Your hip rotation is shallow at the top. Try the "Wall Drill".</p>
          <button>View Drill Video</button>
        </div>
      </div>
    </div>
  );
};
