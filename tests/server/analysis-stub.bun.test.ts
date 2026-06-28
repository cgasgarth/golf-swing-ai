import { describe, it, expect } from 'bun:test';
import { analyzeSwingStub } from '../../server/analysis';
import { api } from '../../server/api';
import { swingService, analysisService } from '../../server/db';

describe('Analysis Stub', () => {
  it('should return deterministic results', () => {
    const res1 = analyzeSwingStub(1);
    const res2 = analyzeSwingStub(1);
    expect(res1).toEqual(res2);
    expect(res1[0].phase).toBe('address');
    expect(res1[res1.length - 1].phase).toBe('followthrough');
  });
});

describe('Analysis API', () => {
  it('should trigger analysis and save to db', async () => {
    const { swingId } = swingService.uploadSwing(1, 'test.mp4');
    
    const result = await api.post('/swings/analyze', { swingId });
    expect(result.success).toBe(true);
    
    const analysis = analysisService.getAnalysisForSwing(swingId);
    expect(analysis).not.toBeNull();
    expect(analysis?.phase_tags).toContain('address');
    expect(analysis?.phase_tags).toContain('followthrough');
    expect(JSON.parse(analysis?.metrics_json || '[]')).toHaveLength(6);
  });
});
