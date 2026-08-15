import { NextRequest, NextResponse } from 'next/server';
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const file = db.prepare('SELECT * FROM user_photos WHERE id = ? AND user_id = ?').get(fileId, userId) as any;
    if (!file) return NextResponse.json({ success: false, error: 'Not found or not authorized' }, { status: 404 });
    db.prepare('DELETE FROM user_photos WHERE id = ?').run(fileId);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
