import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const payments = db.prepare('SELECT * FROM payments ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, payments });
  } catch (e: any) {
    return NextResponse.json({ success: true, payments: [] });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, notes } = await req.json();
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('UPDATE payments SET status = ?, notes = ?, updated_at = datetime("now") WHERE id = ?').run(status, notes || '', id);
    
    // If approved, upgrade user plan
    if (status === 'completed') {
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as any;
      if (payment) {
        db.prepare('UPDATE users SET plan = ?, updated_at = datetime("now") WHERE id = ?').run(payment.package_name?.toLowerCase() || 'pro', payment.user_id);
      }
    }
    
    return NextResponse.json({ success: true, message: 'Payment ' + status });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
