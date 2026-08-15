import { NextRequest, NextResponse } from 'next/server';
import { getLocalDB } from '@/lib/db/local-db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en';
    
    const db = getLocalDB();
    const post = db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND lang = ? AND status = 'published'").get(slug, lang) as any;
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    
    db.prepare("UPDATE blog_posts SET views = views + 1 WHERE slug = ? AND lang = ?").run(slug, lang);
    
    const related = db.prepare("SELECT id, title, slug, lang, excerpt, category, created_at FROM blog_posts WHERE id != ? AND lang = ? AND status = 'published' ORDER BY created_at DESC LIMIT 4").all(post.id, lang);
    const translations = db.prepare("SELECT lang, slug, title FROM blog_posts WHERE slug = ? AND status = 'published'").all(slug);
    
    return NextResponse.json({ success: true, post: { ...post, related_posts: related, translations } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
