import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGemmaInsight, getSwingTips } from '../../server/ai';

describe('AI Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.stubGlobal('fetch', vi.fn());
  });

  it('returns fallback message when CEREBRAS_API_KEY is not set', async () => {
    delete process.env.CEREBRAS_API_KEY;
    const result = await getGemmaInsight('Test prompt');
    expect(result).toBe('AI insights are currently unavailable. Please check your API configuration.');
  });

  it('returns API response content on success', async () => {
    process.env.CEREBRAS_API_KEY = 'test-key';
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'AI Response' } }]
      }),
    };
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

    const result = await getGemmaInsight('Test prompt');
    expect(result).toBe('AI Response');
  });

  it('returns error fallback on fetch failure', async () => {
    process.env.CEREBRAS_API_KEY = 'test-key';
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network Error'));

    const result = await getGemmaInsight('Test prompt');
    expect(result).toBe('An error occurred while fetching AI insights.');
  });

  it('returns error fallback on non-ok response', async () => {
    process.env.CEREBRAS_API_KEY = 'test-key';
    const mockResponse = {
      ok: false,
      statusText: 'Internal Server Error',
    };
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

    const result = await getGemmaInsight('Test prompt');
    expect(result).toBe('An error occurred while fetching AI insights.');
  });

  describe('getSwingTips', () => {
    it('parses valid JSON response', async () => {
      process.env.CEREBRAS_API_KEY = 'test-key';
      const mockJson = { tips: ['Tip 1'], drills: ['Drill 1'] };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify(mockJson) } }]
        }),
      } as any);

      const result = await getSwingTips({ phases: ['top'], metrics: { angle: 45 } });
      expect(result).toEqual(mockJson);
    });

    it('handles malformed JSON by using text as tip', async () => {
      process.env.CEREBRAS_API_KEY = 'test-key';
      const mockText = 'Just some text, not JSON';
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: mockText } }]
        }),
      } as any);

      const result = await getSwingTips({ phases: ['top'], metrics: { angle: 45 } });
      expect(result).toEqual({ tips: [mockText], drills: [] });
    });

    it('handles malformed JSON that fails parsing', async () => {
      process.env.CEREBRAS_API_KEY = 'test-key';
      const malformedJson = '{ "tips": ["incomplete" ';
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: malformedJson } }]
        }),
      } as any);

      const result = await getSwingTips({ phases: ['top'], metrics: { angle: 45 } });
      expect(result).toEqual({ tips: [malformedJson], drills: [] });
    });
  });
});

