import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

export async function GET(req: NextRequest) {
  try {
    const tool = new URL(req.url).searchParams.get("tool") || "age-calculator";
    const db = new Database(DB_PATH);
    const rows = db.prepare("SELECT reaction, COUNT(*) as c FROM tool_reactions WHERE tool_slug=? GROUP BY reaction").all(tool) as any[];
    const counts: Record<string, number> = {};
    rows.forEach((r: any) => { counts[r.reaction] = r.c; });
    return NextResponse.json({ counts });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tool, reaction } = await req.json();
    if (!tool || !reaction) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    
    const db = new Database(DB_PATH);
    const sid = "sess_" + Math.random().toString(36).substring(2, 10);
    
    const existing = db.prepare("SELECT id FROM tool_reactions WHERE tool_slug=? AND reaction=? AND session_id=?").get(tool, reaction, sid) as any;
    if (existing) {
      db.prepare("DELETE FROM tool_reactions WHERE id=?").run(existing.id);
    } else {
      db.prepare("INSERT INTO tool_reactions (tool_slug, session_id, reaction) VALUES (?,?,?)").run(tool, sid, reaction);
    }
    
    const rows = db.prepare("SELECT reaction, COUNT(*) as c FROM tool_reactions WHERE tool_slug=? GROUP BY reaction").all(tool) as any[];
    const counts: Record<string, number> = {};
    rows.forEach((r: any) => { counts[r.reaction] = r.c; });
    
    return NextResponse.json({ success: true, counts });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
