import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';
import { getLocalDB } from '@/lib/db/local-db';

// GET /api/me/comments — list only the signed-in user's own comments.
// Matched by user_id OR the guest_email recorded at submit time.
export async function GET(req: NextRequest) {
  const user = requireUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const comments = db
      .prepare('SELECT * FROM comments WHERE user_id = ? OR guest_email = ? ORDER BY created_at DESC')
      .all(Number(user.sub), user.email || '');
    return NextResponse.json({ success: true, comments });
  } catch (e: any) {
    console.error('[me/comments] error:', e);
    return NextResponse.json({ success: true, comments: [] });
  }
}
