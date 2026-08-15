import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, adId } = await req.json();
    if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });
    
    // Generate QR code URL using external API
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
    
    // Save to DB
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('UPDATE advertisements SET qr_code_url = ? WHERE id = ?').run(qrUrl, adId);
    
    return NextResponse.json({ success: true, qr_code_url: qrUrl });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
