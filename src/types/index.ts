export type User = {
  id: number;
  username: string;
};

export type Swing = {
  id: number;
  userId: number;
  videoUrl: string;
  createdAt: string;
};

export type SwingMetrics = {
  clubAngle: number;
  shoulderTilt: number;
  hipRotation: number;
  tempo: string;
};

export type SwingPhase = 'address' | 'takeaway' | 'top' | 'downswing' | 'impact' | 'followthrough';

export type Drill = {
  id: string;
  title: string;
  description: string;
  targetPhase: SwingPhase;
  category: 'drill' | 'tip';
};

export type PhaseData = {
  phase: SwingPhase;
  timestamp: number;
  metrics: SwingMetrics;
};
