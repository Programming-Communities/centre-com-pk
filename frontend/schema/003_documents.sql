CREATE TABLE IF NOT EXISTS user_documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  is_starred BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_versions (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES user_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  plain_text TEXT,
  version INTEGER DEFAULT 1,
  comment TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
