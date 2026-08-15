// app/api/token/create/route.ts
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, sections, plan, userId } = body;

    // ✅ FIXED: Check multiple possible binding names
    const db = (globalThis as any).centers_db 
      || (globalThis as any).__D1_BETA__DB 
      || (process.env as any).DB 
      || (globalThis as any).DB;
    
    if (!db) {
      console.error('D1 Database binding not found. Tried: centers_db, __D1_BETA__DB, DB');
      return NextResponse.json(
        { success: false, error: 'Database not available. Please check D1 binding.' },
        { status: 500 }
      );
    }

    // ✅ PLAN-BASED EXPIRY CONFIG
    const expiryConfig: Record<string, number> = {
      guest: 24,
      free: 168,
      pro: 720,
      premium: 87600,
      lifetime: 876000,
    };
    
    const userPlan = plan || 'guest';
    const expiryHours = expiryConfig[userPlan] || 24;
    const expiresAt = new Date(Date.now() + expiryHours * 3600000).toISOString();

    const planLimits: Record<string, number> = {
      guest: 5,
      free: 20,
      pro: 100,
      premium: 999999,
      lifetime: 999999,
    };
    const maxDaily = planLimits[userPlan] || 5;

    const ipAddress = request.headers.get('cf-connecting-ip') || 'anonymous';
    const identifier = userId || ipAddress;
    const today = new Date().toISOString().split('T')[0];
    let usageRecord: any;
    
    try {
      usageRecord = await db.prepare(
        'SELECT count FROM daily_limits WHERE ip_address = ? AND date = ? LIMIT 1'
      ).bind(ipAddress, today).first();
    } catch (err) {
      console.log('daily_limits table may not exist — continuing');
    }

    const currentCount = usageRecord?.count || 0;
    const remaining = maxDaily - currentCount;

    if (currentCount >= maxDaily) {
      const upgradeMsg = userPlan === 'guest'
        ? 'Daily limit (5) reached. Sign up free for 20 cards/day!'
        : userPlan === 'free'
        ? 'Daily limit (20) reached. Upgrade to Pro for 100 cards/day!'
        : `Daily limit (${maxDaily}) reached.`;

      return NextResponse.json(
        { success: false, error: 'limit_reached', message: upgradeMsg, remaining: 0, max: maxDaily, plan: userPlan },
        { status: 429 }
      );
    }

    // Generate token
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 8; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }

    const ageData = data?.ageData || {};
    const cardSections = sections || {};

    // Update daily limit
    try {
      if (usageRecord) {
        await db.prepare(
          'UPDATE daily_limits SET count = count + 1 WHERE ip_address = ? AND date = ?'
        ).bind(ipAddress, today).run();
      } else {
        await db.prepare(
          'INSERT INTO daily_limits (ip_address, date, count) VALUES (?, ?, 1)'
        ).bind(ipAddress, today).run();
      }
    } catch (err) {
      console.error('Failed to update daily_limits:', err);
    }

    // Save card
    try {
      await db.prepare(`
        INSERT INTO bday_cards (
          token, user_name, years, months, days,
          total_days, age_in_months, total_weeks, total_hours,
          days_until_bday, life_percentage, zodiac, next_birthday_date,
          is_birthday_today,
          show_emoji, show_years, show_months_days, show_zodiac,
          show_total_days, show_age_months, show_total_weeks, show_total_hours,
          show_days_until_bday, show_life_percent, show_bday_countdown, show_next_bday_date,
          emoji, custom_message, color_theme, bg_pattern,
          expires_at, creator_ip
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        token, 'Anonymous',
        ageData.years || 0, ageData.months || 0, ageData.days || 0,
        ageData.totalDays || 0, ageData.ageInMonths || 0,
        ageData.totalWeeks || 0, ageData.totalHours || 0,
        ageData.daysUntilBirthday || 0, ageData.lifePercentage || '0',
        ageData.zodiacSignKey || '', ageData.formattedNextBirthday || '',
        ageData.isBirthdayToday ? 1 : 0,
        cardSections.showEmoji ? 1 : 0, cardSections.showYears ? 1 : 0,
        cardSections.showMonthsDays ? 1 : 0, cardSections.showZodiac ? 1 : 0,
        cardSections.showTotalDays ? 1 : 0, cardSections.showAgeInMonths ? 1 : 0,
        cardSections.showTotalWeeks ? 1 : 0, cardSections.showTotalHours ? 1 : 0,
        cardSections.showDaysUntilBirthday ? 1 : 0, cardSections.showLifePercentage ? 1 : 0,
        cardSections.showBirthdayCountdown ? 1 : 0, cardSections.showNextBirthdayDate ? 1 : 0,
        data.selectedEmoji || '🎂', data.customMessage || '',
        String(data.selectedColor || 0), String(data.selectedPattern || 0),
        expiresAt, ipAddress
      ).run();
    } catch (err) {
      console.error('Failed to save bday_card (table may not exist):', err);
    }

    return NextResponse.json({
      success: true,
      token,
      url: `https://www.centre.com.pk/bday/${token}`,
      expiresAt,
      plan: userPlan,
      expiryHours,
      message: userPlan === 'guest' 
        ? 'Link valid for 24 hours. Sign up for 7-day links!'
        : `Link valid for ${expiryHours}h — ${userPlan} plan`,
      remaining: remaining - 1,
      max: maxDaily,
    });

  } catch (error: any) {
    console.error('Token creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}