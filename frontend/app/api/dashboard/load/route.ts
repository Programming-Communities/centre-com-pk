import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

function getDB() { return new Database(path.join(process.cwd(), "data", "centers-local.db")); }
function hashPassword(p: string): string { return crypto.createHash("sha256").update(p + "centers-secret-salt").digest("hex"); }

function getUserId(request: NextRequest): number | null {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const token = auth.slice(7);
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (hashPassword(parts[0] + "." + parts[1]) !== parts[2]) return null;
    return parseInt(payload.sub);
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = getDB();
    const doc = db.prepare("SELECT * FROM user_documents WHERE id=? AND user_id=?").get(id, userId);
    
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ document: doc });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
