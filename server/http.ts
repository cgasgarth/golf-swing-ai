import { api } from './api';

const PORT = 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS for local dev
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const responseHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    try {
      if (req.method === 'GET') {
        const query = Object.fromEntries(url.searchParams.entries());
        const result = await api.get(path, query);
        return new Response(JSON.stringify(result), { headers: responseHeaders });
      }

      if (req.method === 'POST') {
        return await handlePostRequest(req, path, responseHeaders);
      }

      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: responseHeaders,
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: responseHeaders,
      });
    }
  },
});

async function handlePostRequest(req: Request, path: string, responseHeaders: any) {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.startsWith('multipart/form-data')) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    
    const video = formData.get('video');
    if (video instanceof File) {
      (body as any).videoFile = video;
    }
    
    const result = await api.post(path, body);
    return new Response(JSON.stringify(result), { headers: responseHeaders });
  }

  const body = await req.json();
  const result = await api.post(path, body);
  return new Response(JSON.stringify(result), { headers: responseHeaders });
}

console.log(`Listening on http://localhost:${server.port}`);

export { server };
