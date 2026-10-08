import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';
export async function GET(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const requests = db.prepare('SELECT * FROM kyc_requests WHERE user_id = ? ORDER BY created_at DESC').all(user.sub);
    return NextResponse.json({ success: true, requests });
  } catch { return NextResponse.json({ success: true, requests: [] }); }
}
export async function POST(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const body = await req.json();
    db.prepare('INSERT INTO kyc_requests (user_id, user_name, user_email, document_type, document_url, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)').run(user.sub, body.user_name, body.user_email, body.document_type, body.document_url, 'pending', new Date().toISOString(), new Date().toISOString());
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
