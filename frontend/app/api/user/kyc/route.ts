import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ success: true, requests: [] });
    const requests = db.prepare('SELECT * FROM kyc_requests WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return NextResponse.json({ success: true, requests });
  } catch { return NextResponse.json({ success: true, requests: [] }); }
}
export async function POST(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const body = await req.json();
    if (!body.user_id) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
    db.prepare('INSERT INTO kyc_requests (user_id, user_name, user_email, document_type, document_url, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)').run(body.user_id, body.user_name, body.user_email, body.document_type, body.document_url, 'pending', new Date().toISOString(), new Date().toISOString());
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
