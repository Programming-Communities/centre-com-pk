import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username || username.length < 3) return NextResponse.json({ available: false });
    
    const db = new Database(path.join(process.cwd(), "data", "centers-local.db"));
    const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    return NextResponse.json({ available: !existing });
  } catch {
    return NextResponse.json({ available: false });
  }
}
