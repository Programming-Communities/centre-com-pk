import { NextRequest, NextResponse } from "next/server";
import { getLocalDB } from "@/lib/db/local-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const db = getLocalDB();
    const vt = db.prepare("SELECT * FROM verification_tokens WHERE token = ? AND used = 0").get(token) as any;
    if (!vt) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    if (new Date(vt.expires_at) < new Date()) return NextResponse.json({ error: "Token expired" }, { status: 400 });

    db.prepare("UPDATE users SET email_verified = 1, status = 'active' WHERE id = ?").run(vt.user_id);
    db.prepare("UPDATE verification_tokens SET used = 1 WHERE id = ?").run(vt.id);

    return NextResponse.json({ success: true, message: "Email verified" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
