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

export type PhaseData = {
  phase: SwingPhase;
  timestamp: number;
  metrics: SwingMetrics;
};
