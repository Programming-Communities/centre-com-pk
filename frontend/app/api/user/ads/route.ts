import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");
const SALT = "centers-secret-salt";

function hash(p: string) { return crypto.createHash("sha256").update(p + SALT).digest("hex"); }
function getUserId(req: NextRequest): number | null {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const parts = auth.slice(7).split(".");
  if (parts.length !== 3) return null;
  const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
  if (payload.exp < Date.now() / 1000 || hash(parts[0] + "." + parts[1]) !== parts[2]) return null;
  return parseInt(payload.sub);
}

export async function GET(req: NextRequest) {
  const uid = getUserId(req);
  if (!uid) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const db = new Database(DB_PATH);
  const ads = db.prepare("SELECT * FROM user_ads WHERE user_id=? ORDER BY created_at DESC").all(uid);
  return NextResponse.json({ ads });
}

export async function POST(req: NextRequest) {
  const uid = getUserId(req);
  if (!uid) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const body = await req.json();
  const { action, title, imageUrl, targetUrl, placement, size, devices, duration_days, package_id, amount_paid } = body;
  const db = new Database(DB_PATH);

  if (action === "create") {
    db.prepare("INSERT INTO user_ads (user_id, package_id, title, image_url, target_url, placement, size, devices, duration_days, amount_paid, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
      .run(uid, package_id, title, imageUrl, targetUrl, placement, size, devices || 'all', duration_days || 30, amount_paid || 0, 'pending');
    return NextResponse.json({ success: true, message: "Ad submitted for admin approval!" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const uid = getUserId(req);
  if (!uid) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await req.json();
  const db = new Database(DB_PATH);
  db.prepare("DELETE FROM user_ads WHERE id=? AND user_id=?").run(id, uid);
  return NextResponse.json({ success: true });
}
