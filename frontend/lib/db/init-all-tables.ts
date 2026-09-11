import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "centers-local.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    plan TEXT DEFAULT 'free',
    email_verified INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    tokens_limit INTEGER DEFAULT 20,
    avatar TEXT,
    bio TEXT,
    website TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT DEFAULT 'Untitled',
    content TEXT,
    plain_text TEXT,
    content_type TEXT DEFAULT 'quill-delta',
    language TEXT DEFAULT 'en',
    folder TEXT DEFAULT 'root',
    tags TEXT,
    word_count INTEGER DEFAULT 0,
    char_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 0,
    share_token TEXT,
    is_starred INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS document_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER NOT NULL REFERENCES user_documents(id),
    content TEXT NOT NULL,
    plain_text TEXT,
    version INTEGER DEFAULT 1,
    comment TEXT,
    file_size INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS verification_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bday_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    theme TEXT DEFAULT 'default',
    message TEXT,
    emoji TEXT DEFAULT '🎂',
    share_token TEXT UNIQUE,
    views INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cv_resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT DEFAULT 'My CV',
    data TEXT,
    template TEXT DEFAULT 'professional',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cv_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER NOT NULL REFERENCES cv_resumes(id),
    data TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cv_share_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER NOT NULL REFERENCES cv_resumes(id),
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    theme TEXT DEFAULT 'professional-blue',
    font_family TEXT DEFAULT 'system-ui',
    dark_mode INTEGER DEFAULT 0,
    language TEXT DEFAULT 'en',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_docs_user ON user_documents(user_id);
  CREATE INDEX IF NOT EXISTS idx_cv_user ON cv_resumes(user_id);
  CREATE INDEX IF NOT EXISTS idx_bday_token ON bday_cards(share_token);
`);

console.log("✅ All tables initialized at:", dbPath);
db.close();