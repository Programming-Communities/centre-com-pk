import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';

export async function GET(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const row = db.prepare('SELECT plan FROM users WHERE id = ?').get(user.sub) as any;
    return NextResponse.json({ success: true, plan: row?.plan || 'free' });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
