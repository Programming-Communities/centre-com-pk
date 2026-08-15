import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'centers-local.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

console.log('🔧 Creating/Fixing OTP table...');

db.exec(`
  CREATE TABLE IF NOT EXISTS otp_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
  CREATE INDEX IF NOT EXISTS idx_otp_code ON otp_codes(code);
`);

console.log('✅ OTP table ready!');

// Show current OTPs for debugging
const otps = db.prepare("SELECT * FROM otp_codes WHERE used = 0 ORDER BY created_at DESC LIMIT 5").all();
console.log('📊 Recent OTPs:', otps.length > 0 ? otps : 'No pending OTPs');

db.close();
