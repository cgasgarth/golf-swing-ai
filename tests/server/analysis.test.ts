import { describe, it, expect } from 'vitest';
import { analyzeSwing, FrameSample } from '../../server/analysis';

const createMockFrame = (index: number, clubX: number): FrameSample => ({
  frameIndex: index,
  timestamp: index * 0.033,
  bodyPoints: {
    nose: { x: 0, y: 0 },
    shoulderLeft: { x: -10, y: 10 },
    shoulderRight: { x: 10, y: 10 },
    hipLeft: { x: -10, y: 30 },
    hipRight: { x: 10, y: 30 },
    ankleLeft: { x: -10, y: 60 },
    ankleRight: { x: 10, y: 60 },
  },
  clubPoints: {
    grip: { x: 0, y: 20 },
    head: { x: clubX, y: 50 },
  },
});

describe('analyzeSwing', () => {
  it('should return analysis for each frame', () => {
    const frames = [createMockFrame(0, 0), createMockFrame(1, 10), createMockFrame(2, 0)];
    const results = analyzeSwing(frames);
    expect(results).toHaveLength(3);
  });

  it('should correctly identify address and followthrough phases', () => {
    const frames = [createMockFrame(0, 0), createMockFrame(1, 10), createMockFrame(2, 0)];
    const results = analyzeSwing(frames);
    expect(results[0].phase).toBe('address');
    expect(results[2].phase).toBe('followthrough');
  });

  it('should calculate metrics', () => {
    const frames = [createMockFrame(0, 0)];
    const results = analyzeSwing(frames);
    expect(results[0].metrics.spineAngle).toBeDefined();
    expect(results[0].metrics.shoulderTilt).toBeDefined();
    expect(results[0].metrics.hipRotation).toBeDefined();
    expect(results[0].metrics.shaftLean).toBeDefined();
  });
});
