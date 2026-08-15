import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

function getDB() {
  const dbPath = path.join(process.cwd(), "data", "centers-local.db");
  return new Database(dbPath);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, username } = body;
    if (!name || !email || !password) return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });

    const db = getDB();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) { db.close(); return NextResponse.json({ error: "Email already registered" }, { status: 409 }); }

    const hashedPassword = await bcrypt.hash(password, 12);
    db.prepare("INSERT INTO users (name, email, password, username, role, status, plan) VALUES (?, ?, ?, ?, 'user', 'active', 'free')").run(name, email, hashedPassword, username || null);
    db.close();

    // ✅ Send Welcome Email (async, non-blocking)
    import('@/lib/email/emailService').then(({ emailService }) => {
      emailService.sendWelcomeEmail(email, name).catch(() => {});
    });

    return NextResponse.json({ success: true, message: "Account created successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
