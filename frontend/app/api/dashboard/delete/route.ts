import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import { verifyToken } from "@/lib/auth/secure";

function getDB() {
  const dbPath = path.join(process.cwd(), "data", "centers-local.db");
  return new Database(dbPath);
}

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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const db = getDB();
    const body = await request.json();
    const url = request.url;
    
    if (url.includes("/save")) {
      const { id, title, content, plainText } = body;
      if (id) {
        db.prepare("UPDATE user_documents SET title=?, content=?, plain_text=?, word_count=?, char_count=?, updated_at=datetime('now') WHERE id=? AND user_id=?")
          .run(title, content, plainText, plainText ? plainText.split(/\s+/).filter(Boolean).length : 0, plainText ? plainText.length : 0, id, userId);
        return NextResponse.json({ success: true, document: { id, title } });
      } else {
        const r = db.prepare("INSERT INTO user_documents (user_id, title, content, plain_text, word_count, char_count) VALUES (?,?,?,?,?,?)")
          .run(userId, title || "Untitled", content || "", plainText || "", plainText ? plainText.split(/\s+/).filter(Boolean).length : 0, plainText ? plainText.length : 0);
        return NextResponse.json({ success: true, document: { id: r.lastInsertRowid, title: title || "Untitled" } });
      }
    }
    
    if (url.includes("/delete")) {
      db.prepare("UPDATE user_documents SET is_deleted=1, deleted_at=datetime('now') WHERE id=? AND user_id=?").run(body.id, userId);
      return NextResponse.json({ success: true });
    }
    
    if (url.includes("/share")) {
      const token = Math.random().toString(36).substring(2, 10);
      db.prepare("UPDATE user_documents SET is_public=?, share_token=? WHERE id=? AND user_id=?").run(body.makePublic ? 1 : 0, body.makePublic ? token : null, body.id, userId);
      return NextResponse.json({ success: true, shareToken: body.makePublic ? token : null });
    }
    
    return NextResponse.json({ error: "Unknown" }, { status: 404 });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const db = getDB();
    const url = request.url;
    
    if (url.includes("/list")) {
      const docs = db.prepare("SELECT id, title, updated_at, word_count, is_public FROM user_documents WHERE user_id=? AND is_deleted=0 ORDER BY updated_at DESC LIMIT 50").all(userId);
      return NextResponse.json({ documents: docs });
    }
    
    if (url.includes("/load")) {
      const id = new URL(url).searchParams.get("id");
      const doc = db.prepare("SELECT * FROM user_documents WHERE id=? AND user_id=?").get(id, userId);
      return NextResponse.json({ document: doc || null });
    }
    
    return NextResponse.json({ error: "Unknown" }, { status: 404 });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
