import { authService, swingService } from './db';

export const api = {
  post: async (path: string, body: any) => {
    console.log(`API POST ${path}`, body);
    if (path === '/auth/register') return authService.register(body.username, body.password);
    if (path === '/auth/login') return authService.login(body.username, body.password);
    if (path === '/swings/upload') return swingService.uploadSwing(body.userId, body.videoUrl);
    return { error: 'Not Found' };
  },
  get: async (path: string, query: any) => {
    console.log(`API GET ${path}`, query);
    if (path === '/swings') return swingService.getUserSwings(query.userId);
    return { error: 'Not Found' };
  }
};
