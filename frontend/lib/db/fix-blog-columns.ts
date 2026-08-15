import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'centers-local.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

console.log('🔧 Adding missing columns to blog_posts...');

// Add missing columns one by one (ignore errors if already exist)
const columns = [
  'ALTER TABLE blog_posts ADD COLUMN seo_title TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN seo_description TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN seo_keywords TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN video_id TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN featured_image TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN tool_slug TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN tool_name TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN views INTEGER DEFAULT 0',
  'ALTER TABLE blog_posts ADD COLUMN likes INTEGER DEFAULT 0',
  'ALTER TABLE blog_posts ADD COLUMN is_featured INTEGER DEFAULT 0',
  'ALTER TABLE blog_posts ADD COLUMN excerpt TEXT DEFAULT \'\'',
  'ALTER TABLE blog_posts ADD COLUMN published_at TEXT DEFAULT CURRENT_TIMESTAMP',
  'ALTER TABLE blog_posts ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP',
];

for (const col of columns) {
  try {
    db.exec(col);
    console.log('✅', col.substring(0, 60) + '...');
  } catch (e: any) {
    if (e.message.includes('duplicate column')) {
      console.log('⏭️ Already exists:', col.split('ADD COLUMN ')[1]?.split(' ')[0]);
    } else {
      console.log('⚠️', e.message.substring(0, 80));
    }
  }
}

// Also create likes + bookmarks tables
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_slug, user_id)
  );

  CREATE TABLE IF NOT EXISTS user_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_slug, user_id)
  );
`);

console.log('✅ All blog columns and tables ready!');
db.close();
