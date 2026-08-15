-- Token usage tracking
CREATE TABLE IF NOT EXISTS token_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  card_type TEXT DEFAULT 'bday_card',
  expires_at TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Daily token limits tracking
CREATE TABLE IF NOT EXISTS daily_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  ip_address TEXT,
  date TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- User accounts (free signup)
CREATE TABLE IF NOT EXISTS users_free (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  name TEXT,
  password_hash TEXT,
  plan TEXT DEFAULT 'free',
  daily_token_limit INTEGER DEFAULT 5,
  token_expiry_hours INTEGER DEFAULT 24,
  email_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  plan TEXT NOT NULL,
  amount_usd REAL,
  amount_pkr REAL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  transaction_id TEXT,
  sender_name TEXT,
  sender_account TEXT,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  verified_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Payment methods configuration
CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method_name TEXT UNIQUE,
  account_number TEXT,
  account_title TEXT,
  instructions TEXT,
  is_active INTEGER DEFAULT 1,
  min_amount REAL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE,
  plan TEXT DEFAULT 'free',
  starts_at TEXT,
  expires_at TEXT,
  payment_id INTEGER REFERENCES payments(id),
  status TEXT DEFAULT 'active',
  auto_renew INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Admin logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id TEXT,
  action TEXT,
  details TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO payment_methods (method_name, account_number, account_title, instructions) VALUES
('jazzcash', '0300-XXXXXXX', 'Centers.pk', 'Send payment to this JazzCash number. Enter Transaction ID below.'),
('easypaisa', '0300-XXXXXXX', 'Centers.pk', 'Send payment to this EasyPaisa number. Enter Transaction ID below.'),
('bank_hbl', '1234567890', 'Centers.pk', 'Bank: HBL. Account: 1234567890. Branch: Lahore.'),
('bank_ubl', '0987654321', 'Centers.pk', 'Bank: UBL. Account: 0987654321. Branch: Karachi.'),
('stripe', 'auto', 'Centers.pk', 'Pay securely via Credit/Debit Card.');
