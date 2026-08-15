// app/api/user/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/payment/tokenLimits';


export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const email = request.nextUrl.searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json({ error: 'User identifier required' }, { status: 400 });
    }

    // @ts-ignore
    const db = (process.env as any).centers_db || (globalThis as any).centers_db;
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    // Get user info
    let user = null;
    if (email) {
      user = await db.prepare(
        'SELECT id, email, name, status, plan, daily_token_limit, token_expiry_hours, created_at, verified_at, last_login FROM users_verified WHERE email = ?'
      ).bind(email).first();
    } else {
      user = await db.prepare(
        'SELECT id, email, name, status, plan, daily_token_limit, token_expiry_hours, created_at, verified_at, last_login FROM users_verified WHERE id = ?'
      ).bind(userId).first();
    }

    if (!user) {
      return NextResponse.json({
        plan: 'guest',
        isGuest: true,
        stats: { totalCards: 0, totalWishes: 0, totalViews: 0 },
        limits: { daily: 5, remaining: 5, expiryHours: 24 },
        recentCards: [],
      });
    }

    // Get subscription info
    const sub = await db.prepare(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(user.id, 'active').first();

    // Get payment history
    const payments = await db.prepare(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 5'
    ).bind(user.id).all();

    // Get token usage today
    const today = new Date().toISOString().split('T')[0];
    const usage = await db.prepare(
      'SELECT count FROM daily_limits WHERE user_id = ? AND date = ?'
    ).bind(user.id, today).first();

    // Get recent cards
    const cards = await db.prepare(
      'SELECT * FROM bday_cards WHERE creator_ip = (SELECT ip_address FROM token_usage WHERE user_id = ? LIMIT 1) ORDER BY created_at DESC LIMIT 5'
    ).bind(user.id).all();

    // Get total stats
    const totalCards = await db.prepare(
      'SELECT COUNT(*) as count FROM token_usage WHERE user_id = ?'
    ).bind(user.id).first();

    // Get total wishes received
    const totalWishes = await db.prepare(
      `SELECT COUNT(*) as count FROM bday_wishes 
       WHERE card_token IN (SELECT token FROM bday_cards WHERE creator_ip = 
       (SELECT ip_address FROM token_usage WHERE user_id = ? LIMIT 1))`
    ).bind(user.id).first();

    // Get total views
    const totalViews = await db.prepare(
      `SELECT SUM(view_count) as total FROM bday_cards WHERE creator_ip = 
       (SELECT ip_address FROM token_usage WHERE user_id = ? LIMIT 1)`
    ).bind(user.id).first();

    const plan = sub?.plan || user.plan || 'free';
    const limits = {
      free: { daily: 5, expiryHours: 24 },
      pro: { daily: 100, expiryHours: 720 },
      premium: { daily: 999999, expiryHours: 87600 },
      lifetime: { daily: 999999, expiryHours: 876000 },
    } as Record<string, any>;

    const currentLimits = limits[plan] || limits['free'];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        plan,
        memberSince: user.created_at,
        verified: user.status === 'verified',
        lastLogin: user.last_login,
      },
      subscription: sub ? {
        plan: sub.plan,
        startedAt: sub.starts_at,
        expiresAt: sub.expires_at,
        isActive: sub.status === 'active',
        daysLeft: sub.expires_at ? Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / 86400000) : 0,
      } : null,
      stats: {
        totalCards: totalCards?.count || 0,
        totalWishes: totalWishes?.count || 0,
        totalViews: totalViews?.total || 0,
        todayUsed: usage?.count || 0,
      },
      limits: {
        daily: currentLimits.daily,
        remaining: currentLimits.daily - (usage?.count || 0),
        expiryHours: currentLimits.expiryHours,
      },
      recentCards: cards.results || [],
      recentPayments: payments.results || [],
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
