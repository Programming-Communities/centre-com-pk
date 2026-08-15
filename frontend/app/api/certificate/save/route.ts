import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, issuer, category, issueDate, expiryDate, credentialId, url, imageData } = body;
    if (!userId || !name || !issuer) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const db = (process.env as any).centers_db || (globalThis as any).centers_db;
    if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 500 });

    const id = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO user_certificates (id, user_id, name, issuer, category, issue_date, expiry_date, credential_id, verification_url, image_base64, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(id, userId, name, issuer, category || 'professional', issueDate || null, expiryDate || null, credentialId || null, url || null, imageData || null).run();

    return NextResponse.json({ success: true, certId: id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
