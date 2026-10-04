import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createToken, verifyPassword, hashPassword as bcryptHash } from "@/lib/auth/secure";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const db = new Database(DB_PATH);
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      db.close();
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status !== 'approved' && user.status !== 'active') {
      db.close();
      return NextResponse.json({ error: 'Your account is pending approval.' }, { status: 403 });
    }

    // ✅ FIXED: Check both bcrypt AND legacy SHA-256 password
    let isValidPassword = false;
    let needsRehash = false;

    if (user.password && user.password.startsWith('$2')) {
      // bcrypt hash (signup se)
      isValidPassword = await verifyPassword(password, user.password);
    } else {
      // Old SHA-256 hash — verify then transparently upgrade to bcrypt
      const crypto = require('crypto');
      const legacyHash = crypto.createHash('sha256').update(password + 'centers-secret-salt').digest('hex');
      if (legacyHash === user.password) {
        isValidPassword = true;
        needsRehash = true;
      }
    }

    if (!isValidPassword) {
      db.close();
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (needsRehash) {
      const newHash = await bcryptHash(password);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newHash, user.id);
    }

    const token = createToken({ sub: String(user.id), email: user.email, role: user.role || 'user' });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        status: user.status,
        plan: user.plan || 'free',
        avatar: user.avatar,
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    db.close();
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
