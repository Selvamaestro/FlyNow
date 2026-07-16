/*
# FlyNow — Core Schema

## Overview
FlyNow is a digital flyer & coupon platform with three roles: User, Company, Admin.
Companies upload promotional flyers/coupons (status = Pending). Admins review and
approve/reject. Only Approved coupons are visible to users on the public website.

## Tables
1. `profiles` — extends auth.users with role (user|company|admin), display_name, avatar_url, status, created_at.
2. `companies` — company profile records linked to a profile (owner_id), name, logo_url, description, contact_email, phone, address, website, status (pending|approved|suspended), created_at.
3. `categories` — coupon categories: name, slug, color, icon, created_at.
4. `coupons` — the core entity: company_id, category_id, title, description, flyer_image_url, logo_url, discount, coupon_code, terms, expiry_date, status (pending|approved|rejected), views, created_at.
5. `saved_coupons` — users' saved/bookmarked coupons (user_id + coupon_id).
6. `notifications` — platform notifications: type, title, message, target_role, ref_id, read, created_at.

## Security (RLS)
- profiles: owner read/update; admins read all.
- companies: public read of approved; owners full access to own; admins full access.
- categories: public read; admin full access.
- coupons: public read of approved; company owners full access to own; admin full access.
- saved_coupons: owner-scoped CRUD.
- notifications: owner-scoped read + admin insert.

## Notes
- Owner columns default to auth.uid() so inserts omitting them still satisfy RLS.
- Coupons default status = 'pending' as required by workflow.
- Storage bucket `flyers` is created for flyer image uploads.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','company','admin')),
  display_name text NOT NULL DEFAULT '',
  avatar_url text DEFAULT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  logo_url text DEFAULT NULL,
  description text DEFAULT '',
  contact_email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  website text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','suspended')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "companies_select_public_approved" ON public.companies;
CREATE POLICY "companies_select_public_approved" ON public.companies FOR SELECT
  TO anon, authenticated USING (status = 'approved' OR auth.uid() = owner_id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "companies_insert_own" ON public.companies;
CREATE POLICY "companies_insert_own" ON public.companies FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "companies_update_own" ON public.companies;
CREATE POLICY "companies_update_own" ON public.companies FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (auth.uid() = owner_id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "companies_delete_own_or_admin" ON public.companies;
CREATE POLICY "companies_delete_own_or_admin" ON public.companies FOR DELETE
  TO authenticated USING (auth.uid() = owner_id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  color text NOT NULL DEFAULT '#F4B000',
  icon text NOT NULL DEFAULT 'Tag',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
CREATE POLICY "categories_insert_admin" ON public.categories FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
CREATE POLICY "categories_update_admin" ON public.categories FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;
CREATE POLICY "categories_delete_admin" ON public.categories FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  flyer_image_url text NOT NULL,
  logo_url text DEFAULT NULL,
  discount text NOT NULL DEFAULT '',
  coupon_code text NOT NULL DEFAULT '',
  terms text NOT NULL DEFAULT '',
  expiry_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coupons_select_approved_or_owner_or_admin" ON public.coupons;
CREATE POLICY "coupons_select_approved_or_owner_or_admin" ON public.coupons FOR SELECT
  TO anon, authenticated USING (
    status = 'approved'
    OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = coupons.company_id AND c.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "coupons_insert_company" ON public.coupons;
CREATE POLICY "coupons_insert_company" ON public.coupons FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.companies c WHERE c.id = coupons.company_id AND c.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "coupons_update_owner_or_admin" ON public.coupons;
CREATE POLICY "coupons_update_owner_or_admin" ON public.coupons FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.companies c WHERE c.id = coupons.company_id AND c.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.companies c WHERE c.id = coupons.company_id AND c.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "coupons_delete_owner_or_admin" ON public.coupons;
CREATE POLICY "coupons_delete_owner_or_admin" ON public.coupons FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.companies c WHERE c.id = coupons.company_id AND c.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- SAVED COUPONS
CREATE TABLE IF NOT EXISTS public.saved_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, coupon_id)
);
ALTER TABLE public.saved_coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_select_own" ON public.saved_coupons;
CREATE POLICY "saved_select_own" ON public.saved_coupons FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_insert_own" ON public.saved_coupons;
CREATE POLICY "saved_insert_own" ON public.saved_coupons FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_delete_own" ON public.saved_coupons;
CREATE POLICY "saved_delete_own" ON public.saved_coupons FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'system',
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  target_role text NOT NULL DEFAULT 'admin',
  ref_id uuid DEFAULT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_role" ON public.notifications;
CREATE POLICY "notifications_select_role" ON public.notifications FOR SELECT
  TO authenticated USING (
    target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    OR target_role = 'all'
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "notifications_insert_admin_or_company" ON public.notifications;
CREATE POLICY "notifications_insert_admin_or_company" ON public.notifications FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','company'))
  );

DROP POLICY IF EXISTS "notifications_update_admin" ON public.notifications;
CREATE POLICY "notifications_update_admin" ON public.notifications FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "notifications_delete_admin" ON public.notifications;
CREATE POLICY "notifications_delete_admin" ON public.notifications FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_coupons_status ON public.coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupons_company ON public.coupons(company_id);
CREATE INDEX IF NOT EXISTS idx_coupons_category ON public.coupons(category_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_saved_user ON public.saved_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_role ON public.notifications(target_role);

-- STORAGE BUCKET for flyer images
INSERT INTO storage.buckets (id, name, public) VALUES ('flyers','flyers', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "flyers_public_read" ON storage.objects;
CREATE POLICY "flyers_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'flyers');

DROP POLICY IF EXISTS "flyers_insert_auth" ON storage.objects;
CREATE POLICY "flyers_insert_auth" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'flyers');

DROP POLICY IF EXISTS "flyers_update_own" ON storage.objects;
CREATE POLICY "flyers_update_own" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'flyers' AND owner = auth.uid()) WITH CHECK (bucket_id = 'flyers' AND owner = auth.uid());

DROP POLICY IF EXISTS "flyers_delete_own" ON storage.objects;
CREATE POLICY "flyers_delete_own" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'flyers' AND owner = auth.uid());
