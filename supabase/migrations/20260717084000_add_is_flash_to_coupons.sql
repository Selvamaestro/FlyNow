-- Add is_flash column to coupons table
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_flash boolean DEFAULT false NOT NULL;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
