import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ success: true, documents: [] });
    const docs = db.prepare('SELECT * FROM user_documents WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return NextResponse.json({ success: true, documents: docs });
  } catch { return NextResponse.json({ success: true, documents: [] }); }
}
export async function POST(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { user_id, title, content } = await req.json();
    if (!user_id) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
    const now = new Date().toISOString();
    db.prepare('INSERT INTO user_documents (user_id, title, content, created_at, updated_at) VALUES (?,?,?,?,?)').run(user_id, title, content, now, now);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
