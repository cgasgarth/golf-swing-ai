import { expect, test, describe, beforeAll } from 'bun:test';
import { server } from '../../server/http';

const BASE_URL = 'http://localhost:3000';

describe('Upload API', () => {
  beforeAll(async () => {
    if (!server) {
      throw new Error('Server not initialized');
    }
  });

  test('upload video via multipart/form-data', async () => {
    const userId = 1;
    const file = new File(['fake-video-content'], 'test-video.mp4', { type: 'video/mp4' });
    
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('video', file);

    const response = await fetch(`${BASE_URL}/swings/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toHaveProperty('swingId');
    expect(result.userId).toBe(userId);
  });

  test('upload video via JSON', async () => {
    const userId = 2;
    const videoUrl = 'http://example.com/video.mp4';
    
    const response = await fetch(`${BASE_URL}/swings/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, videoUrl }),
    });

    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toHaveProperty('swingId');
    expect(result.userId).toBe(userId);
  });

  test('fail upload when userId is missing', async () => {
    const file = new File(['fake-video-content'], 'test-video.mp4', { type: 'video/mp4' });
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${BASE_URL}/swings/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    expect(result).toHaveProperty('error');
  });
});
