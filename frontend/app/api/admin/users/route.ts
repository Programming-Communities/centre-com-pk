import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const users = db.prepare('SELECT id, email, name, role, plan, status, created_at FROM users ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, users });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
