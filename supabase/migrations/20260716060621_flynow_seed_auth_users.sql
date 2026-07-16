/*
# FlyNow — Seed auth users (admin, company, user)

## Overview
Creates auth.users rows for the default admin, primary company, 8 additional
companies, and 1 regular user. Uses conditional inserts (WHERE NOT EXISTS)
because auth.users has no unique constraint on email.

## Accounts
- admin@flynow.com / admin123  (role: admin)
- company@flynow.com / company123 (role: company)
- company1..8@flynow.com / company123 (role: company)
- user@flynow.com / user123 (role: user)

## Notes
- Passwords bcrypt-hashed via pgcrypto crypt() + gen_salt('bf').
- The handle_new_user trigger auto-inserts a profile row on INSERT.
- We upsert profiles separately in the next migration to set correct roles.
*/

DO $$
DECLARE
  i int;
BEGIN
  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@flynow.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_confirm_status)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'admin@flynow.com', crypt('admin123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"FlyNow Admin","role":"admin"}'::jsonb, '', '', '', '', 0);
  END IF;

  -- Primary company
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'company@flynow.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_confirm_status)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'company@flynow.com', crypt('company123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"TechNova Electronics","role":"company"}'::jsonb, '', '', '', '', 0);
  END IF;

  -- 8 additional companies
  FOR i IN 1..8 LOOP
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'company' || i || '@flynow.com') THEN
      INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_confirm_status)
      VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'company' || i || '@flynow.com', crypt('company123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('display_name', 'Company ' || i, 'role', 'company'), '', '', '', '', 0);
    END IF;
  END LOOP;

  -- Regular user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@flynow.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_confirm_status)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'user@flynow.com', crypt('user123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Sarah Mitchell","role":"user"}'::jsonb, '', '', '', '', 0);
  END IF;
END $$;
