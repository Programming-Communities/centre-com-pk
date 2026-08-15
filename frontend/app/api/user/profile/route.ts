import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
    const user = db.prepare('SELECT id, name, email, role, plan, image_url, created_at FROM users WHERE id = ?').get(userId);
    return NextResponse.json({ success: true, user });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { user_id, name, image_url } = await req.json();
    if (!user_id) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
    db.prepare('UPDATE users SET name = ?, image_url = ?, updated_at = ? WHERE id = ?').run(name, image_url, new Date().toISOString(), user_id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
