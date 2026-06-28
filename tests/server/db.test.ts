import { describe, it, expect, beforeEach } from 'vitest';
import { authService, swingService, analysisService, resetDb } from '../../server/db';

describe('analysisService isolation', () => {
  beforeEach(() => {
    resetDb(':memory:');
  });

  it('should not allow user B to see user A analysis', async () => {
    await authService.register('userA', 'passA');
    await authService.register('userB', 'passB');

    const userA = await authService.login('userA', 'passA');
    const userB = await authService.login('userB', 'passB');

    if (!userA.success || !userB.success) throw new Error(`Auth failed: ${userA.error || ''} ${userB.error || ''}`);

    swingService.uploadSwing(userA.user!.id, 'urlA');
    const swingsA = swingService.getUserSwings(userA.user!.id);
    const swingA = swingsA[0];

    analysisService.saveAnalysis(swingA.id, {
      phaseTags: 'top',
      metrics: { angle: 45 },
      tips: [],
      drills: []
    });

    const analysesB = analysisService.getAnalysisForUser(userB.user!.id);
    expect(analysesB).toHaveLength(0);
    
    const analysesA = analysisService.getAnalysisForUser(userA.user!.id);
    expect(analysesA).toHaveLength(1);
  });
});

describe('swingService metadata persistence', () => {
  beforeEach(() => {
    resetDb(':memory:');
  });

  it('should persist video metadata', () => {
    const userId = 1;
    const videoUrl = 'test.mp4';
    const metadata = {
      filename: 'my_swing.mp4',
      mimeType: 'video/mp4',
      size: 1024 * 1024
    };

    swingService.uploadSwing(userId, videoUrl, metadata);
    const swings = swingService.getUserSwings(userId);
    
    expect(swings).toHaveLength(1);
    expect(swings[0].original_filename).toBe(metadata.filename);
    expect(swings[0].mime_type).toBe(metadata.mimeType);
    expect(swings[0].file_size).toBe(metadata.size);
  });

  it('should work without metadata', () => {
    const userId = 1;
    const videoUrl = 'test.mp4';

    swingService.uploadSwing(userId, videoUrl);
    const swings = swingService.getUserSwings(userId);
    
    expect(swings).toHaveLength(1);
    expect(swings[0].original_filename).toBeNull();
    expect(swings[0].mime_type).toBeNull();
    expect(swings[0].file_size).toBeNull();
  });
});
