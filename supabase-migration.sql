-- Run this in the Supabase dashboard: SQL Editor → New query

-- 1. Add user_id column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id UUID;

-- 2. Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips (user_id);

-- 3. Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- 4. Policy: users can only access their own rows
--    The service_role key (used by the backend) bypasses RLS entirely.
--    These policies apply to any direct client-side access using the anon key.
CREATE POLICY "users_own_trips" ON trips
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
