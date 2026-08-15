import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import crypto from "randombytes";

function getDB() {
  const dbPath = path.join(process.cwd(), "data", "centers-local.db");
  return new Database(dbPath);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const db = getDB();
    const user = db.prepare("SELECT id, name, email FROM users WHERE email = ?").get(email) as any;
    if (!user) { db.close(); return NextResponse.json({ error: "No account found" }, { status: 404 }); }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString();
    db.prepare("INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES (?, ?, 'password_reset', ?)").run(user.id, token, expiresAt);
    db.close();

    const resetLink = `https://www.centre.com.pk/auth/reset-password?token=${token}`;

    // Send reset email (non-blocking)
    import('@/lib/email/emailService').then(({ emailService }) => {
      emailService.sendForgotPasswordEmail(email, resetLink, user.name).catch(() => {});
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Reset link sent to your email" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}