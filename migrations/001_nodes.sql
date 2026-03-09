CREATE TABLE IF NOT EXISTS nodes (
  id TEXT PRIMARY KEY,
  node_type TEXT,
  status TEXT,

  public_slug TEXT UNIQUE,
  owner_token_hash TEXT,

  profile_name TEXT,
  profile_image_url TEXT,
  public_identifier TEXT,
  public_message TEXT,

  phone TEXT,
  email TEXT,
  whatsapp TEXT,

  last_recovery_lat REAL,
  last_recovery_lng REAL,
  last_recovery_label TEXT,

  show_profile_name INTEGER,
  show_profile_image INTEGER,
  show_identifier INTEGER,
  show_message INTEGER,
  show_phone INTEGER,
  show_email INTEGER,
  show_whatsapp INTEGER,
  show_last_recovery_point INTEGER,

  allow_anonymous_report INTEGER,

  created_at TEXT,
  updated_at TEXT
);
