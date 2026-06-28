import { FrameSample } from '../analysis';

export const frameService = {
  /**
   * Generates a deterministic set of FrameSamples based on the video path/metadata.
   * This avoids heavy CV dependencies while providing consistent data for analysis.
   */
  generateFrames(videoPath: string): FrameSample[] {
    const frames: FrameSample[] = [];
    const frameCount = 60; // Mock 2 seconds of 30fps video
    const fps = 30;

    // Use a simple hash of the path to ensure deterministic but varied frames for different files
    let seed = 0;
    for (let i = 0; i < videoPath.length; i++) {
      seed += videoPath.charCodeAt(i);
    }

    for (let i = 0; i < frameCount; i++) {
      const progress = i / (frameCount - 1);
      
      // Deterministic movement for club head (simulating a swing)
      // X moves right then left
      const clubHeadX = 0.5 + Math.sin(progress * Math.PI) * 0.3 + (seed % 10) * 0.01;
      const clubHeadY = 0.8 - Math.abs(Math.sin(progress * Math.PI)) * 0.2;

      // Deterministic movement for grip
      const gripX = 0.5 + Math.sin(progress * Math.PI) * 0.1;
      const gripY = 0.6 - Math.abs(Math.sin(progress * Math.PI)) * 0.1;

      // Stable body points with tiny deterministic jitter
      const jitter = (seed + i) % 5 * 0.001;
      
      frames.push({
        frameIndex: i,
        timestamp: i / fps,
        bodyPoints: {
          nose: { x: 0.5 + jitter, y: 0.2 + jitter },
          shoulderLeft: { x: 0.4 + jitter, y: 0.3 + jitter },
          shoulderRight: { x: 0.6 + jitter, y: 0.3 + jitter },
          hipLeft: { x: 0.45 + jitter, y: 0.5 + jitter },
          hipRight: { x: 0.55 + jitter, y: 0.5 + jitter },
          ankleLeft: { x: 0.4 + jitter, y: 0.9 + jitter },
          ankleRight: { x: 0.6 + jitter, y: 0.9 + jitter },
        },
        clubPoints: {
          grip: { x: gripX, y: gripY },
          head: { x: clubHeadX, y: clubHeadY },
        },
      });
    }

    return frames;
  }
};
