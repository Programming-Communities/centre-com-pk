import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { path, ip, user_agent, referrer } = await req.json();
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const device = (user_agent || '').includes('Mobile') ? 'mobile' : (user_agent || '').includes('Tablet') ? 'tablet' : 'desktop';
    const browser = (user_agent || '').includes('Chrome') ? 'Chrome' : (user_agent || '').includes('Firefox') ? 'Firefox' : 'Other';
    const now = new Date().toISOString();
    db.prepare('INSERT INTO page_views (path, ip, user_agent, referrer, device, browser, created_at) VALUES (?,?,?,?,?,?,?)').run(path, ip, user_agent, referrer, device, browser, now);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false }); }
}
