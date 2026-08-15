import { NextRequest, NextResponse } from "next/server";
import { getLocalDB, getUserIdFromRequest, createToken } from "@/lib/db/local-db";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    const db = getLocalDB();
    const { name, birthDate, theme, message, emoji } = await request.json();

    const token = Math.random().toString(36).substring(2, 10);
    
    db.prepare(
      `INSERT INTO bday_cards (user_id, name, birth_date, theme, message, emoji, share_token) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(userId || null, name, birthDate, theme || "default", message || "", emoji || "🎂", token);

    return NextResponse.json({ success: true, token, url: `/bday/${token}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
