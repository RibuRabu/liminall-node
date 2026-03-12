CREATE TABLE IF NOT EXISTS node_events (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_ref TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (node_id) REFERENCES nodes(id)
);

CREATE INDEX IF NOT EXISTS idx_node_events_node_id
ON node_events(node_id);

CREATE INDEX IF NOT EXISTS idx_node_events_created_at
ON node_events(created_at);

CREATE INDEX IF NOT EXISTS idx_node_events_node_id_created_at
ON node_events(node_id, created_at);