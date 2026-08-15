// Blog Posts Table Schema
export const BLOG_TABLE = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  tool_slug TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  category TEXT NOT NULL,
  lang TEXT NOT NULL CHECK(lang IN ('en','ur','hi','ar')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  author TEXT DEFAULT 'Centre.com.pk Team',
  status TEXT DEFAULT 'published' CHECK(status IN ('draft','published','archived')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tool_slug) REFERENCES tools(slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_tool ON blog_posts(tool_slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_lang ON blog_posts(lang);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
`
