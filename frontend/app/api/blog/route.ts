import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const tool = searchParams.get('tool') || '';
    const sort = searchParams.get('sort') || '';
    
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    
    let query = "SELECT * FROM blog_posts WHERE status = 'published' AND lang = ?";
    const params: any[] = [lang];
    
    if (category) { query += " AND category = ?"; params.push(category); }
    
    if (search) {
      query += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)";
      const s = "%" + search + "%";
      params.push(s, s, s);
    }
    
    if (tool) { query += " AND tool_slug = ?"; params.push(tool); }
    
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params) as any;
    
    if (sort === 'views') query += " ORDER BY views DESC";
    else if (sort === 'helpful') query += " ORDER BY helpful_count DESC";
    else query += " ORDER BY created_at DESC";
    
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
    
    const posts = db.prepare(query).all(...params);
    
    return NextResponse.json({ success: true, posts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
