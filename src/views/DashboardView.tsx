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

export const DashboardView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [selectedPhase, setSelectedPhase] = React.useState<PhaseData>(MockPhases[0]);
  const [fileName, setFileName] = React.useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [tips, setTips] = React.useState<Drill[]>([]);
  const [isFetchingTips, setIsFetchingTips] = React.useState(false);

  const fetchTips = async (phase: string) => {
    setIsFetchingTips(true);
    try {
       const response = await fetch('/swings/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase }),
      });
      if (response.ok) {
        const data = await response.json();
        setTips(data);
      }
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    } finally {
      setIsFetchingTips(false);
    }
  };

  React.useEffect(() => {
    fetchTips(selectedPhase.phase);
  }, [selectedPhase]);

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
      
      <main className="dashboard-main">
        <section className="upload-section" aria-label="Video Upload">
          <input type="file" accept="video/*" onChange={handleFileChange} />
          {fileName && <span className="selected-file">Selected: {fileName}</span>}
          <button onClick={handleAnalyze} disabled={!fileName || isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
          </button>
        </section>
    
        <div className="analysis-grid">
          <section className="video-player" aria-label="Swing Video Analysis">
            <div className="placeholder">
              <div className="video-placeholder-content">
                Video Player Area
                <div className="overlay-labels">
                  <span className="label pose">Pose Tracking</span>
                  <span className="label club">Club Path</span>
                </div>
                <div className="confidence-badge">Confidence: 94%</div>
              </div>
            </div>
            <div className="timeline" role="tablist" aria-label="Swing Phase Timeline">
              {MockPhases.map(p => (
                <button 
                  key={p.phase} 
                  role="tab"
                  aria-selected={selectedPhase.phase === p.phase}
                  aria-label={`Select ${p.phase} phase`}
                  className={`phase-marker ${selectedPhase.phase === p.phase ? 'active' : ''}`} 
                  onClick={() => setSelectedPhase(p)}
                >
                  {p.phase}
                </button>
              ))}
            </div>
          </section>
    
            <section className="metrics-panel" aria-label="Analysis Metrics">
               <div className="selected-phase-header">
                 <h3 id="metrics-title">TrackMan Metrics</h3>
                 <span className="phase-badge" aria-labelledby="metrics-title">{selectedPhase.phase.toUpperCase()}</span>
               </div>
               <div className="metric-card">Club Angle: {selectedPhase.metrics.clubAngle}°</div>
               <div className="metric-card">Shoulder Tilt: {selectedPhase.metrics.shoulderTilt}°</div>
               <div className="metric-card">Hip Rotation: {selectedPhase.metrics.hipRotation}°</div>
               <div className="metric-card">Tempo: {selectedPhase.metrics.tempo}</div>
            </section>
    
            <section className="tips-panel" aria-label="AI Tips and Drills">
              <h3>AI Drills & Tips</h3>
              {isFetchingTips ? (
                <p>Loading AI insights...</p>
              ) : tips.length > 0 ? (
                tips.map(drill => (
                  <div key={drill.id} className="drill-card">
                    <strong>{drill.category.toUpperCase()}: {drill.title}</strong>
                    <p>{drill.description}</p>
                    <button>View Drill Video</button>
                  </div>
                ))
              ) : (
                <p>No specific drills for this phase.</p>
              )}
            </section>
          </div>
        </main>
    </div>
  );
};

