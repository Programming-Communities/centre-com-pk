import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getLocalDB } from '@/lib/db/local-db';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ success: false, message: 'Token and password required' }, { status: 400 });
    }

    const db = getLocalDB();
    
    // Find valid token
    const record = db.prepare(
      "SELECT * FROM verification_tokens WHERE token = ? AND type = 'password_reset' AND expires > datetime('now')"
    ).get(token) as any;

    if (!record) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    // Hash new password
    const hash = bcrypt.hashSync(password, 12);
    
    // Update user password
    db.prepare('UPDATE users SET password = ?, updated_at = datetime("now") WHERE email = ?')
      .run(hash, record.identifier);

    // Delete used token
    db.prepare('DELETE FROM verification_tokens WHERE id = ?').run(record.id);

    return NextResponse.json({ success: true, message: 'Password reset successfully!' });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}
