import { NextRequest, NextResponse } from 'next/server';
export async function DELETE(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
    // Only owner OR admin can delete
    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id) as any;
    if (!comment) return NextResponse.json({ success: false }, { status: 404 });
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as any;
    if (comment.user_id != userId && user?.role !== 'admin' && user?.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
    }
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
