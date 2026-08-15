// lib/payment/tokenGenerator.ts
export function generateToken(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export function generatePaymentRef(): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${date}-${rand}`;
}

export function generateUserId(): string {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}
