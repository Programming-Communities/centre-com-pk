import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/secure';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      let user: any = null;

      // 1. Try HMAC verification (new tokens)
      const payload = verifyToken(token);
      if (payload && payload.sub) {
        user = payload;
      } else {
        // 2. Fallback: legacy salt verification (old tokens during migration)
        const parts = token.split('.');
        if (parts.length !== 3) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const expected = crypto.createHash('sha256')
          .update(parts[0] + '.' + parts[1] + 'centers-secret-salt')
          .digest('hex');

        if (expected !== parts[2]) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const legacyPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        if (legacyPayload.exp && legacyPayload.exp < Math.floor(Date.now() / 1000)) {
          return NextResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        user = legacyPayload;
      }

      return NextResponse.json({
        user: {
          id: parseInt(user.sub),
          email: user.email,
          role: user.role || 'user',
        }
      });
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/auth/local/signin' },
    { status: 405 }
  );
}
