import { authService, swingService, analysisService } from './db';
import { getSwingTips } from './ai';
import { saveUploadedFile } from './services/upload';

export const api = {
  post: async (path: string, body: any) => {
    console.log(`API POST ${path}`, body);
    if (path === '/auth/register') return authService.register(body.username, body.password);
    if (path === '/auth/login') return authService.login(body.username, body.password);
    if (path === '/swings/upload') {
      let videoUrl = body.videoUrl;
      if (body.videoFile instanceof File) {
        videoUrl = await saveUploadedFile(body.videoFile);
      }
      return swingService.uploadSwing(body.userId, videoUrl);
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
