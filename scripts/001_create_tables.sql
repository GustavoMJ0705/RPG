-- Enable Realtime for our tables
-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  coins INTEGER NOT NULL DEFAULT 0,
  strength INTEGER NOT NULL DEFAULT 10,
  physique INTEGER NOT NULL DEFAULT 10,
  agility INTEGER NOT NULL DEFAULT 10,
  magic_power INTEGER NOT NULL DEFAULT 10,
  inventory TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create scenario_logs table
CREATE TABLE IF NOT EXISTS public.scenario_logs (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'constellation', 'scenario')),
  target TEXT NOT NULL DEFAULT 'all',
  timestamp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow public read/write (no auth needed - this is a GM tool for a tabletop RPG)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_logs ENABLE ROW LEVEL SECURITY;

-- Permissive policies for both tables (no auth, open access for the RPG session)
CREATE POLICY "Allow all read players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow all insert players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Allow all delete players" ON public.players FOR DELETE USING (true);

CREATE POLICY "Allow all read logs" ON public.scenario_logs FOR SELECT USING (true);
CREATE POLICY "Allow all insert logs" ON public.scenario_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update logs" ON public.scenario_logs FOR UPDATE USING (true);
CREATE POLICY "Allow all delete logs" ON public.scenario_logs FOR DELETE USING (true);

-- Enable Realtime publication for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scenario_logs;
