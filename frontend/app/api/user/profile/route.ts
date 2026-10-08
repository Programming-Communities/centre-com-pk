import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';
export async function GET(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const profile = db.prepare('SELECT id, name, email, role, plan, image_url, created_at FROM users WHERE id = ?').get(user.sub);
    return NextResponse.json({ success: true, user: profile });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { name, image_url } = await req.json();
    db.prepare('UPDATE users SET name = ?, image_url = ?, updated_at = ? WHERE id = ?').run(name, image_url, new Date().toISOString(), user.sub);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
