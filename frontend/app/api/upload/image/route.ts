import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    const filePath = path.join(uploadDir, uniqueName);
    
    await writeFile(filePath, buffer);
    
    const url = `/uploads/images/${uniqueName}`;
    
    return NextResponse.json({ success: true, url, message: 'Image uploaded successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
