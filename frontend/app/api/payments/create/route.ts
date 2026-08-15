import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import { processStripePayment, processPayPalPayment, processManualPayment, getPackageById } from "@/lib/payment/processor";
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

  const { packageId, paymentMethod } = await req.json();
  const pkg = getPackageById(packageId);
  if (!pkg || pkg.price < 0) return NextResponse.json({ error: "Invalid package" }, { status: 400 });

  let result;

  if (pkg.price === 0) {
    // Free plan — activate directly
    const db = new Database(DB_PATH);
    const existing = db.prepare("SELECT id FROM user_packages WHERE user_id=? AND status='active'").get(userId);
    if (existing) {
      db.prepare("UPDATE user_packages SET status='expired', end_date=datetime('now') WHERE user_id=? AND status='active'").run(userId);
    }
    db.prepare("INSERT INTO user_packages (user_id, package_id, status, start_date, end_date, amount, payment_method) VALUES (?,?,?,datetime('now'),NULL,0,'free')").run(userId, pkg.id);
    db.prepare("UPDATE users SET plan=? WHERE id=?").run(packageId, userId);
    return NextResponse.json({ success: true, message: "Free plan activated!", redirectUrl: "/dashboard/plan?activated=free" });
  }

  // Paid plans
  if (paymentMethod === 'stripe') {
    result = await processStripePayment({ userId, packageId, amount: pkg.price, currency: 'usd', paymentMethod: 'stripe' });
  } else if (paymentMethod === 'paypal') {
    result = await processPayPalPayment({ userId, packageId, amount: pkg.price, currency: 'usd', paymentMethod: 'paypal' });
  } else {
    result = await processManualPayment({ userId, packageId, amount: pkg.price, currency: 'usd', paymentMethod: 'manual' });
  }

  if (result.success && result.transactionId) {
    const db = new Database(DB_PATH);
    db.prepare("INSERT INTO user_packages (user_id, package_id, status, start_date, amount, payment_id, payment_method) VALUES (?,?,?,datetime('now'),?,?,?)").run(userId, pkg.id, 'pending', pkg.price, result.transactionId, paymentMethod);
  }

  return NextResponse.json(result);
}
