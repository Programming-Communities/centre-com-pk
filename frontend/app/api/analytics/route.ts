import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'today';
    let dateFilter = "created_at >= date('now')";
    if (period === 'week') dateFilter = "created_at >= date('now','-7 days')";
    if (period === 'month') dateFilter = "created_at >= date('now','-30 days')";
    if (period === 'all') dateFilter = '1=1';
    
    const totalViews = db.prepare('SELECT COUNT(*) as count FROM page_views WHERE ' + dateFilter).get() as any;
    const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM page_views WHERE ' + dateFilter).get() as any;
    const topPages = db.prepare('SELECT path, COUNT(*) as views FROM page_views WHERE ' + dateFilter + ' GROUP BY path ORDER BY views DESC LIMIT 10').all();
    const viewsByDate = db.prepare('SELECT date(created_at) as date, COUNT(*) as views FROM page_views WHERE ' + dateFilter + ' GROUP BY date(created_at) ORDER BY date DESC LIMIT 30').all();
    const devices = db.prepare('SELECT device, COUNT(*) as count FROM page_views WHERE ' + dateFilter + ' GROUP BY device').all();
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const totalPosts = db.prepare("SELECT COUNT(*) as count FROM blog_posts").get() as any;
    
    return NextResponse.json({ success: true, data: {
      totalViews: totalViews?.count || 0,
      uniqueVisitors: uniqueVisitors?.count || 0,
      totalUsers: totalUsers?.count || 0,
      totalPosts: totalPosts?.count || 0,
      topPages, viewsByDate, devices
    }});
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
