CREATE TABLE IF NOT EXISTS bday_cards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  theme TEXT DEFAULT 'default',
  message TEXT,
  emoji TEXT DEFAULT '🎂',
  share_token TEXT UNIQUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bday_token ON bday_cards(share_token);
