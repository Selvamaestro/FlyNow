/*
# FlyNow — Replace categories with custom Candy Pop theme

## Overview
Replace the 8 generic categories with 10 custom FlyNow categories using the exact
Candy Pop theme colors specified by the user. Categories are referenced by coupons
via category_id (FK with ON DELETE SET NULL), so existing coupons will have their
category_id set to NULL when old categories are deleted.

## Changes
- Delete all existing categories.
- Insert 10 new categories with exact names, slugs, colors, and icons.
- Categories are public-read (RLS already enabled).

## New Categories
1. Home Products   (#FF5D8F)  icon: Home
2. Electronics     (#3B82F6)  icon: Laptop
3. Baby Products   (#FF8FAB)  icon: Baby
4. Fashion         (#6ECBF5)  icon: Shirt
5. Footwear        (#5B5FEF)  icon: Footprints
6. Cookware        (#FF8C42)  icon: CookingPot
7. Skincare        (#F4A896)  icon: Sparkles
8. Grocery         (#6CCB3C)  icon: ShoppingCart
9. Sports          (#22C7D6)  icon: Dumbbell
10. Furniture      (#B07A4F)  icon: Sofa
*/

DELETE FROM public.categories;

INSERT INTO public.categories (name, slug, color, icon) VALUES
  ('Home Products','home-products','#FF5D8F','Home'),
  ('Electronics','electronics','#3B82F6','Laptop'),
  ('Baby Products','baby-products','#FF8FAB','Baby'),
  ('Fashion','fashion','#6ECBF5','Shirt'),
  ('Footwear','footwear','#5B5FEF','Footprints'),
  ('Cookware','cookware','#FF8C42','CookingPot'),
  ('Skincare','skincare','#F4A896','Sparkles'),
  ('Grocery','grocery','#6CCB3C','ShoppingCart'),
  ('Sports','sports','#22C7D6','Dumbbell'),
  ('Furniture','furniture','#B07A4F','Sofa');
