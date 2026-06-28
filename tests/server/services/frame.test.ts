import { expect, test, describe } from 'vitest';
import { frameService } from '../../../server/services/frame';

describe('FrameService', () => {
  test('generates deterministic frames for the same path', () => {
    const path = 'uploads/test-video.mp4';
    const frames1 = frameService.generateFrames(path);
    const frames2 = frameService.generateFrames(path);

    expect(frames1).toEqual(frames2);
    expect(frames1.length).toBe(60);
  });

  test('generates different frames for different paths', () => {
    const path1 = 'uploads/video1.mp4';
    const path2 = 'uploads/video2.mp4';
    const frames1 = frameService.generateFrames(path1);
    const frames2 = frameService.generateFrames(path2);

    expect(frames1).not.toEqual(frames2);
  });

  test('generates frames with correct structure', () => {
    const frames = frameService.generateFrames('test.mp4');
    const frame = frames[0];

    expect(frame).toHaveProperty('frameIndex');
    expect(frame).toHaveProperty('timestamp');
    expect(frame.bodyPoints).toHaveProperty('nose');
    expect(frame.clubPoints).toHaveProperty('head');
  });
});
