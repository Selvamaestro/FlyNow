/*
# FlyNow — Seed notifications and saved coupons

## Overview
1. Insert realistic notifications covering company registrations, coupon
   submissions, approvals, rejections, new users, and system alerts.
2. Create saved coupons for the regular user (user@flynow.com).
*/

DELETE FROM public.notifications WHERE type = 'system' AND message LIKE '%Platform%';

DO $$
DECLARE
  v_user uuid;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN
  SELECT id INTO v_user FROM auth.users WHERE email = 'user@flynow.com';

  INSERT INTO public.notifications (type, title, message, target_role, read) VALUES
    ('company_registration', 'New Company Registration', 'ProAthlete Sports has registered and awaits approval.', 'admin', false),
    ('company_registration', 'New Company Registration', 'CozyLiving Furniture has registered and awaits approval.', 'admin', true),
    ('coupon_submission', 'New Coupon Submission', 'TechNova Electronics submitted "Bluetooth Speaker Blowout" for review.', 'admin', false),
    ('coupon_submission', 'New Coupon Submission', 'UrbanThread Fashion submitted "Accessory Combo Pack" for review.', 'admin', false),
    ('coupon_submission', 'New Coupon Submission', 'FreshCart Grocery submitted "Artisan Coffee Pack" for review.', 'admin', true),
    ('coupon_submission', 'New Coupon Submission', 'CozyLiving Furniture submitted "Coffee Table Deal" for review.', 'admin', false),
    ('approval', 'Coupon Approved', 'Your coupon "Summer Dress Collection" has been approved and is now live.', 'company', true),
    ('approval', 'Coupon Approved', 'Your coupon "Wireless Earbuds Mega Sale" has been approved and is now live.', 'company', true),
    ('rejection', 'Coupon Rejected', 'Your coupon "Baby Skincare Bundle" was rejected. Please review the terms and resubmit.', 'company', false),
    ('rejection', 'Coupon Rejected', 'Your coupon "Face Mask Bundle" was rejected due to incomplete product information.', 'company', false),
    ('user_registration', 'New User Registered', 'Sarah Mitchell joined FlyNow as a new user.', 'admin', true),
    ('system', 'Platform Update', 'FlyNow v2.0 is now live with improved search and category filtering.', 'all', true),
    ('system', 'Maintenance Scheduled', 'Scheduled maintenance on Sunday 2-4 AM EST. Brief downtime expected.', 'all', false),
    ('company_approval', 'Company Approved', 'TechNova Electronics has been approved and can now upload flyers.', 'all', true);

  SELECT id INTO c1 FROM public.coupons WHERE title = 'Wireless Earbuds Mega Sale';
  SELECT id INTO c2 FROM public.coupons WHERE title = 'Summer Dress Collection';
  SELECT id INTO c3 FROM public.coupons WHERE title = 'Vitamin C Serum Deal';
  SELECT id INTO c4 FROM public.coupons WHERE title = 'Organic Produce Box';
  SELECT id INTO c5 FROM public.coupons WHERE title = 'Non-Stick Pan Set';

  INSERT INTO public.saved_coupons (user_id, coupon_id) VALUES
    (v_user, c1), (v_user, c2), (v_user, c3), (v_user, c4), (v_user, c5)
  ON CONFLICT (user_id, coupon_id) DO NOTHING;
END $$;
