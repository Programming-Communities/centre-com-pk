import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(req: NextRequest) {
  // 1. Auth gate — reject before reading body
  const user = requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file' }, { status: 400 });
    }

    // 2. Size cap
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 5 MB)' },
        { status: 413 }
      );
    }

    // 3. MIME allowlist
    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type' },
        { status: 415 }
      );
    }

    // 4. Safe filename — extension from validated MIME, not from client
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'ads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `ad-${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({ success: true, url: '/uploads/ads/' + filename });
  } catch (e) {
    // 5. Do not leak internals
    console.error('[ads/upload] error:', e);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
