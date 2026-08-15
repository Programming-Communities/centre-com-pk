CREATE TABLE IF NOT EXISTS post_reactions (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT,
  reaction TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id, session_id, reaction)
);

CREATE INDEX IF NOT EXISTS idx_reactions_post ON post_reactions(post_id);
