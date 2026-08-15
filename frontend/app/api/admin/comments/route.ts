import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const comments = db.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, comments });
  } catch (e: any) {
    return NextResponse.json({ success: true, comments: [] });
  }
}

export async function PUT(req: NextRequest) {
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
