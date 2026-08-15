import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

async function migrate() {
  const db = new Database(DB_PATH);
  
  console.log("🔄 Migrating blog posts to multi-language...");
  
  try {
    // Check if translations column exists
    const tableInfo = db.prepare("PRAGMA table_info(blog_posts)").all();
    const hasTranslations = tableInfo.some((col: any) => col.name === 'translations');
    
    if (!hasTranslations) {
      // Add translations column
      db.prepare("ALTER TABLE blog_posts ADD COLUMN translations TEXT").run();
      console.log("✅ Added translations column");
    }
    
    // Add parent_slug column
    const hasParentSlug = tableInfo.some((col: any) => col.name === 'parent_slug');
    if (!hasParentSlug) {
      db.prepare("ALTER TABLE blog_posts ADD COLUMN parent_slug TEXT").run();
      console.log("✅ Added parent_slug column");
    }
    
    // Migrate existing posts
    const posts = db.prepare("SELECT id, title, slug, content, excerpt, lang, seo_title, seo_description FROM blog_posts").all();
    console.log(`📝 Found ${posts.length} posts to migrate...`);
    
    let migrated = 0;
    for (const post of posts) {
      // Check if already migrated (has translations)
      const existing = db.prepare("SELECT translations FROM blog_posts WHERE id = ?").get(post.id);
      if (existing && existing.translations) {
        continue;
      }
      
      const translations = {
        [post.lang || 'en']: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt || '',
          seo_title: post.seo_title || '',
          seo_description: post.seo_description || '',
        }
      };
      
      db.prepare(`
        UPDATE blog_posts SET 
          translations = ?,
          parent_slug = ?
        WHERE id = ?
      `).run(JSON.stringify(translations), post.slug, post.id);
      
      migrated++;
    }
    
    console.log(`✅ Migrated ${migrated} posts`);
    console.log("🎉 Migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrate();
