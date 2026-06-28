export type Point = { x: number; y: number };

export interface FrameSample {
  frameIndex: number;
  timestamp: number;
  bodyPoints: {
    nose: Point;
    shoulderLeft: Point;
    shoulderRight: Point;
    hipLeft: Point;
    hipRight: Point;
    ankleLeft: Point;
    ankleRight: Point;
  };
  clubPoints: {
    grip: Point;
    head: Point;
  };
}

export type SwingPhase = 'address' | 'backswing' | 'top' | 'downswing' | 'impact' | 'followthrough';

export interface AnalysisResult {
  phase: SwingPhase;
  metrics: {
    spineAngle: number;
    shoulderTilt: number;
    hipRotation: number;
    shaftLean: number;
  };
  confidence: number;
}

function calculateAngle(p1: Point, p2: Point, p3: Point): number {
  const d12 = { x: p2.x - p1.x, y: p2.y - p1.y };
  const d23 = { x: p3.x - p2.x, y: p3.y - p2.y };
  const dot = d12.x * d23.x + d12.y * d23.y;
  const mag1 = Math.sqrt(d12.x ** 2 + d12.y ** 2);
  const mag2 = Math.sqrt(d23.x ** 2 + d23.y ** 2);
  return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

export function analyzeSwing(frames: FrameSample[]): AnalysisResult[] {
  return frames.map((frame, index) => {
    const { bodyPoints: bp, clubPoints: cp } = frame;
    
    const spineAngle = calculateAngle(bp.shoulderLeft, bp.hipLeft, bp.ankleLeft);
    const shoulderTilt = Math.atan2(bp.shoulderRight.y - bp.shoulderLeft.y, bp.shoulderRight.x - bp.shoulderLeft.x) * (180 / Math.PI);
    const hipRotation = Math.atan2(bp.hipRight.y - bp.hipLeft.y, bp.hipRight.x - bp.hipLeft.x) * (180 / Math.PI);
    const shaftLean = calculateAngle(cp.grip, cp.head, { x: cp.head.x, y: cp.head.y + 1 });

    const phase = determinePhase(frames, frame, index);

    return {
      phase,
      metrics: { spineAngle, shoulderTilt, hipRotation, shaftLean },
      confidence: 0.95
    };
  });
}

function determinePhase(frames: FrameSample[], frame: FrameSample, index: number): SwingPhase {
  if (index === 0) return 'address';
  if (index === frames.length - 1) return 'followthrough';

  const prevClubX = frames[index - 1].clubPoints.head.x;
  const nextClubX = frames[index + 1].clubPoints.head.x;
  const currentClubX = frame.clubPoints.head.x;

  if (prevClubX < currentClubX && nextClubX > currentClubX) return 'backswing';
  if (prevClubX > currentClubX && nextClubX < currentClubX) return 'downswing';
  
  return 'address';
}

export function analyzeSwingStub(swingId: number): AnalysisResult[] {
  console.log(`Running swing analysis stub for swing ${swingId}`);
  const phases: SwingPhase[] = ['address', 'backswing', 'top', 'downswing', 'impact', 'followthrough'];
  return phases.map((phase, index) => ({
    phase,
    metrics: {
      spineAngle: 160 + index * 2,
      shoulderTilt: 5 + index,
      hipRotation: index * 10,
      shaftLean: 2 + index,
    },
    confidence: 1.0,
  }));
}
