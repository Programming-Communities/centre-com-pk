import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const roles = db.prepare('SELECT * FROM roles ORDER BY id').all();
    const users = db.prepare('SELECT id, name, email, role FROM users ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, roles, users });
  } catch (e: any) {
    return NextResponse.json({ success: true, roles: [], users: [] });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { userId, role } = await req.json();
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, userId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
