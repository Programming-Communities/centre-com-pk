// Custom JWT verification helper
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'centers-secret-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyToken(token: string): Promise<{ userId: number; email: string; role: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Verify signature
    const expectedSignature = await hashPassword(`${parts[0]}.${parts[1]}`);
    if (expectedSignature !== parts[2]) return null;

    return {
      userId: parseInt(payload.sub),
      email: payload.email,
      role: payload.role || 'user',
    };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: Request): Promise<{ userId: number; email: string; role: string } | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  return verifyToken(token);
}

export function authError() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
