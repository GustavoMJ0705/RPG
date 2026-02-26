-- Create shop_items table
CREATE TABLE IF NOT EXISTS public.shop_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  rarity TEXT NOT NULL DEFAULT 'comum',
  price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT -1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

-- Permissive policies (same pattern as other tables)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_items' AND policyname = 'Allow all read shop_items') THEN
    CREATE POLICY "Allow all read shop_items" ON public.shop_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_items' AND policyname = 'Allow all insert shop_items') THEN
    CREATE POLICY "Allow all insert shop_items" ON public.shop_items FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_items' AND policyname = 'Allow all update shop_items') THEN
    CREATE POLICY "Allow all update shop_items" ON public.shop_items FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_items' AND policyname = 'Allow all delete shop_items') THEN
    CREATE POLICY "Allow all delete shop_items" ON public.shop_items FOR DELETE USING (true);
  END IF;
END $$;

-- Enable Realtime (ignore error if already added)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_items;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
