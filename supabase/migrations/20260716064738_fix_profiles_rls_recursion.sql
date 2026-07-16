/*
# FlyNow — Fix recursive RLS on profiles

## Problem
The `profiles_select_own` policy contained a subquery against `profiles` itself:
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
This causes infinite recursion (PostgreSQL error 42P17) because evaluating the
policy on `profiles` requires reading `profiles`, which triggers the policy again.

## Fix
Drop all existing profiles policies and recreate them with simple, non-recursive
logic based solely on `auth.uid() = id`:

- SELECT: auth.uid() = id  (users read only their own profile)
- INSERT: auth.uid() = id  (users insert only their own profile)
- UPDATE: auth.uid() = id  (users update only their own profile)
- DELETE: auth.uid() = id  (users delete only their own profile)

Admin access to all profiles is handled in application code via the service role
client (server-side), not through RLS.

## Verification
- No policy on `profiles` references `profiles` in a subquery.
- Other tables (companies, coupons, categories, notifications, saved_coupons)
  reference `profiles` or `companies` in subqueries, but never themselves —
  no recursion risk.
*/

-- Drop all existing profiles policies
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

-- Recreate with simple non-recursive policies
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_delete_own ON public.profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = id);
