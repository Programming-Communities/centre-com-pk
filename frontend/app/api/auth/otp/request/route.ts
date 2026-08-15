import { NextRequest, NextResponse } from 'next/server';
import { getLocalDB } from '@/lib/db/local-db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });

    const db = getLocalDB();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) return NextResponse.json({ success: false, message: 'Account not found' }, { status: 404 });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    db.prepare("DELETE FROM otp_codes WHERE email = ?").run(email);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    db.prepare("INSERT INTO otp_codes (id, email, code, expires_at, used) VALUES (?, ?, ?, ?, 0)").run(crypto.randomUUID(), email, otpCode, expiresAt);

    // Send OTP email (non-blocking)
    import('@/lib/email/emailService').then(({ emailService }) => {
      emailService.sendOTPEmail(email, otpCode, user.name || email).catch(() => {});
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}