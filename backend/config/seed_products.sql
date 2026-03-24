-- Seed products for clothing, electronics, and groceries.
-- Safe for repeated runs, each row checks existence by (name, department).

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Classic Linen Shirt', 49.00, 69.00, 4.80, 128, 'Black',
'https://images.unsplash.com/photo-1593032465171-8bd6322a0d4d?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1593032465171-8bd6322a0d4d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
),
'Step into a refined everyday style with this classic linen shirt.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Classic Linen Shirt' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Urban Fit Blazer', 119.00, 149.00, 4.60, 94, 'Charcoal',
'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'
),
'A tailored blazer with modern proportions and polished finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Urban Fit Blazer' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Essential Black Dress', 89.00, 120.00, 4.70, 212, 'Black',
'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80'
),
'A minimal black dress designed for versatility and confidence.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Essential Black Dress' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Noise Cancelling Headphones X5', 159.00, 199.00, 4.80, 421, 'Matte Black',
'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'
),
'Premium over-ear headphones with adaptive noise cancellation.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Noise Cancelling Headphones X5' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Smart Watch Active Pro', 189.00, 229.00, 4.60, 308, 'Space Gray',
'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80'
),
'Track health metrics and workouts with an AMOLED display.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Watch Active Pro' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Wireless Gaming Mouse', 79.00, 109.00, 4.40, 249, 'Black',
'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80'
),
'Lightweight wireless mouse with high precision sensor.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Gaming Mouse' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Organic Banana Bundle', 4.00, 5.00, 4.70, 92, 'Fresh Yellow',
'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=900&q=80'
),
'Naturally ripened organic bananas for healthy snacking.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Organic Banana Bundle' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Farm Fresh Eggs (12 Pack)', 6.00, 7.00, 4.80, 188, 'Natural',
'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=900&q=80'
),
'Grade-A farm eggs sourced from trusted local farms.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Farm Fresh Eggs (12 Pack)' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Whole Grain Bread Loaf', 3.00, 4.00, 4.40, 67, 'Golden Brown',
'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80'
),
'Freshly baked whole grain bread with soft texture.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Whole Grain Bread Loaf' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Cozy Knit Sweater', 69.00, 95.00, 4.40, 77, 'Stone',
'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1593032465171-8bd6322a0d4d?auto=format&fit=crop&w=900&q=80'
),
'Soft-touch knitwear with premium warmth and clean texture.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cozy Knit Sweater' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Tailored Wide Pants', 74.00, 99.00, 4.30, 56, 'Grey',
'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1593032465171-8bd6322a0d4d?auto=format&fit=crop&w=900&q=80'
),
'Wide-leg tailored pants with a clean front and flowing shape.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tailored Wide Pants' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Minimal White Sneakers', 95.00, 119.00, 4.90, 309, 'White',
'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80'
),
'Clean, low-profile sneakers made for everyday use.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Minimal White Sneakers' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Ultra HD Webcam 4K', 99.00, 129.00, 4.70, 217, 'Graphite',
'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=900&q=80'
),
'Crystal-clear 4K streaming webcam with autofocus and low-light correction.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ultra HD Webcam 4K' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Mechanical Keyboard RGB', 129.00, 159.00, 4.50, 176, 'White',
'https://images.unsplash.com/photo-1595044426077-d36d9236d544?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1595044426077-d36d9236d544?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80'
),
'Tactile mechanical keys with hot-swappable switches and customizable RGB.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mechanical Keyboard RGB' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Extra Virgin Olive Oil', 14.00, 18.00, 4.90, 144, 'Emerald Gold',
'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80'
),
'Cold-pressed extra virgin olive oil with smooth finish and rich flavor.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Extra Virgin Olive Oil' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Chicken Breast Fillet', 11.00, 13.00, 4.60, 103, 'Fresh Cut',
'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&w=900&q=80'
),
'Lean, tender chicken breast portions prepared for everyday meals.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Breast Fillet' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Non-Stick Cookware Set', 89.00, 119.00, 4.70, 156, 'Midnight Black',
'https://images.unsplash.com/photo-1584990347449-a17f0ce0ea0f?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1584990347449-a17f0ce0ea0f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80'
),
'Durable non-stick cookware set built for even heating and easy cleanup.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Non-Stick Cookware Set' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Air Fryer Digital 6L', 129.00, 169.00, 4.80, 231, 'Matte Silver',
'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1616594039964-3d6fbeef7da8?auto=format&fit=crop&w=900&q=80'
),
'Smart air fryer with presets for crisp cooking using less oil.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Air Fryer Digital 6L' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Bamboo Cutting Board Set', 32.00, 45.00, 4.60, 98, 'Natural Bamboo',
'https://images.unsplash.com/photo-1570112006642-fc4f8d4f8159?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1570112006642-fc4f8d4f8159?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506368083636-6defb67639a7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?auto=format&fit=crop&w=900&q=80'
),
'Set of three bamboo boards sized for prep, serving, and carving.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bamboo Cutting Board Set' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Relaxed Cotton Tee', 29.00, 39.00, 4.50, 131, 'Navy',
'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80'
),
'Everyday cotton t-shirt with breathable fabric and relaxed silhouette.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Relaxed Cotton Tee' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Slim Fit Chinos', 59.00, 79.00, 4.40, 88, 'Khaki',
'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80'
),
'Smart-casual chino pants with stretch comfort and tapered finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Slim Fit Chinos' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'Lightweight Bomber Jacket', 109.00, 139.00, 4.70, 142, 'Olive',
'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80'
),
'Modern bomber jacket with light insulation and wind-resistant shell.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lightweight Bomber Jacket' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'clothing', 'High Rise Denim Jeans', 72.00, 96.00, 4.60, 167, 'Indigo',
'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80'
),
'Structured high-rise denim jeans designed for daily wear and comfort.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'High Rise Denim Jeans' AND department = 'clothing');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Bluetooth Soundbar S20', 149.00, 189.00, 4.50, 139, 'Graphite',
'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80'
),
'Cinematic soundbar with wireless connectivity and rich bass profile.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bluetooth Soundbar S20' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Portable Power Bank 20000mAh', 49.00, 69.00, 4.60, 274, 'Black',
'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80'
),
'High-capacity fast-charging power bank with dual USB output.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Portable Power Bank 20000mAh' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'Smart Home Security Camera', 89.00, 119.00, 4.40, 182, 'White',
'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80'
),
'Indoor security camera with night vision, app alerts, and cloud backup.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Home Security Camera' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', 'True Wireless Earbuds A9', 69.00, 89.00, 4.50, 335, 'Pearl White',
'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80'
),
'Compact earbuds with clear calls, punchy sound, and all-day battery.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'True Wireless Earbuds A9' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'electronics', '27-inch QHD Monitor', 249.00, 299.00, 4.70, 121, 'Matte Black',
'https://images.unsplash.com/photo-1527443224154-c4f0617f5a5c?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1527443224154-c4f0617f5a5c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'
),
'Crisp QHD monitor with IPS panel and low-blue-light productivity mode.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '27-inch QHD Monitor' AND department = 'electronics');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Greek Yogurt 4 Pack', 8.00, 10.00, 4.60, 112, 'Natural',
'https://images.unsplash.com/photo-1571212515416-2d0b2fc4362d?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1571212515416-2d0b2fc4362d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?auto=format&fit=crop&w=900&q=80'
),
'Protein-rich greek yogurt cups for breakfast and healthy snacks.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Greek Yogurt 4 Pack' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Brown Rice 5kg', 19.00, 23.00, 4.70, 97, 'Natural Grain',
'https://images.unsplash.com/photo-1586201375761-83865001e17f?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1586201375761-83865001e17f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1586201375754-29f8d2f6d839?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80'
),
'Premium long-grain brown rice for nutritious everyday meals.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Brown Rice 5kg' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Roasted Coffee Beans 1kg', 16.00, 21.00, 4.80, 204, 'Dark Roast',
'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521302080373-cb53f54ca8ef?auto=format&fit=crop&w=900&q=80'
),
'Freshly roasted coffee beans with rich aroma and balanced flavor.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Roasted Coffee Beans 1kg' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Mixed Nuts Premium 500g', 12.00, 15.00, 4.60, 145, 'Assorted',
'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1615486363976-928fe0f26d8e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=900&q=80'
),
'Blend of almonds, cashews, and walnuts for healthy snacking.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mixed Nuts Premium 500g' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'groceries', 'Atlantic Salmon Fillet', 15.00, 19.00, 4.50, 84, 'Fresh Pink',
'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=80'
),
'Fresh salmon portions ideal for grilling, baking, or meal prep.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Atlantic Salmon Fillet' AND department = 'groceries');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Stainless Steel Kettle', 44.00, 58.00, 4.60, 118, 'Silver',
'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
),
'Fast-boil stainless kettle with temperature-safe handle design.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Stainless Steel Kettle' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Vacuum Cleaner Compact', 139.00, 179.00, 4.50, 96, 'Slate Gray',
'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80'
),
'Compact vacuum cleaner with powerful suction and quiet performance.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vacuum Cleaner Compact' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', '4-Piece Ceramic Mug Set', 24.00, 32.00, 4.70, 156, 'Multicolor',
'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?auto=format&fit=crop&w=900&q=80'
),
'Modern ceramic mug set perfect for coffee, tea, and gifting.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '4-Piece Ceramic Mug Set' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Microfiber Bed Sheet Set', 39.00, 54.00, 4.40, 87, 'Ivory',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80'
),
'Soft microfiber bed sheet set with wrinkle-resistant finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Microfiber Bed Sheet Set' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Wall Clock Minimalist', 27.00, 35.00, 4.50, 64, 'Matte Black',
'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=900&q=80'
),
'Silent minimalist wall clock suited for kitchen, living room, and office.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wall Clock Minimalist' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Premium Bath Towel Set', 31.00, 42.00, 4.60, 109, 'Ocean Blue',
'https://images.unsplash.com/photo-1616627456754-95f0f9f76166?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1616627456754-95f0f9f76166?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'
),
'Absorbent cotton bath towel set with plush texture and quick dry fibers.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Premium Bath Towel Set' AND department = 'home-kitchen');

INSERT INTO products (department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description)
SELECT 'home-kitchen', 'Food Storage Container Set', 29.00, 39.00, 4.70, 141, 'Clear',
'https://images.unsplash.com/photo-1586201375761-83865001e17f?auto=format&fit=crop&w=900&q=80',
JSON_ARRAY(
  'https://images.unsplash.com/photo-1586201375761-83865001e17f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1615486363976-928fe0f26d8e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80'
),
'Airtight BPA-free containers for pantry organization and meal prep.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Food Storage Container Set' AND department = 'home-kitchen');
