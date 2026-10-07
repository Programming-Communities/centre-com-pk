import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const comments = db.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, comments });
  } catch (e: any) {
    return NextResponse.json({ success: true, comments: [] });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, status } = await req.json();
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('UPDATE comments SET status = ? WHERE id = ?').run(status, id);
    return NextResponse.json({ success: true });
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
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
