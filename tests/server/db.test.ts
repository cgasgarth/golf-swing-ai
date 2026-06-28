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
