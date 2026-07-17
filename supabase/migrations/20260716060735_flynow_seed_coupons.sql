/*
# FlyNow — Seed 30+ coupons across companies and categories

## Overview
Inserts 33 coupons distributed across the 10 companies and 10 categories.
Status mix: 22 approved, 7 pending, 4 rejected.
All coupons belong to companies (never admin).
Flyer images use Pexels stock photos matching each category.

## Distribution
- TechNova Electronics (Electronics): 4 coupons
- BloomHome Decor (Home Products): 3 coupons
- TinyTreasures Baby (Baby Products): 3 coupons
- UrbanThread Fashion (Fashion): 4 coupons
- StepRight Footwear (Footwear): 3 coupons
- ChefMaster Cookware (Cookware): 3 coupons
- GlowPure Skincare (Skincare): 3 coupons
- FreshCart Grocery (Grocery): 4 coupons
- ProAthlete Sports (Sports): 3 coupons (pending — company is pending)
- CozyLiving Furniture (Furniture): 3 coupons
*/

DO $$
DECLARE
  technova uuid; bloomhome uuid; tinytreasures uuid; urbanthread uuid;
  stepright uuid; chefmaster uuid; glowpure uuid; freshcart uuid;
  proathlete uuid; cozyliving uuid;
  cat_home uuid; cat_elec uuid; cat_baby uuid; cat_fashion uuid; cat_footwear uuid;
  cat_cookware uuid; cat_skincare uuid; cat_grocery uuid; cat_sports uuid; cat_furniture uuid;
