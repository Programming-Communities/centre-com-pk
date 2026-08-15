import { getLocalDB } from './local-db';

export function migrateUsers() {
  const db = getLocalDB();
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      clerk_id TEXT UNIQUE,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL DEFAULT '',
      first_name TEXT DEFAULT '',
      last_name TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      role TEXT DEFAULT 'user' CHECK(role IN ('user','admin','super_admin')),
      email_verified INTEGER DEFAULT 0,
      provider TEXT DEFAULT 'clerk',
      metadata TEXT DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_sign_in TEXT,
      last_sign_in_ip TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      ip_address TEXT,
      user_agent TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      bio TEXT DEFAULT '',
      website TEXT DEFAULT '',
      country TEXT DEFAULT '',
      city TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      occupation TEXT DEFAULT '',
      preferences TEXT DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
  `);
  
  console.log('✅ Users tables migrated!');
}

if (require.main === module) {
  migrateUsers();
}
