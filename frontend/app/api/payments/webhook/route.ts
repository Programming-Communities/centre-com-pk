import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import { PAYMENT_CONFIG } from "@/lib/payment/config";
import { getPackageById, calculateExpiry } from "@/lib/payment/processor";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(PAYMENT_CONFIG.stripe.secretKey);
    const event = stripe.webhooks.constructEvent(body, signature, PAYMENT_CONFIG.stripe.webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = parseInt(session.metadata?.userId || '0');
      const packageId = session.metadata?.packageId || 'pro';

      const db = new Database(DB_PATH);
      const pkg = getPackageById(packageId);
      const expiry = calculateExpiry(pkg?.durationDays || 30);

      db.prepare("UPDATE user_packages SET status='active', start_date=datetime('now'), end_date=?, payment_id=? WHERE user_id=? AND status='pending' ORDER BY created_at DESC LIMIT 1").run(expiry, session.id, userId);
      db.prepare("UPDATE users SET plan=? WHERE id=?").run(packageId, userId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
