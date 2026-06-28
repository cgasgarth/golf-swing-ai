import React from 'react';
import { SwingMetrics, PhaseData, Drill } from '../types';

const MockMetrics: SwingMetrics = { clubAngle: 45, shoulderTilt: 12, hipRotation: 30, tempo: '3:1' };
const MockPhases: PhaseData[] = [
  { phase: 'address', timestamp: 0, metrics: { ...MockMetrics, clubAngle: 40 } },
  { phase: 'takeaway', timestamp: 1, metrics: { ...MockMetrics, clubAngle: 50 } },
  { phase: 'top', timestamp: 2, metrics: { ...MockMetrics, clubAngle: 90 } },
  { phase: 'downswing', timestamp: 3, metrics: { ...MockMetrics, clubAngle: 60 } },
  { phase: 'impact', timestamp: 4, metrics: { ...MockMetrics, clubAngle: 0 } },
  { phase: 'followthrough', timestamp: 5, metrics: { ...MockMetrics, clubAngle: 110 } },
];

const MockDrills: Drill[] = [
  { id: '1', title: 'Wall Drill', description: 'Keep your shoulder tilt consistent.', targetPhase: 'top', category: 'drill' },
  { id: '2', title: 'Tempo Rhythm', description: 'Focus on the transition pause.', targetPhase: 'takeaway', category: 'tip' },
];

export const DashboardView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [selectedPhase, setSelectedPhase] = React.useState<PhaseData>(MockPhases[0]);
  const [fileName, setFileName] = React.useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Swing Analysis</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      
      <div className="upload-section">
        <input type="file" accept="video/*" onChange={handleFileChange} />
        {fileName && <span className="selected-file">Selected: {fileName}</span>}
        <button onClick={handleAnalyze} disabled={!fileName || isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </div>

      <div className="analysis-grid">
        <div className="video-player">
          <div className="placeholder">Video Player Area</div>
          <div className="timeline">
            {MockPhases.map(p => (
              <div 
                key={p.phase} 
                className={`phase-marker ${selectedPhase.phase === p.phase ? 'active' : ''}`} 
                onClick={() => setSelectedPhase(p)}
              >
                {p.phase}
              </div>
            ))}
          </div>
        </div>

        <div className="metrics-panel">
          <h3>TrackMan Metrics ({selectedPhase.phase})</h3>
          <div className="metric-card">Club Angle: {selectedPhase.metrics.clubAngle}°</div>
          <div className="metric-card">Shoulder Tilt: {selectedPhase.metrics.shoulderTilt}°</div>
          <div className="metric-card">Hip Rotation: {selectedPhase.metrics.hipRotation}°</div>
          <div className="metric-card">Tempo: {selectedPhase.metrics.tempo}</div>
        </div>

        <div className="tips-panel">
          <h3>AI Drills & Tips</h3>
          {MockDrills.filter(d => d.targetPhase === selectedPhase.phase).map(drill => (
            <div key={drill.id} className="drill-card">
              <strong>{drill.category.toUpperCase()}: {drill.title}</strong>
              <p>{drill.description}</p>
              <button>View Drill Video</button>
            </div>
          ))}
          {MockDrills.filter(d => d.targetPhase === selectedPhase.phase).length === 0 && (
            <p>No specific drills for this phase.</p>
          )}
        </div>
      </div>
    </div>
  );
};
