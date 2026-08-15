import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const action = searchParams.get('action') || 'methods';
    if (action === 'methods') {
      const methods = db.prepare('SELECT * FROM payment_methods WHERE is_active = 1').all();
      return NextResponse.json({ success: true, methods });
    }
    if (action === 'packages') {
      const packages = db.prepare('SELECT * FROM packages WHERE is_active = 1 ORDER BY price').all();
      return NextResponse.json({ success: true, packages });
    }
    if (!userId) return NextResponse.json({ success: true, payments: [] });
    const payments = db.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return NextResponse.json({ success: true, payments });
  } catch { return NextResponse.json({ success: true, methods: [], packages: [], payments: [] }); }
}
export async function POST(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const body = await req.json();
    if (body.action === 'submit_payment') {
      if (!body.user_id) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
      db.prepare('INSERT INTO payments (user_id, user_email, user_name, package_id, package_name, amount, payment_method, transaction_id, proof_url, status) VALUES (?,?,?,?,?,?,?,?,?,?)').run(body.user_id, body.user_email, body.user_name, body.package_id, body.package_name, body.amount, body.payment_method, body.transaction_id || '', body.proof_url || '', 'pending');
      return NextResponse.json({ success: true, message: 'Submitted' });
    }
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
