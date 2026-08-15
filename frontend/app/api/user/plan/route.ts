import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ success: false }, { status: 401 });
    const user = db.prepare('SELECT plan FROM users WHERE id = ?').get(userId) as any;
    return NextResponse.json({ success: true, plan: user?.plan || 'free' });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
