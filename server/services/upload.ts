import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

export async function saveUploadedFile(file: File): Promise<string> {
  await mkdir(UPLOADS_DIR, { recursive: true });

  const parts = file.name.split('.');
  const fileExtension = parts.length > 1 ? parts.pop() : 'bin';
  const fileName = `${randomUUID()}.${fileExtension}`;
  const filePath = join(UPLOADS_DIR, fileName);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return fileName;
}
