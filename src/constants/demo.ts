import { PhaseData, Drill } from '../types';

export const DEMO_SWING = {
  id: 999,
  userId: 1,
  videoUrl: 'https://example.com/demo-swing.mp4',
  createdAt: new Date().toISOString(),
};

export const DEMO_ANALYSIS: PhaseData[] = [
  {
    phase: 'address',
    timestamp: 0,
    metrics: { clubAngle: 45, shoulderTilt: 2, hipRotation: 0, tempo: 'Normal' },
  },
  {
    phase: 'top',
    timestamp: 1.5,
    metrics: { clubAngle: 90, shoulderTilt: 5, hipRotation: 45, tempo: 'Smooth' },
  },
  {
    phase: 'impact',
    timestamp: 2.2,
    metrics: { clubAngle: 0, shoulderTilt: -2, hipRotation: 30, tempo: 'Powerful' },
  },
];

export const DEMO_TIPS: Drill[] = [
  {
    id: 'tip-1',
    title: 'Improve Shoulder Tilt',
    description: 'Focus on maintaining a consistent tilt during the takeaway.',
    targetPhase: 'takeaway',
    category: 'tip',
  },
  {
    id: 'drill-1',
    title: 'The Pause Drill',
    description: 'Pause for 1 second at the top of your backswing.',
    targetPhase: 'top',
    category: 'drill',
  },
];
