-- KV Store table for CodeLearn AI edge functions
-- Used by supabase/functions/server/kv_store.ts

CREATE TABLE IF NOT EXISTS public.kv_store_aaa3a86f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant access to service role only (edge functions use service role key)
GRANT ALL ON public.kv_store_aaa3a86f TO service_role;
GRANT SELECT ON public.kv_store_aaa3a86f TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kv_store_aaa3a86f TO authenticated;
