import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema-local";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

// Create SQLite connection
const sqlite = new Database(DB_PATH);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT UNIQUE,
    role TEXT DEFAULT 'user' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    plan TEXT DEFAULT 'free' NOT NULL,
    email_verified INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    tokens_limit INTEGER DEFAULT 20,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled',
    content TEXT,
    plain_text TEXT,
    language TEXT DEFAULT 'en',
    folder TEXT DEFAULT 'root',
    word_count INTEGER DEFAULT 0,
    char_count INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 0,
    share_token TEXT,
    is_starred INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS verification_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_docs_user ON user_documents(user_id);
  CREATE INDEX IF NOT EXISTS idx_docs_deleted ON user_documents(is_deleted);
`);

console.log("✅ Local SQLite database initialized at:", DB_PATH);

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });
export { schema };
export default db;
