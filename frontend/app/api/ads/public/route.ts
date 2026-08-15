import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get('placement') || '';
    const blogId = searchParams.get('blog_post_id') || '';
    const tool = searchParams.get('tool_slug') || '';
    const limit = parseInt(searchParams.get('limit') || '3');
    
    let query = "SELECT * FROM advertisements WHERE status = 'active'";
    const params: any[] = [];
    
    query += " AND (start_date IS NULL OR start_date <= datetime('now'))";
    query += " AND (end_date IS NULL OR end_date >= datetime('now'))";
    query += " AND impressions < max_impressions AND clicks < max_clicks";
    
    if (placement) { query += ' AND placement = ?'; params.push(placement); }
    if (blogId) { query += ' AND (blog_post_id = ? OR blog_post_id IS NULL)'; params.push(blogId); }
    if (tool) { query += ' AND (tool_slug = ? OR tool_slug IS NULL)'; params.push(tool); }
    
    query += ' ORDER BY priority DESC, RANDOM() LIMIT ?';
    params.push(limit);
    
    const ads = db.prepare(query).all(...params);
    
    for (const ad of ads as any[]) {
      db.prepare('UPDATE advertisements SET impressions = impressions + 1 WHERE id = ?').run(ad.id);
    }
    
    return NextResponse.json({ success: true, ads });
  } catch (e: any) {
    return NextResponse.json({ success: true, ads: [] });
  }
}
