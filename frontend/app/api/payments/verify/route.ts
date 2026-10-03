import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import { getPackageById, calculateExpiry } from "@/lib/payment/processor";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

function hash(p: string) { return crypto.createHash("sha256").update(p + "centers-secret-salt").digest("hex"); }
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
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { transactionId, status } = await req.json();
  const db = new Database(DB_PATH);

  if (status === 'success') {
    // SECURITY: never activate a plan from the browser.
    // Activation happens only via the Stripe webhook or an admin action.
    db.prepare("UPDATE user_packages SET status='awaiting_verification' WHERE payment_id=? AND user_id=?").run(transactionId, userId);
    return NextResponse.json({ success: true, message: "Payment received. Awaiting provider confirmation." });
  }

  db.prepare("UPDATE user_packages SET status='failed' WHERE payment_id=? AND user_id=?").run(transactionId, userId);
  return NextResponse.json({ success: false, error: "Payment failed" });
}
