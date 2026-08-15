CREATE TABLE IF NOT EXISTS cv_resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'My CV',
  data JSONB,
  template TEXT DEFAULT 'professional',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cv_versions (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER REFERENCES cv_resumes(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cv_share_tokens (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER REFERENCES cv_resumes(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
