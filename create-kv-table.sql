-- ============================================
-- CodeLearn AI - KV Store Table
-- This is required for the Edge Function backend
-- ============================================

CREATE TABLE IF NOT EXISTS kv_store_aaa3a86f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_aaa3a86f(key);
CREATE INDEX IF NOT EXISTS idx_kv_store_prefix ON kv_store_aaa3a86f(key text_pattern_ops);

-- Trigger to update timestamp
CREATE OR REPLACE FUNCTION update_kv_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_aaa3a86f
  FOR EACH ROW EXECUTE FUNCTION update_kv_updated_at();

-- Comment
COMMENT ON TABLE kv_store_aaa3a86f IS 'CodeLearn AI - Key-value store for application data';
