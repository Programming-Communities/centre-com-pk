import { getLocalDB } from '@/lib/db/local-db';

export interface UserData {
  clerkId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  provider?: string;
  metadata?: any;
  ipAddress?: string;
}

export function syncUserToDB(user: UserData): any {
  const db = getLocalDB();
  
  const existing = db.prepare('SELECT * FROM users WHERE clerk_id = ? OR email = ?').get(user.clerkId, user.email) as any;
  
  const now = new Date().toISOString();
  
  if (existing) {
    db.prepare(`
      UPDATE users SET 
        clerk_id = ?, email = ?, name = ?, first_name = ?, last_name = ?,
        image_url = ?, provider = ?, metadata = ?,
        email_verified = 1, updated_at = ?, last_sign_in = ?, last_sign_in_ip = ?
      WHERE id = ?
    `).run(
      user.clerkId, user.email, user.name, user.firstName || '', user.lastName || '',
      user.imageUrl || '', user.provider || 'clerk', JSON.stringify(user.metadata || {}),
      now, now, user.ipAddress || '', existing.id
    );
    return existing;
  } else {
    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO users (id, clerk_id, email, name, first_name, last_name, image_url, provider, metadata, email_verified, last_sign_in, last_sign_in_ip, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
    `).run(id, user.clerkId, user.email, user.name, user.firstName || '', user.lastName || '', user.imageUrl || '', user.provider || 'clerk', JSON.stringify(user.metadata || {}), now, user.ipAddress || '', now, now);
    
    // Create profile
    db.prepare('INSERT INTO user_profiles (user_id) VALUES (?)').run(id);
    
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
}

export function createSession(userId: string, token: string, ip?: string, userAgent?: string): void {
  const db = getLocalDB();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  
  db.prepare(`
    INSERT INTO user_sessions (id, user_id, token, ip_address, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, token, ip || '', userAgent || '', expiresAt);
}

export function validateSession(token: string): any {
  const db = getLocalDB();
  const session = db.prepare(`
    SELECT s.*, u.email, u.name, u.role, u.image_url 
    FROM user_sessions s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
  `).get(token);
  return session || null;
}

export function getUserByEmail(email: string): any {
  const db = getLocalDB();
  return db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email);
}

export function getUserById(id: string): any {
  const db = getLocalDB();
  return db.prepare('SELECT * FROM users WHERE id = ? AND is_active = 1').get(id);
}
