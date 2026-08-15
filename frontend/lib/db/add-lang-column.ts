import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'centers-local.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

console.log('🔧 Adding preferred_lang column...');

try {
  db.exec('ALTER TABLE users ADD COLUMN preferred_lang TEXT DEFAULT "en"');
  console.log('✅ preferred_lang column added');
} catch (e: any) {
  if (e.message.includes('duplicate column')) {
    console.log('⏭️ Column already exists');
  } else {
    console.log('⚠️', e.message);
  }
}

// Update existing users with default language
db.prepare("UPDATE users SET preferred_lang = 'en' WHERE preferred_lang IS NULL").run();
console.log('✅ Existing users updated with default language');

db.close();
