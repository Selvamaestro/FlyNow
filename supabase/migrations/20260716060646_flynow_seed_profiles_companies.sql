/*
# FlyNow — Set profile roles + create company records

## Overview
1. Update profile roles: admin@flynow.com → admin, company*@flynow.com → company,
   user@flynow.com stays user.
2. Create 10 company records in public.companies, all approved (except company8
   which stays pending to demonstrate the approval workflow).
3. Update display_name for company profiles to match their company names.

## Companies
1. TechNova Electronics      (company@flynow.com)    - approved
2. BloomHome Decor            (company1@flynow.com)   - approved
3. TinyTreasures Baby         (company2@flynow.com)   - approved
4. UrbanThread Fashion        (company3@flynow.com)   - approved
5. StepRight Footwear         (company4@flynow.com)   - approved
6. ChefMaster Cookware        (company5@flynow.com)   - approved
7. GlowPure Skincare          (company6@flynow.com)   - approved
8. FreshCart Grocery          (company7@flynow.com)   - approved
9. ProAthlete Sports          (company8@flynow.com)   - pending (workflow demo)
10. CozyLiving Furniture      (company8@flynow.com)   - approved
   (Note: company8 gets 2 companies to reach 10; we reuse company8 for the 10th.
   Actually, let's use company7 for 2 companies to keep it clean.)
*/

-- Set roles
UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@flynow.com');
UPDATE public.profiles SET role = 'company' WHERE id IN (SELECT id FROM auth.users WHERE email LIKE 'company%@flynow.com' OR email = 'company@flynow.com');
UPDATE public.profiles SET role = 'user' WHERE id = (SELECT id FROM auth.users WHERE email = 'user@flynow.com');

-- Set display names for company profiles
UPDATE public.profiles SET display_name = 'TechNova Electronics' WHERE id = (SELECT id FROM auth.users WHERE email = 'company@flynow.com');
UPDATE public.profiles SET display_name = 'BloomHome Decor' WHERE id = (SELECT id FROM auth.users WHERE email = 'company1@flynow.com');
UPDATE public.profiles SET display_name = 'TinyTreasures Baby' WHERE id = (SELECT id FROM auth.users WHERE email = 'company2@flynow.com');
UPDATE public.profiles SET display_name = 'UrbanThread Fashion' WHERE id = (SELECT id FROM auth.users WHERE email = 'company3@flynow.com');
UPDATE public.profiles SET display_name = 'StepRight Footwear' WHERE id = (SELECT id FROM auth.users WHERE email = 'company4@flynow.com');
UPDATE public.profiles SET display_name = 'ChefMaster Cookware' WHERE id = (SELECT id FROM auth.users WHERE email = 'company5@flynow.com');
UPDATE public.profiles SET display_name = 'GlowPure Skincare' WHERE id = (SELECT id FROM auth.users WHERE email = 'company6@flynow.com');
UPDATE public.profiles SET display_name = 'FreshCart Grocery' WHERE id = (SELECT id FROM auth.users WHERE email = 'company7@flynow.com');
UPDATE public.profiles SET display_name = 'ProAthlete Sports' WHERE id = (SELECT id FROM auth.users WHERE email = 'company8@flynow.com');

-- Create company records (idempotent: only insert if not already present)
INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'TechNova Electronics', 'Premium electronics and gadgets for modern living.', 'company@flynow.com', '+1-555-0101', '101 Tech Plaza, San Francisco, CA', 'https://technova.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'BloomHome Decor', 'Beautiful home products and decor to brighten your space.', 'company1@flynow.com', '+1-555-0102', '202 Garden Ave, Portland, OR', 'https://bloomhome.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company1@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'TinyTreasures Baby', 'Safe, adorable products for your little ones.', 'company2@flynow.com', '+1-555-0103', '303 Nursery Lane, Austin, TX', 'https://tinytreasures.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company2@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'UrbanThread Fashion', 'Trendy fashion for the modern urbanite.', 'company3@flynow.com', '+1-555-0104', '404 Style Street, New York, NY', 'https://urbanthread.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company3@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'StepRight Footwear', 'Comfortable, stylish footwear for every occasion.', 'company4@flynow.com', '+1-555-0105', '505 Shoe Boulevard, Chicago, IL', 'https://stepright.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company4@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'ChefMaster Cookware', 'Professional-grade cookware for home chefs.', 'company5@flynow.com', '+1-555-0106', '606 Kitchen Way, Seattle, WA', 'https://chefmaster.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company5@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'GlowPure Skincare', 'Natural, effective skincare for radiant skin.', 'company6@flynow.com', '+1-555-0107', '707 Glow Avenue, Miami, FL', 'https://glowpure.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company6@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'FreshCart Grocery', 'Fresh, organic groceries delivered to your door.', 'company7@flynow.com', '+1-555-0108', '808 Market Road, Denver, CO', 'https://freshcart.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company7@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

-- company8: pending (demonstrates the admin approval workflow)
INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'ProAthlete Sports', 'Premium sports gear and equipment for athletes.', 'company8@flynow.com', '+1-555-0109', '909 Stadium Drive, Boston, MA', 'https://proathlete.example.com', 'pending'
FROM auth.users u WHERE u.email = 'company8@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id);

-- 10th company: reuse company7 (FreshCart already has one, so create a second
-- company for company7 owner — actually, let's create a 10th using company8
-- with a different name. But one owner = one company is cleaner. Let's instead
-- make 9 companies (which is fine, the user asked for ~10). We have 9 companies.
-- To get exactly 10, we'll add one more under company7's owner.
INSERT INTO public.companies (owner_id, name, description, contact_email, phone, address, website, status)
SELECT u.id, 'CozyLiving Furniture', 'Handcrafted furniture for cozy, stylish homes.', 'company7@flynow.com', '+1-555-0110', '1010 Furniture Park, Denver, CO', 'https://cozyliving.example.com', 'approved'
FROM auth.users u WHERE u.email = 'company7@flynow.com'
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE owner_id = u.id AND name = 'CozyLiving Furniture');
