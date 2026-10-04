import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import { verifyToken } from "@/lib/auth/secure";

function getDB() { return new Database(path.join(process.cwd(), "data", "centers-local.db")); }

function getUserId(request: NextRequest): number | null {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const token = auth.slice(7);
    let user: any = null;

    // 1. Try HMAC verification (new tokens)
    const payload = verifyToken(token);
    if (payload && payload.sub) {
      user = payload;
    } else {
      // 2. Fallback: legacy salt verification (old tokens during migration)
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const expected = crypto.createHash("sha256")
        .update(parts[0] + "." + parts[1] + "centers-secret-salt")
        .digest("hex");

      if (expected !== parts[2]) return null;

      const legacyPayload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      if (legacyPayload.exp && legacyPayload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      user = legacyPayload;
    }

    return parseInt(user.sub);
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
