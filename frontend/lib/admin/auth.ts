import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  
  if (!user[0] || user[0].role !== 'admin') {
    redirect('/');
  }

  return user[0];
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export function isAdmin(session: any): boolean {
  return session?.user?.role === 'admin';
}
