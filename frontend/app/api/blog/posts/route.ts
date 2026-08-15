import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import { submitToIndexNow } from '@/lib/seo/indexnow';

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");
const BASE_URL = 'https://www.centre.com.pk';

export async function GET(req: NextRequest) {
  try {
    const db = new Database(DB_PATH);
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const limit = parseInt(searchParams.get("limit") || "50");
    const lang = searchParams.get("lang");
    const tool = searchParams.get("tool");

    if (slug) {
      const post = db.prepare("SELECT * FROM blog_posts WHERE slug=?").get(slug) as any;
      
      if (post) {
        db.prepare("UPDATE blog_posts SET view_count = view_count + 1 WHERE id=?").run(post.id);
        const ogImage = `/api/og-image?title=${encodeURIComponent(post.title)}&lang=${post.lang}&toolName=${encodeURIComponent(post.tool_slug || '')}`;
        const related = db.prepare("SELECT id, title, slug, read_time FROM blog_posts WHERE tool_slug=? AND id!=? AND lang=? LIMIT 4").all(post.tool_slug, post.id, post.lang);
        
        return NextResponse.json({ 
          post: { ...post, ogImage, featured_image: `/og-images/${post.tool_slug || 'default'}.png` }, 
          related 
        });
      }
      return NextResponse.json({ post: null, related: [] });
    }

    let query = "SELECT * FROM blog_posts WHERE status='published'";
    const params: any[] = [];

    if (lang && lang !== 'all') {
      query += " AND lang=?";
      params.push(lang);
    }
    if (tool) {
      query += " AND tool_slug=?";
      params.push(tool);
    }

    query += " ORDER BY is_featured DESC, published_at DESC LIMIT ?";
    params.push(limit);

    const posts = db.prepare(query).all(...params);
    
    const enriched = (posts as any[]).map((p: any, index: number) => ({
      ...p,
      key: `post-${p.id || index}`,
      featured_image: `/og-images/${p.tool_slug || 'default'}.png`,
      ogImage: `/api/og-image?title=${encodeURIComponent(p.title)}&lang=${p.lang}&toolName=${encodeURIComponent(p.tool_slug || '')}`
    }));

    return NextResponse.json({ posts: enriched });
  } catch (e: any) {
    return NextResponse.json({ posts: [], error: e.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = new Database(DB_PATH);
    const body = await req.json();
    const { action, title, slug, content, excerpt, lang, status, seo_title, seo_description, seo_keywords } = body;

    if (action === "create") {
      const r = db.prepare("INSERT INTO blog_posts (title, slug, content, excerpt, lang, status, seo_title, seo_description, seo_keywords) VALUES (?,?,?,?,?,?,?,?,?)")
        .run(title, slug, content, excerpt, lang || "en", status || "published", seo_title, seo_description, seo_keywords);
      
      // ✅ INDEXNOW AUTO-SUBMIT
      const postUrl = `${BASE_URL}/blog/${slug}`;
      await submitToIndexNow(postUrl);
      
      return NextResponse.json({ success: true, id: r.lastInsertRowid, indexed: true });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}