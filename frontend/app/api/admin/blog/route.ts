import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { requireAdmin } from '@/lib/admin/requireAdmin';

const DB_PATH = path.join(process.cwd(), 'data', 'centers-local.db');

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = new Database(DB_PATH);
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search') || '';
    const lang = searchParams.get('lang') || 'en';
    
    if (id) {
      const post = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id) as any;
      if (post) {
        try { post.translations = JSON.parse(post.translations || '{}'); } catch { post.translations = {}; }
        const t = post.translations[lang] || post.translations['en'] || {};
        if (t.title) post.title = t.title;
        if (t.slug) post.slug = t.slug;
        if (t.content) post.content = t.content;
        if (t.excerpt) post.excerpt = t.excerpt;
        if (t.seo_title) post.seo_title = t.seo_title;
        if (t.seo_description) post.seo_description = t.seo_description;
      }
      return NextResponse.json({ success: true, post });
    }
    
    let query = "SELECT id, title, slug, content, excerpt, category, lang, status, tool_slug, tool_name, featured_image, image_url, views, view_count, seo_title, seo_description, seo_keywords, translations, parent_slug, published_at, created_at, updated_at FROM blog_posts WHERE 1=1";
    const params: any[] = [];
    
    if (search) {
      query += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)";
      const s = "%" + search + "%";
      params.push(s, s, s);
    }
    
    query += " ORDER BY created_at DESC LIMIT 100";
    const posts = db.prepare(query).all(...params) as any[];
    
    const processed = posts.map((p: any) => {
      try {
        const trans = JSON.parse(p.translations || '{}');
        const langs = Object.keys(trans);
        if (langs.length > 0) {
          const t = trans[langs[0]];
          if (t.title) p.title = t.title;
          if (t.slug) p.slug = t.slug;
          if (t.excerpt) p.excerpt = t.excerpt;
          p.available_langs = langs;
        } else {
          p.available_langs = [p.lang || 'en'];
        }
      } catch { p.available_langs = [p.lang || 'en']; }
      return p;
    });
    
    return NextResponse.json({ success: true, posts: processed });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = new Database(DB_PATH);
  try {
    const body = await req.json();
    const { title, slug, content, excerpt, category, lang, status, tool_slug, tool_name, featured_image, image_url, seo_title, seo_description, seo_keywords, translations } = body;
    const final_featured_image = featured_image || image_url || '';
    const now = new Date().toISOString();
    const slugFinal = slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled-' + Date.now();
    
    db.prepare("INSERT INTO blog_posts (title, slug, content, excerpt, category, lang, status, tool_slug, tool_name, featured_image, image_url, seo_title, seo_description, seo_keywords, translations, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(title || 'Untitled', slugFinal, content || '', excerpt || '', category || 'general', lang || 'en', status || 'draft', tool_slug || '', tool_name || '', final_featured_image, final_featured_image, seo_title || '', seo_description || '', seo_keywords || '', translations ? JSON.stringify(translations) : null, now, now);
    
    const result = db.prepare("SELECT last_insert_rowid() as id").get();
    return NextResponse.json({ success: true, id: (result as any).id });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = new Database(DB_PATH);
  try {
    const body = await req.json();
    const { id, title, slug, content, excerpt, category, status, featured_image, image_url, seo_title, seo_description, seo_keywords, translations } = body;
    const final_featured_image = featured_image || image_url || '';
    if (!id) return NextResponse.json({ success: false, error: "Post ID required" }, { status: 400 });
    const now = new Date().toISOString();
    db.prepare("UPDATE blog_posts SET title=?, slug=?, content=?, excerpt=?, category=?, status=?, featured_image=?, image_url=?, seo_title=?, seo_description=?, seo_keywords=?, translations=?, updated_at=? WHERE id=?")
      .run(title, slug, content, excerpt, category, status, final_featured_image, final_featured_image, seo_title, seo_description, seo_keywords, translations ? JSON.stringify(translations) : null, now, id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = new Database(DB_PATH);
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: "Post ID required" }, { status: 400 });
    db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
