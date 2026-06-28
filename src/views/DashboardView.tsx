import React from 'react';
import { SwingMetrics, PhaseData, Drill } from '../types';
import { DEMO_ANALYSIS, DEMO_TIPS } from '../constants/demo';

const MockMetrics: SwingMetrics = { clubAngle: 45, shoulderTilt: 12, hipRotation: 30, tempo: '3:1' };
const MockPhases: PhaseData[] = [
  { phase: 'address', timestamp: 0, metrics: { ...MockMetrics, clubAngle: 40 } },
  { phase: 'takeaway', timestamp: 1, metrics: { ...MockMetrics, clubAngle: 50 } },
  { phase: 'top', timestamp: 2, metrics: { ...MockMetrics, clubAngle: 90 } },
  { phase: 'downswing', timestamp: 3, metrics: { ...MockMetrics, clubAngle: 60 } },
  { phase: 'impact', timestamp: 4, metrics: { ...MockMetrics, clubAngle: 0 } },
  { phase: 'followthrough', timestamp: 5, metrics: { ...MockMetrics, clubAngle: 110 } },
];

export const DashboardView: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const [analysisData, setAnalysisData] = React.useState<PhaseData[]>([]);
  const [selectedPhase, setSelectedPhase] = React.useState<PhaseData | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tips, setTips] = React.useState<Drill[]>([]);
  const [isFetchingTips, setIsFetchingTips] = React.useState(false);

  const fetchTips = async (phase: string, metrics: SwingMetrics) => {
    setIsFetchingTips(true);
    try {
       const response = await fetch('/swings/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase, metrics }),
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
    if (selectedPhase) {
      fetchTips(selectedPhase.phase, selectedPhase.metrics);
    }
  }, [selectedPhase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('userId', user?.id || '1');

      const uploadResponse = await fetch('/swings/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');
      const { swingId } = await uploadResponse.json();

      const analyzeResponse = await fetch('/swings/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swingId }),
      });

      if (!analyzeResponse.ok) throw new Error('Analysis failed');
      const analysis = await analyzeResponse.json();
      
      const results = analysis.metrics || [];
      setAnalysisData(results);
      if (results.length > 0) setSelectedPhase(results[0]);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Analysis failed. Using mock data for demonstration.');
      setAnalysisData(MockPhases);
      setSelectedPhase(MockPhases[0]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadDemo = () => {
    setFileName('demo-swing.mp4');
    setAnalysisData(DEMO_ANALYSIS);
    setSelectedPhase(DEMO_ANALYSIS[0]);
    setTips(DEMO_TIPS);
  };

  const activePhase = selectedPhase || (analysisData.length > 0 ? analysisData[0] : null);

  return (
    <div className="dashboard">
      <header>
        <h1>Swing Analysis</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      
      <main className="dashboard-main">
        {error && <div className="error-banner" role="alert">{error}</div>}
        <section className="upload-section" aria-label="Video Upload">
          <input type="file" accept="video/*" onChange={handleFileChange} data-testid="video-upload-input" />
          {fileName && <span className="selected-file">Selected: {fileName}</span>}
            <button onClick={handleAnalyze} disabled={!selectedFile || isAnalyzing}>
               {isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
            </button>
            <button onClick={handleLoadDemo} disabled={isAnalyzing} className="demo-button">
              Load Demo Swing
            </button>
          </section>
      
           {!analysisData.length ? (
             <div className="empty-state" aria-live="polite">
               <h2>Ready for Analysis</h2>
               <p>Upload your swing video or load a demo to begin analyzing your metrics.</p>
             </div>
           ) : (
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
                   {analysisData.map(p => (
                     <button 
                       key={p.phase} 
                       role="tab"
                       aria-selected={activePhase?.phase === p.phase}
                       aria-label={`Select ${p.phase} phase`}
                       className={`phase-marker ${activePhase?.phase === p.phase ? 'active' : ''}`} 
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
                      <span className="phase-badge" aria-label={`Current Phase: ${activePhase?.phase?.toUpperCase()}`}>{activePhase?.phase?.toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="metric-card">Club Angle: {activePhase?.metrics?.clubAngle !== undefined ? `${activePhase.metrics.clubAngle}°` : 'N/A'}</div>
                    <div className="metric-card">Shoulder Tilt: {activePhase?.metrics?.shoulderTilt !== undefined ? `${activePhase.metrics.shoulderTilt}°` : 'N/A'}</div>
                    <div className="metric-card">Hip Rotation: {activePhase?.metrics?.hipRotation !== undefined ? `${activePhase.metrics.hipRotation}°` : 'N/A'}</div>
                    <div className="metric-card">Tempo: {activePhase?.metrics?.tempo || 'N/A'}</div>
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
           )}
        </main>
    </div>
  );

};

