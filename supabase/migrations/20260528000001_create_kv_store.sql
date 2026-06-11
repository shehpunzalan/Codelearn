-- KV Store table for CodeLearn AI edge functions
-- Used by supabase/functions/server/kv_store.ts

CREATE TABLE IF NOT EXISTS public.kv_store_aaa3a86f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Grant access to authenticated and service roles
GRANT ALL ON public.kv_store_aaa3a86f TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kv_store_aaa3a86f TO authenticated;

COMMENT ON TABLE public.kv_store_aaa3a86f IS 'Key-value store for CodeLearn AI edge functions (user position, progress, quiz results)';
