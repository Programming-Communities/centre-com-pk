CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  avatar TEXT,
  bio TEXT,
  website TEXT,
  plan TEXT DEFAULT 'free',
  tokens_used INTEGER DEFAULT 0,
  tokens_limit INTEGER DEFAULT 20,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
