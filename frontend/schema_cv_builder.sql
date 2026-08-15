-- ============================================
-- CV BUILDER DATABASE SCHEMA (D1)
-- ============================================

CREATE TABLE IF NOT EXISTS cv_resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Resume',
  template TEXT NOT NULL DEFAULT 'professional-blue',
  data TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users_free(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cv_versions (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (resume_id) REFERENCES cv_resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cv_share_tokens (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (resume_id) REFERENCES cv_resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_ai_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'gemini',
  api_key_encrypted TEXT,
  model TEXT,
  use_built_in BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users_free(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_photos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'profile',
  data_base64 TEXT NOT NULL,
  filename TEXT,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  filter_applied TEXT DEFAULT 'original',
  quality INTEGER DEFAULT 80,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users_free(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_certificates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'professional',
  issue_date TEXT,
  expiry_date TEXT,
  credential_id TEXT,
  verification_url TEXT,
  image_base64 TEXT,
  image_filename TEXT,
  is_active BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users_free(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_screenshots (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  image_base64 TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users_free(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cv_resumes_user_id ON cv_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_versions_resume_id ON cv_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_cv_share_tokens_token ON cv_share_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_ai_settings_user_id ON user_ai_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id ON user_certificates(user_id);
