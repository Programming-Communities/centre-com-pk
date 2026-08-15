import type { NextAuthConfig } from "next-auth";
import crypto from "crypto";

function hash(p: string): string {
  return crypto.createHash("sha256").update(p + "centers-secret-salt").digest("hex");
}

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/auth/signin", newUser: "/auth/signup", error: "/auth/error" },
  callbacks: {
    authorized({ auth }) { return !!auth?.user; },
    jwt({ token, user }) { if (user) { token.id = user.id; token.role = (user as any).role || 'user'; } return token; },
    session({ session, token }) { if (session.user) { (session.user as any).id = token.id; (session.user as any).role = token.role || 'user'; } return session; },
  },
  providers: [],
  session: { strategy: 'jwt' },
};

export const authOptions = authConfig;
export async function auth() { return null; }
export async function getServerSession() { return null; }
