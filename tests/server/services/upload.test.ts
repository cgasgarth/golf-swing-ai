import { describe, it, expect, afterEach } from 'vitest';
import { saveUploadedFile } from '../../../server/services/upload';
import { rm, access } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

describe('Upload Service', () => {
  afterEach(async () => {
    if (await exists(UPLOADS_DIR)) {
      await rm(UPLOADS_DIR, { recursive: true, force: true });
    }
  });

  it('should save a file and return a unique filename', async () => {
    const content = 'test video content';
    const file = new File([content], 'test-video.mp4', { type: 'video/mp4' });

    const filename = await saveUploadedFile(file);

    expect(filename).toBeDefined();
    expect(filename).toContain('.mp4');
    
    const filePath = join(UPLOADS_DIR, filename);
    const savedContent = await readFile(filePath, 'utf8');
    expect(savedContent).toBe(content);
  });

  it('should handle files without extensions', async () => {
    const content = 'no extension content';
    const file = new File([content], 'testfile', { type: 'application/octet-stream' });

    const filename = await saveUploadedFile(file);

    expect(filename).toBeDefined();
    expect(filename).toContain('.bin');
  });
});
