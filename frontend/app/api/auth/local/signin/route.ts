import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");
const SALT = "centers-secret-salt";

function hashPassword(p: string): string {
  return crypto.createHash("sha256").update(p + SALT).digest("hex");
}

function createToken(userId: number, email: string, role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    sub: userId.toString(),
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  })).toString('base64');
  const signature = hashPassword(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

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

    // ✅ FIXED: Check both bcrypt AND SHA-256 password
    let isValidPassword = false;
    
    if (user.password && user.password.startsWith('$2')) {
      // bcrypt hash (signup se)
      isValidPassword = bcrypt.compareSync(password, user.password);
    } else {
      // Old SHA-256 hash
      isValidPassword = hashPassword(password) === user.password;
    }

    if (!isValidPassword) {
      db.close();
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = createToken(user.id, user.email, user.role || 'user');

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