BEGIN
  SELECT id INTO technova FROM public.companies WHERE name = 'TechNova Electronics';
  SELECT id INTO bloomhome FROM public.companies WHERE name = 'BloomHome Decor';
  SELECT id INTO tinytreasures FROM public.companies WHERE name = 'TinyTreasures Baby';
  SELECT id INTO urbanthread FROM public.companies WHERE name = 'UrbanThread Fashion';
  SELECT id INTO stepright FROM public.companies WHERE name = 'StepRight Footwear';
  SELECT id INTO chefmaster FROM public.companies WHERE name = 'ChefMaster Cookware';
  SELECT id INTO glowpure FROM public.companies WHERE name = 'GlowPure Skincare';
  SELECT id INTO freshcart FROM public.companies WHERE name = 'FreshCart Grocery';
  SELECT id INTO proathlete FROM public.companies WHERE name = 'ProAthlete Sports';
  SELECT id INTO cozyliving FROM public.companies WHERE name = 'CozyLiving Furniture';

  SELECT id INTO cat_home FROM public.categories WHERE slug = 'home-products';
  SELECT id INTO cat_elec FROM public.categories WHERE slug = 'electronics';
  SELECT id INTO cat_baby FROM public.categories WHERE slug = 'baby-products';
  SELECT id INTO cat_fashion FROM public.categories WHERE slug = 'fashion';
  SELECT id INTO cat_footwear FROM public.categories WHERE slug = 'footwear';
  SELECT id INTO cat_cookware FROM public.categories WHERE slug = 'cookware';
  SELECT id INTO cat_skincare FROM public.categories WHERE slug = 'skincare';
  SELECT id INTO cat_grocery FROM public.categories WHERE slug = 'grocery';
  SELECT id INTO cat_sports FROM public.categories WHERE slug = 'sports';
  SELECT id INTO cat_furniture FROM public.categories WHERE slug = 'furniture';

  -- TechNova Electronics (Electronics) — 4 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (technova, cat_elec, 'Wireless Earbuds Mega Sale', 'Get premium wireless earbuds at an unbeatable price. Noise cancelling, 30hr battery life.', 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600', '40% OFF', 'TECH40', 'Valid on orders over $49. One per customer. Cannot be combined with other offers.', (CURRENT_DATE + 14)::date, 'approved', 342),
    (technova, cat_elec, 'Smart Watch Flash Deal', 'Track your fitness, heart rate, and sleep with our latest smart watch model.', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600', '35% OFF', 'SMART35', 'Valid while supplies last. Limit 2 per customer.', (CURRENT_DATE + 21)::date, 'approved', 287),
    (technova, cat_elec, 'Laptop Accessory Bundle', 'Save big on laptop stands, USB-C hubs, and protective cases.', 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=600', '25% OFF', 'LAPTOP25', 'Bundle includes 3 items. Offer valid online only.', (CURRENT_DATE + 30)::date, 'approved', 198),
    (technova, cat_elec, 'Bluetooth Speaker Blowout', 'Portable waterproof Bluetooth speaker with 360-degree sound.', 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=600', '50% OFF', 'SPEAKER50', 'While supplies last. Excludes clearance items.', (CURRENT_DATE + 7)::date, 'pending', 0);

  -- BloomHome Decor (Home Products) — 3 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (bloomhome, cat_home, 'Decorative Throw Pillows', 'Refresh your living room with our premium decorative throw pillow collection.', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600', 'Buy 2 Get 1 Free', 'BLOOM3', 'Free item must be of equal or lesser value. Valid in-store and online.', (CURRENT_DATE + 18)::date, 'approved', 156),
    (bloomhome, cat_home, 'Scented Candle Set', 'Hand-poured soy candles in 6 signature fragrances. Perfect for cozy evenings.', 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=600', '30% OFF', 'CANDLE30', 'Set of 6 candles. Offer valid for first-time customers.', (CURRENT_DATE + 25)::date, 'approved', 112),
    (bloomhome, cat_home, 'Wall Art Collection', 'Canvas prints and framed art to transform any wall in your home.', 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600', '20% OFF', 'WALLART20', 'Excludes custom orders. Discount applied at checkout.', (CURRENT_DATE + 40)::date, 'pending', 0);

  -- TinyTreasures Baby (Baby Products) — 3 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (tinytreasures, cat_baby, 'Organic Baby Onesie Pack', 'Soft, organic cotton onesies in adorable prints. Pack of 3.', 'https://images.pexels.com/photos/2612601/pexels-photo-2612601.jpeg?auto=compress&cs=tinysrgb&w=600', '35% OFF', 'BABY35', 'Sizes 0-12 months. While supplies last.', (CURRENT_DATE + 20)::date, 'approved', 234),
    (tinytreasures, cat_baby, 'Diaper Bag Backpack', 'Spacious, waterproof diaper bag with 14 pockets and changing pad.', 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600', '40% OFF', 'DIAPER40', 'One per customer. Offer valid online only.', (CURRENT_DATE + 12)::date, 'approved', 189),
    (tinytreasures, cat_baby, 'Baby Skincare Bundle', 'Gentle, tear-free bath and lotion set for sensitive baby skin.', 'https://images.pexels.com/photos/3933250/pexels-photo-3933250.jpeg?auto=compress&cs=tinysrgb&w=600', '25% OFF', 'BABYCARE25', 'Dermatologist tested. Fragrance-free formula.', (CURRENT_DATE + 35)::date, 'rejected', 0);

  -- UrbanThread Fashion (Fashion) — 4 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (urbanthread, cat_fashion, 'Summer Dress Collection', 'Flowy, breathable summer dresses in 12 vibrant patterns and colors.', 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600', '50% OFF', 'SUMMER50', 'Valid on select styles. Cannot be combined with other promotions.', (CURRENT_DATE + 10)::date, 'approved', 421),
    (urbanthread, cat_fashion, 'Denim Jacket Sale', 'Classic denim jackets in 4 washes. Perfect layering for any season.', 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=600', '30% OFF', 'DENIM30', 'Excludes premium collection. Limit 1 per customer.', (CURRENT_DATE + 22)::date, 'approved', 312),
    (urbanthread, cat_fashion, 'Winter Coat Clearance', 'Premium wool and down coats at clearance prices before the season ends.', 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=600', '60% OFF', 'COAT60', 'Final sale. No returns or exchanges on clearance items.', (CURRENT_DATE + 5)::date, 'approved', 567),
    (urbanthread, cat_fashion, 'Accessory Combo Pack', 'Scarves, gloves, and hats bundled together for the perfect winter set.', 'https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=600', 'Buy 1 Get 1', 'COMBO11', 'Lower-priced item is free. Valid on regular-priced items only.', (CURRENT_DATE + 28)::date, 'pending', 0);

  -- StepRight Footwear (Footwear) — 3 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (stepright, cat_footwear, 'Running Shoes Mega Deal', 'Lightweight performance running shoes with breathable mesh upper.', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600', '40% OFF', 'RUN40', 'Valid on select models. Sizes subject to availability.', (CURRENT_DATE + 15)::date, 'approved', 389),
    (stepright, cat_footwear, 'Casual Sneakers Sale', 'Versatile everyday sneakers in 8 color options for any outfit.', 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=600', '25% OFF', 'SNEAK25', 'Excludes limited edition releases.', (CURRENT_DATE + 33)::date, 'approved', 245),
    (stepright, cat_footwear, 'Boots Buy 2 Get 1', 'Premium leather and suede boots for fall and winter.', 'https://images.pexels.com/photos/7432/boots.jpg?auto=compress&cs=tinysrgb&w=600', 'Buy 2 Get 1 Free', 'BOOTS3', 'Free item must be of equal or lesser value.', (CURRENT_DATE + 45)::date, 'pending', 0);

  -- ChefMaster Cookware (Cookware) — 3 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (chefmaster, cat_cookware, 'Non-Stick Pan Set', '10-piece non-stick cookware set with even heat distribution.', 'https://images.pexels.com/photos/4252136/pexels-photo-4252136.jpeg?auto=compress&cs=tinysrgb&w=600', '45% OFF', 'CHEF45', 'Set includes pots, pans, and utensils. Dishwasher safe.', (CURRENT_DATE + 16)::date, 'approved', 278),
    (chefmaster, cat_cookware, 'Knife Block Set', 'Professional 14-piece knife set with wooden storage block.', 'https://images.pexels.com/photos/2098605/pexels-photo-2098605.jpeg?auto=compress&cs=tinysrgb&w=600', '35% OFF', 'KNIFE35', 'High-carbon stainless steel blades. Lifetime warranty.', (CURRENT_DATE + 24)::date, 'approved', 167),
    (chefmaster, cat_cookware, 'Silicone Baking Kit', 'Complete silicone baking set: molds, mats, and spatulas.', 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=600', '30% OFF', 'BAKE30', 'BPA-free, oven safe up to 450F. One per customer.', (CURRENT_DATE + 38)::date, 'pending', 0);

  -- GlowPure Skincare (Skincare) — 3 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (glowpure, cat_skincare, 'Vitamin C Serum Deal', 'Brightening vitamin C serum with hyaluronic acid for radiant skin.', 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=600', '40% OFF', 'GLOW40', 'For all skin types. Use morning and evening for best results.', (CURRENT_DATE + 19)::date, 'approved', 456),
    (glowpure, cat_skincare, 'Moisturizer Duo Pack', 'Day and night moisturizer duo for complete 24-hour hydration.', 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=600', 'Buy 1 Get 1', 'GLOW11', 'Free item is the night moisturizer. Cannot be combined with other offers.', (CURRENT_DATE + 26)::date, 'approved', 321),
    (glowpure, cat_skincare, 'Face Mask Bundle', 'Set of 5 sheet masks: hydrating, soothing, and anti-aging varieties.', 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=600', '35% OFF', 'MASK35', 'Use 2-3 times per week. Suitable for sensitive skin.', (CURRENT_DATE + 42)::date, 'rejected', 0);

  -- FreshCart Grocery (Grocery) — 4 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (freshcart, cat_grocery, 'Organic Produce Box', 'Weekly box of seasonal organic fruits and vegetables delivered fresh.', 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=600', '30% OFF First Box', 'FRESH30', 'New subscribers only. Cancel anytime. Delivery within 25 miles.', (CURRENT_DATE + 11)::date, 'approved', 392),
    (freshcart, cat_grocery, 'Pantry Essentials Bundle', 'Stock up on pasta, rice, sauces, and spices with our pantry bundle.', 'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=600', '25% OFF', 'PANTRY25', 'Bundle includes 12 items. Offer valid online only.', (CURRENT_DATE + 29)::date, 'approved', 203),
    (freshcart, cat_grocery, 'Free Range Eggs Dozen', 'Farm-fresh free-range organic eggs. Limit 2 dozen per customer.', 'https://images.pexels.com/photos/162712/egg-white-food-protein-chicken-162712.jpeg?auto=compress&cs=tinysrgb&w=600', '20% OFF', 'EGGS20', 'Refrigerated delivery. Best within 3 weeks of purchase.', (CURRENT_DATE + 8)::date, 'approved', 178),
    (freshcart, cat_grocery, 'Artisan Coffee Pack', 'Locally roasted whole bean coffee in 3 blends: light, medium, dark.', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600', 'Buy 2 Get 1 Free', 'COFFEE3', '12oz bags. Ground option available at checkout.', (CURRENT_DATE + 36)::date, 'pending', 0);

  -- ProAthlete Sports (Sports) — 3 coupons (company is pending, so coupons pending too)
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (proathlete, cat_sports, 'Yoga Mat Premium', 'Eco-friendly non-slip yoga mat with carrying strap. 6mm thick.', 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600', '35% OFF', 'YOGA35', 'Available in 5 colors. One per customer.', (CURRENT_DATE + 23)::date, 'pending', 0),
    (proathlete, cat_sports, 'Resistance Band Set', 'Complete 5-band resistance set with door anchor and carry bag.', 'https://images.pexels.com/photos/4761351/pexels-photo-4761351.jpeg?auto=compress&cs=tinysrgb&w=600', '40% OFF', 'BAND40', 'Light to extra-heavy resistance levels included.', (CURRENT_DATE + 31)::date, 'pending', 0),
    (proathlete, cat_sports, 'Water Bottle 2-Pack', 'Insulated stainless steel water bottles. Keeps cold for 24 hours.', 'https://images.pexels.com/photos/327022/unsplash-photo-327022.jpeg?auto=compress&cs=tinysrgb&w=600', '25% OFF', 'HYDRATE25', 'Set of 2 bottles, 25oz each. BPA-free.', (CURRENT_DATE + 44)::date, 'pending', 0);

  -- CozyLiving Furniture (Furniture) — 3 coupons
  INSERT INTO public.coupons (company_id, category_id, title, description, flyer_image_url, discount, coupon_code, terms, expiry_date, status, views)
  VALUES
    (cozyliving, cat_furniture, 'Accent Chair Sale', 'Modern velvet accent chair in 4 colors. Solid wood legs.', 'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=600', '30% OFF', 'CHAIR30', 'Assembly required. Free shipping on orders over $199.', (CURRENT_DATE + 17)::date, 'approved', 234),
    (cozyliving, cat_furniture, 'Bookshelf Bundle', '5-tier industrial bookshelf with metal frame and wood shelves.', 'https://images.pexels.com/photos/2613252/pexels-photo-2613252.jpeg?auto=compress&cs=tinysrgb&w=600', '25% OFF', 'SHELF25', 'Available in 3 finishes. Wall anchor included.', (CURRENT_DATE + 27)::date, 'approved', 145),
    (cozyliving, cat_furniture, 'Coffee Table Deal', 'Round marble-top coffee table with gold-finish base.', 'https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg?auto=compress&cs=tinysrgb&w=600', '40% OFF', 'TABLE40', 'Tempered glass alternative available. In-store pickup option.', (CURRENT_DATE + 39)::date, 'pending', 0);
END $$;
