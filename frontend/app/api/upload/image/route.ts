import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { verifyToken } from '@/lib/auth/secure';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const BLOCKED_EXTENSIONS = ['.svg', '.svgz', '.xml'];

function requireUser(request: Request): { sub: string; email: string; role: string } | null {
  try {
    let token: string | null = null;

    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.sub) return null;

    return {
      sub: String(payload.sub),
      email: String(payload.email || ''),
      role: String(payload.role || 'user'),
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name || '').toLowerCase();
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 413 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const safeName = path.basename(file.name || 'upload');
    const uniqueName = `${crypto.randomUUID()}-${Date.now()}-${Math.random().toString(36).substring(7)}-${safeName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    const filePath = path.join(uploadDir, uniqueName);
    
    await writeFile(filePath, buffer);
    
    const url = `/uploads/images/${uniqueName}`;
    
    return NextResponse.json({ success: true, url, message: 'Image uploaded successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
