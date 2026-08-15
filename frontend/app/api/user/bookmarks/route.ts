import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ success: true, bookmarks: [] });
    const bookmarks = db.prepare('SELECT * FROM user_bookmarks WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return NextResponse.json({ success: true, bookmarks });
  } catch { return NextResponse.json({ success: true, bookmarks: [] }); }
}
