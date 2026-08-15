import { NextRequest, NextResponse } from 'next/server';
import { getLocalDB } from '@/lib/db/local-db';

export async function POST(req: NextRequest) {
  try {
    const db = getLocalDB();
    const { postSlug, userId } = await req.json();
    const existing = db.prepare('SELECT id FROM user_bookmarks WHERE post_slug = ? AND user_id = ?').get(postSlug, userId);
    if (existing) {
      db.prepare('DELETE FROM user_bookmarks WHERE id = ?').run((existing as any).id);
      return NextResponse.json({ success: true, bookmarked: false });
    } else {
      db.prepare('INSERT INTO user_bookmarks (post_slug, user_id) VALUES (?,?)').run(postSlug, userId);
      return NextResponse.json({ success: true, bookmarked: true });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
