import { expect, it, describe } from 'vitest';
import { extractFrameBoundaries, FrameSample } from '../../server/analysis';

describe('extractFrameBoundaries', () => {
  const createFrame = (index: number, headX: number): FrameSample => ({
    frameIndex: index,
    timestamp: index * 33.33,
    bodyPoints: {
      nose: { x: 0, y: 0 },
      shoulderLeft: { x: 0, y: 0 },
      shoulderRight: { x: 0, y: 0 },
      hipLeft: { x: 0, y: 0 },
      hipRight: { x: 0, y: 0 },
      ankleLeft: { x: 0, y: 0 },
      ankleRight: { x: 0, y: 0 },
    },
    clubPoints: {
      grip: { x: 0, y: 0 },
      head: { x: headX, y: 0 },
    },
  });

  it('should identify basic swing boundaries', () => {
    const frames = [
      createFrame(0, 100), // Address
      createFrame(1, 110), // Backswing
      createFrame(2, 120), // Top
      createFrame(3, 110), // Downswing
      createFrame(4, 100), // Impact
      createFrame(5, 110), // Followthrough
      createFrame(6, 120), // Followthrough
    ];

    const boundaries = extractFrameBoundaries(frames);
    
    expect(boundaries).toContainEqual({ phase: 'address', frameIndex: 0, timestamp: 0 });
    expect(boundaries).toContainEqual({ phase: 'top', frameIndex: 2, timestamp: 2 * 33.33 });
    expect(boundaries).toContainEqual({ phase: 'impact', frameIndex: 4, timestamp: 4 * 33.33 });
    expect(boundaries).toContainEqual({ phase: 'followthrough', frameIndex: 6, timestamp: 6 * 33.33 });
  });

  it('should handle empty frames', () => {
    expect(extractFrameBoundaries([])).toEqual([]);
  });

  it('should handle single frame', () => {
    const frames = [createFrame(0, 100)];
    const boundaries = extractFrameBoundaries(frames);
    expect(boundaries).toEqual([
      { phase: 'address', frameIndex: 0, timestamp: 0 },
      { phase: 'followthrough', frameIndex: 0, timestamp: 0 },
    ]);
  });
});
