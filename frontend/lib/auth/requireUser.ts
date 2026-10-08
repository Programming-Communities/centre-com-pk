import { verifyToken } from '@/lib/auth/secure';

export function requireUser(request: Request): { sub: string; email: string; role: string } | null {
  try {
    let token: string | null = null;

    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.sub) return null;

    return {
      sub: String(payload.sub),
      email: String(payload.email || ''),
      role: String(payload.role || 'user'),
    };
  } catch {
    return null;
  }
}
