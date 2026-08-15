// lib/payment/tokenLimits.ts
export interface TokenLimitConfig {
  dailyLimit: number;
  expiryHours: number;
  plan: string;
}

export const PLAN_LIMITS: Record<string, TokenLimitConfig> = {
guest: { dailyLimit: 20, expiryHours: 24, plan: 'guest' },
free: { dailyLimit: 50, expiryHours: 168, plan: 'free' },
pro: { dailyLimit: 200, expiryHours: 720, plan: 'pro' },
  premium: { dailyLimit: 999999, expiryHours: 87600, plan: 'premium' },
  lifetime: { dailyLimit: 999999, expiryHours: 876000, plan: 'lifetime' },
};

export async function checkTokenLimit(
  db: any,
  identifier: string,
  plan: string = 'guest'
): Promise<{ allowed: boolean; remaining: number; max: number; message: string }> {
  const config = PLAN_LIMITS[plan] || PLAN_LIMITS.guest;
  const today = new Date().toISOString().split('T')[0];

  // Check or create daily limit record
  let record = await db.prepare(
    'SELECT * FROM daily_limits WHERE (user_id = ? OR ip_address = ?) AND date = ?'
  ).bind(identifier, identifier, today).first();

  if (!record) {
    await db.prepare(
      'INSERT INTO daily_limits (user_id, ip_address, date, count) VALUES (?, ?, ?, 0)'
    ).bind(identifier, identifier, today).run();
    record = { count: 0 };
  }

  const currentCount = record.count || 0;
  const remaining = config.dailyLimit - currentCount;

  if (currentCount >= config.dailyLimit) {
    const upgradeMsg = plan === 'guest' 
      ? 'Daily limit reached. Sign up free for 20 cards/day!'
      : plan === 'free'
      ? 'Daily limit reached. Upgrade to Pro for 100 cards/day!'
      : 'Daily limit reached. Upgrade to Premium for unlimited!';

    return {
      allowed: false,
      remaining: 0,
      max: config.dailyLimit,
      message: upgradeMsg,
    };
  }

  return {
    allowed: true,
    remaining,
    max: config.dailyLimit,
    message: `${remaining} cards remaining today`,
  };
}

export async function incrementTokenCount(
  db: any,
  identifier: string
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await db.prepare(
    'UPDATE daily_limits SET count = count + 1 WHERE (user_id = ? OR ip_address = ?) AND date = ?'
  ).bind(identifier, identifier, today).run();
}

export async function getUserPlan(db: any, userId: string): Promise<string> {
  if (!userId) return 'guest';
  
  const sub = await db.prepare(
    'SELECT plan FROM subscriptions WHERE user_id = ? AND status = ? AND expires_at > ?'
  ).bind(userId, 'active', new Date().toISOString()).first();

  if (sub) return sub.plan as string;

  const freeUser = await db.prepare(
    'SELECT plan FROM users_free WHERE id = ?'
  ).bind(userId).first();

  return freeUser?.plan as string || 'guest';
}
