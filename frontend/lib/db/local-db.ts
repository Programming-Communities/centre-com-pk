import Database from "better-sqlite3";
import path from "path";
import { verifyToken } from "@/lib/auth/secure";
import crypto from "crypto";

// Singleton pattern — reuse connection
let dbInstance: Database.Database | null = null;

export function getLocalDB(): Database.Database {
  if (dbInstance) return dbInstance;
  
  const dbPath = path.join(process.cwd(), "data", "centers-local.db");
  dbInstance = new Database(dbPath);
  dbInstance.pragma("journal_mode = WAL");
  
  return dbInstance;
}

export function closeLocalDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

// Helper: hash password
export function hashPassword(password: string): string {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(password + "centers-secret-salt").digest("hex");
}

// Helper: create JWT token
export function createToken(userId: number, email: string, role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({
    sub: userId.toString(),
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
  })).toString("base64");
  const signature = hashPassword(header + "." + payload);
  return header + "." + payload + "." + signature;
}

// Helper: verify token from request
export function getUserIdFromRequest(request: Request): number | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.slice(7);

    // 1. Try HMAC verification (new tokens)
    const payload = verifyToken(token);
    if (payload && payload.sub) {
      return parseInt(payload.sub);
    }

    // 2. Fallback: legacy salt verification (old tokens during migration)
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const expected = crypto.createHash("sha256")
      .update(parts[0] + "." + parts[1] + "centers-secret-salt")
      .digest("hex");

    if (expected !== parts[2]) return null;

    const legacyPayload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    if (legacyPayload.exp && legacyPayload.exp < Math.floor(Date.now() / 1000)) return null;

    return parseInt(legacyPayload.sub);
  } catch {
    return null;
  }
}
