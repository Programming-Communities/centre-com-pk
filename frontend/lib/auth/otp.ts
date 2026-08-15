import { getLocalDB } from '@/lib/db/local-db';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, name: string, lang: string = 'en'): Promise<boolean> {
  const db = getLocalDB();
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();
  
  db.prepare('DELETE FROM otp_codes WHERE email = ?').run(email);
  db.prepare('INSERT INTO otp_codes (id, email, code, expires_at) VALUES (?,?,?,?)').run(crypto.randomUUID(), email, code, expiresAt);
  
  return true;
}

export function verifyOTP(email: string, code: string): boolean {
  const db = getLocalDB();
  const record = db.prepare('SELECT * FROM otp_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime("now")').get(email, code) as any;
  if (record) {
    db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(record.id);
    return true;
  }
  return false;
}
