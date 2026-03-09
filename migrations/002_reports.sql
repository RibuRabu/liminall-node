CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  node_id TEXT,
  message TEXT,
  lat REAL,
  lng REAL,
  image_url TEXT,
  created_at TEXT
);
