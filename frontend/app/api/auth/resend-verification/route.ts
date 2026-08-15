import { NextRequest, NextResponse } from "next/server";
import { getLocalDB } from "@/lib/db/local-db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const db = getLocalDB();
    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as any;
    if (!user) return NextResponse.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 86400000).toISOString();
    db.prepare("INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES (?, ?, 'email_verify', ?)").run(user.id, token, expires);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
