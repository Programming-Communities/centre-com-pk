import { NextRequest, NextResponse } from 'next/server';
import { getLocalDB } from '@/lib/db/local-db';
import { createToken } from '@/lib/auth/secure';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    
    if (!email || !code) {
      return NextResponse.json({ success: false, message: 'Email and code required' }, { status: 400 });
    }

    const db = getLocalDB();
    
    // Check OTP
    const otp = db.prepare(
      "SELECT * FROM otp_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now')"
    ).get(email, code) as any;
    
    if (!otp) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 401 });
    }
    
    // Mark OTP as used
    db.prepare("UPDATE otp_codes SET used = 1 WHERE id = ?").run(otp.id);
    
    // Get user
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    // Update last login
    db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
    
    // Generate JWT token
    const token = createToken({
      sub: user.id.toString(),
      email: user.email,
      role: user.role || 'user',
      name: user.name,
    });
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username || email,
        role: user.role || 'user',
        plan: user.plan || 'free',
      }
    });
    
  } catch (error: any) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
