-- Add item_type column to shop_items
ALTER TABLE public.shop_items
  ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'diversos';
