import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get('placement') || '';
    const blogId = searchParams.get('blog_post_id') || '';
    const limit = parseInt(searchParams.get('limit') || '3');
    
    let query = "SELECT * FROM advertisements WHERE status = 'approved'";
    const params: any[] = [];
    
    // Check dates
    query += " AND (start_date IS NULL OR start_date <= datetime('now'))";
    query += " AND (end_date IS NULL OR end_date >= datetime('now'))";
    
    if (placement) {
      query += ' AND placement = ?';
      params.push(placement);
    }
    
    if (blogId) {
      query += ' AND (blog_post_id = ? OR blog_post_id IS NULL)';
      params.push(blogId);
    }
    
    query += ' ORDER BY RANDOM() LIMIT ?';
    params.push(limit);
    
    const ads = db.prepare(query).all(...params);
    
    // Increment impressions
    for (const ad of ads as any[]) {
      db.prepare('UPDATE advertisements SET impressions = impressions + 1 WHERE id = ?').run(ad.id);
    }
    
    return NextResponse.json({ success: true, ads });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
