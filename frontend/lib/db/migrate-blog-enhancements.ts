import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'centers-local.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

console.log('🔄 Running blog enhancements migration...');

db.exec(`
  -- Categories table (if not exists)
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'blog',
    icon TEXT DEFAULT '',
    description TEXT DEFAULT '',
    lang TEXT DEFAULT 'en',
    parent_id INTEGER,
    post_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Blog likes table (if not exists)
  CREATE TABLE IF NOT EXISTS blog_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_slug, user_id)
  );

  -- Blog reactions table (if not exists)
  CREATE TABLE IF NOT EXISTS blog_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    emoji TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- User bookmarks table (if not exists)
  CREATE TABLE IF NOT EXISTS user_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_slug, user_id)
  );

  -- Add indexes
  CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
  CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
  CREATE INDEX IF NOT EXISTS idx_blog_likes_slug ON blog_likes(post_slug);
  CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user ON user_bookmarks(user_id);

  -- Add columns to blog_posts if not exist
  ALTER TABLE blog_posts ADD COLUMN tool_slug TEXT DEFAULT '';
  ALTER TABLE blog_posts ADD COLUMN tool_name TEXT DEFAULT '';
  ALTER TABLE blog_posts ADD COLUMN video_id TEXT DEFAULT '';
  ALTER TABLE blog_posts ADD COLUMN likes INTEGER DEFAULT 0;
  ALTER TABLE blog_posts ADD COLUMN is_featured INTEGER DEFAULT 0;
`);

console.log('✅ Blog enhancements migration complete!');
console.log('📊 Tables created/enhanced: categories, blog_likes, blog_reactions, user_bookmarks');

db.close();
