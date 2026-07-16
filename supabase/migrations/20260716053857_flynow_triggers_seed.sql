/*
# FlyNow — Auto-profile trigger + seed data

## 1. handle_new_user trigger function
Automatically inserts a row into public.profiles whenever a new auth.users row is created.
Defaults role = 'user'. The frontend may update the role right after signup based on the
selected account type (user/company/admin), but the row itself is guaranteed to exist.

## 2. Seed data
- Categories (8)
- Demo notifications
- Sample coupons are inserted in the frontend seeding step after demo auth accounts are
  created, because coupons require a company_id owned by an authenticated company account.
*/

-- Trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (NEW.id, 'user', COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed categories
INSERT INTO public.categories (name, slug, color, icon) VALUES
  ('Food & Drink','food-drink','#F97316','UtensilsCrossed'),
  ('Fashion','fashion','#EC4899','Shirt'),
  ('Electronics','electronics','#3B82F6','Laptop'),
  ('Travel','travel','#14B8A6','Plane'),
  ('Health & Beauty','health-beauty','#10B981','Heart'),
  ('Home & Garden','home-garden','#84CC16','Home'),
  ('Sports','sports','#EF4444','Dumbbell'),
  ('Entertainment','entertainment','#8B5CF6','Ticket')
ON CONFLICT (slug) DO NOTHING;

-- Seed notifications
INSERT INTO public.notifications (type, title, message, target_role) VALUES
  ('system','Welcome to FlyNow','Platform initialized successfully.','admin'),
  ('company','New company registration','A new company registered and awaits approval.','admin'),
  ('coupon','New coupon submission','A company submitted a new coupon for review.','admin'),
  ('user','New user registered','A new user joined the platform.','admin')
ON CONFLICT DO NOTHING;
