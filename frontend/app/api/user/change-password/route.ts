import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
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

export async function POST(req: NextRequest) {
  const uid = getUserId(req);
  if (!uid) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const db = new Database(DB_PATH);
  const user = db.prepare("SELECT password FROM users WHERE id=?").get(uid) as any;
  
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Verify current password (bcrypt or old SHA256)
  let valid = false;
  if (user.password.startsWith('$2')) {
    valid = bcrypt.compareSync(currentPassword, user.password);
  } else {
    valid = hash(currentPassword) === user.password;
  }

  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

  // Hash new password with bcrypt
  const newHash = bcrypt.hashSync(newPassword, 12);
  db.prepare("UPDATE users SET password=?, updated_at=datetime('now') WHERE id=?").run(newHash, uid);

  return NextResponse.json({ success: true, message: "Password changed!" });
}
