import { NextRequest, NextResponse } from 'next/server';

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
      const parts = token.split('.');
      if (parts.length !== 3) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      const payload = JSON.parse(atob(parts[1]));
      
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      
      return NextResponse.json({
        user: {
          id: parseInt(payload.sub),
          email: payload.email,
          role: payload.role || 'user',
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
