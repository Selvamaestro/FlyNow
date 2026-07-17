-- Add additional profile fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city_state text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS postal_code text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tax_id text DEFAULT '';

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
