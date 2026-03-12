ALTER TABLE nodes ADD COLUMN owner_pin_hash TEXT;
ALTER TABLE nodes ADD COLUMN owner_pin_set_at TEXT;
ALTER TABLE nodes ADD COLUMN owner_failed_pin_attempts INTEGER DEFAULT 0;
ALTER TABLE nodes ADD COLUMN owner_lockout_until TEXT;
ALTER TABLE nodes ADD COLUMN owner_last_unlock_at TEXT;