-- Update users table for email verification
CREATE TABLE IF NOT EXISTS users_verified (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'unverified', -- 'unverified', 'verified', 'blocked'
  verification_token TEXT UNIQUE,
  verification_sent_at TEXT,
  verified_at TEXT,
  plan TEXT DEFAULT 'free',
  daily_token_limit INTEGER DEFAULT 5,
  token_expiry_hours INTEGER DEFAULT 24,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

-- Verification tokens tracking
CREATE TABLE IF NOT EXISTS verification_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'email_verify', -- 'email_verify', 'password_reset'
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
