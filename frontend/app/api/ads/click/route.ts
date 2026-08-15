import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { adId } = await req.json();
    if (!adId) return NextResponse.json({ success: false }, { status: 400 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('UPDATE advertisements SET clicks = clicks + 1 WHERE id = ?').run(adId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
