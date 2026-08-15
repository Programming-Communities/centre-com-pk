import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'centers-local.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

console.log('🔄 Dropping old tables...');
db.exec('DROP TABLE IF EXISTS blog_posts');
db.exec('DROP TABLE IF EXISTS blog_likes');
db.exec('DROP TABLE IF EXISTS user_bookmarks');

console.log('✅ Creating blog_posts with ALL 22 columns...');
db.exec(`
  CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT DEFAULT '',
    excerpt TEXT DEFAULT '',
    category TEXT DEFAULT 'general',
    lang TEXT DEFAULT 'en',
    status TEXT DEFAULT 'published',
    tool_slug TEXT DEFAULT '',
    tool_name TEXT DEFAULT '',
    seo_title TEXT DEFAULT '',
    seo_description TEXT DEFAULT '',
    seo_keywords TEXT DEFAULT '',
    video_id TEXT DEFAULT '',
    featured_image TEXT DEFAULT '',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    published_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

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

console.log('✅ All 3 tables created!');
console.log('📊 blog_posts columns:');
const cols = db.prepare("PRAGMA table_info(blog_posts)").all();
cols.forEach((c: any) => console.log(`   ✅ ${c.name} (${c.type})`));

db.close();
console.log('🎉 DATABASE FIX COMPLETE!');
