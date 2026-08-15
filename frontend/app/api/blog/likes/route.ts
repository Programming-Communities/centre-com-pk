import { NextRequest, NextResponse } from 'next/server';
import { getLocalDB } from '@/lib/db/local-db';

export async function POST(req: NextRequest) {
  try {
    const db = getLocalDB();
    const { postSlug, userId } = await req.json();
    const existing = db.prepare('SELECT id FROM blog_likes WHERE post_slug = ? AND user_id = ?').get(postSlug, userId || 'anonymous');
    
    if (existing) {
      db.prepare('DELETE FROM blog_likes WHERE id = ?').run((existing as any).id);
      db.prepare('UPDATE blog_posts SET likes = MAX(0, likes - 1) WHERE slug = ?').run(postSlug);
      const post = db.prepare('SELECT likes FROM blog_posts WHERE slug = ?').get(postSlug) as any;
      return NextResponse.json({ success: true, liked: false, likes: post?.likes || 0 });
    } else {
      db.prepare('INSERT INTO blog_likes (post_slug, user_id) VALUES (?,?)').run(postSlug, userId || 'anonymous');
      db.prepare('UPDATE blog_posts SET likes = likes + 1 WHERE slug = ?').run(postSlug);
      const post = db.prepare('SELECT likes FROM blog_posts WHERE slug = ?').get(postSlug) as any;
      return NextResponse.json({ success: true, liked: true, likes: post?.likes || 0 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
