import { authService, swingService, analysisService } from './db';
import { getSwingTips } from './ai';
import { saveUploadedFile } from './services/upload';
import { frameService } from './services/frame';
import { analyzeSwing, extractFrameBoundaries } from './analysis';

export const api = {
  post: async (path: string, body: any) => {
    console.log(`API POST ${path}`, body);
    if (path === '/auth/register') return authService.register(body.username, body.password);
    if (path === '/auth/login') return authService.login(body.username, body.password);
    if (path === '/swings/upload') {
      let videoUrl = body.videoUrl;
      let metadata: { filename?: string; mimeType?: string; size?: number } = {};

      if (body.videoFile instanceof File) {
        const file = body.videoFile;
        videoUrl = await saveUploadedFile(file);
        metadata = { 
          filename: file.name, 
          mimeType: file.type, 
          size: file.size 
        };
      }
      return swingService.uploadSwing(Number(body.userId), videoUrl, metadata);
    }
    if (path === '/swings/analyze') {
      const swingId = Number(body.swingId);
      
      // Get video info from DB to generate deterministic frames
      const swing = swingService.getSwingById(swingId);
      if (!swing) return { error: 'Swing not found' };
      
      const frames = frameService.generateFrames(swing.video_url);
      const analysisResults = analyzeSwing(frames);
      const boundaries = extractFrameBoundaries(frames);
      const phaseTags = analysisResults.map(r => r.phase).join(',');
      const metrics = analysisResults.map(r => ({ phase: r.phase, ...r.metrics }));
      
      return analysisService.saveAnalysis(swingId, {
        phaseTags,
        metrics,
        boundaries,
        tips: [],
        drills: [],
      });
    }
    if (path === '/swings/analysis') return analysisService.saveAnalysis(body.swingId, body.analysis);
    if (path === '/swings/tips') return getSwingTips(body);
    return { error: 'Not Found' };
  },
  get: async (path: string, query: any) => {
    console.log(`API GET ${path}`, query);
    if (path === '/swings') return swingService.getUserSwings(query.userId);
    if (path === '/swings/analysis') {
      if (query.swingId) return analysisService.getAnalysisForSwing(query.swingId);
      if (query.userId) return analysisService.getAnalysisForUser(query.userId);
    }
    return { error: 'Not Found' };
  }
};
