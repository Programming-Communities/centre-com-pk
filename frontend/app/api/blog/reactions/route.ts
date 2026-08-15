import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || '';
    const userId = searchParams.get('user_id') || 'anonymous';
    
    if (!slug) return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    
    const counts = db.prepare('SELECT reaction_type, COUNT(*) as count FROM post_reactions WHERE post_slug = ? GROUP BY reaction_type').all(slug);
    const userReactions = db.prepare('SELECT reaction_type FROM post_reactions WHERE post_slug = ? AND user_id = ?').all(slug, userId);
    const userReactionTypes = (userReactions as any[]).map(r => r.reaction_type);
    
    return NextResponse.json({ success: true, counts, userReactions: userReactionTypes });
  } catch (e: any) {
    return NextResponse.json({ success: true, counts: [], userReactions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { slug, reaction_type, user_id } = await req.json();
    if (!slug || !reaction_type) return NextResponse.json({ success: false, error: 'Required' }, { status: 400 });
    
    const uid = user_id || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    const existing = db.prepare('SELECT id FROM post_reactions WHERE post_slug = ? AND user_id = ? AND reaction_type = ?').get(slug, uid, reaction_type) as any;
    
    if (existing) {
      db.prepare('DELETE FROM post_reactions WHERE id = ?').run(existing.id);
    } else {
      db.prepare('INSERT INTO post_reactions (post_slug, user_id, user_ip, reaction_type) VALUES (?,?,?,?)').run(slug, uid, ip, reaction_type);
    }
    
    const counts = db.prepare('SELECT reaction_type, COUNT(*) as count FROM post_reactions WHERE post_slug = ? GROUP BY reaction_type').all(slug);
    const userReactions = db.prepare('SELECT reaction_type FROM post_reactions WHERE post_slug = ? AND user_id = ?').all(slug, uid);
    
    return NextResponse.json({ success: true, counts, userReactions: (userReactions as any[]).map(r => r.reaction_type) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
