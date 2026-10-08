import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';

export async function GET(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const data = db.prepare('SELECT * FROM affiliates WHERE user_id = ? ORDER BY created_at DESC').all(user.sub);
    return NextResponse.json({ success: true, data });
  } catch { return NextResponse.json({ success: true, data: [] }); }
}
