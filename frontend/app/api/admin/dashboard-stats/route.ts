import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const totalPosts = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as any;
    const totalAds = db.prepare('SELECT COUNT(*) as count FROM advertisements').get() as any;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='completed'").get() as any;
    const pendingKYC = db.prepare("SELECT COUNT(*) as count FROM kyc_requests WHERE status='pending'").get() as any;
    const pendingAds = db.prepare("SELECT COUNT(*) as count FROM advertisements WHERE status='pending'").get() as any;
    const totalViews = db.prepare('SELECT COUNT(*) as count FROM page_views').get() as any;
    const totalKeywords = db.prepare('SELECT COUNT(*) as count FROM seo_keywords').get() as any;
    const recentUsers = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT 5').all();
    const recentPosts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 5').all();
    
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsers?.count || 0,
        totalPosts: totalPosts?.count || 0,
        totalTools: 53,
        totalAds: totalAds?.count || 0,
        totalRevenue: totalRevenue?.total || 0,
        totalViews: totalViews?.count || 0,
        totalKeywords: totalKeywords?.count || 0,
        pendingApprovals: 0,
        pendingKYC: pendingKYC?.count || 0,
        pendingAds: pendingAds?.count || 0,
      },
      recentUsers,
      recentPosts,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
