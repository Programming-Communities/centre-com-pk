import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, type, filename } = body;
    if (!userId || !imageData) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const db = (process.env as any).centers_db || (globalThis as any).centers_db;
    if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 500 });

    const id = crypto.randomUUID();
    await db.prepare(
      'INSERT INTO user_photos (id, user_id, type, data_base64, filename, created_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))'
    ).bind(id, userId, type || 'profile', imageData, filename || 'photo.jpg').run();

    return NextResponse.json({ success: true, photoId: id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
