# Sample Product Data

Use this as a reference when adding products to Supabase. These are placeholder products for initial testing.

## Product 1: Family Christmas Ornament

```json
{
  "barcode": "XMAS-ORN-001",
  "name": "Family Christmas Ornament",
  "description": "Personalized wooden ornament with family member names. Perfect keepsake for your Christmas tree. Handcrafted with care and ready to display your family's love.",
  "price": 24.99,
  "image_filename": "ornament-family.jpg",
  "customization_type": "names",
  "customization_rules": {
    "max_names": 8,
    "max_chars_per_name": 20,
    "allow_special_chars": false,
    "placeholder": "Enter family member names"
  },
  "active": true
}
```

**Customization Example:**
- Names: John, Sarah, Emily, Michael
- Display: "The Smith Family - John, Sarah, Emily, Michael"

---

## Product 2: Custom Wooden Sign

```json
{
  "barcode": "SIGN-WOOD-001",
  "name": "Custom Wooden Sign",
  "description": "Rustic wooden sign with your custom text. Perfect for home decor, weddings, or gifts. Available in natural wood finish.",
  "price": 34.99,
  "image_filename": "sign-wooden.jpg",
  "customization_type": "text",
  "customization_rules": {
    "max_chars": 50,
    "allow_special_chars": true,
    "placeholder": "Enter your custom text (max 50 characters)"
  },
  "active": true
}
```

**Customization Example:**
- Text: "Welcome to our Home"
- Text: "Est. 2020"

---

## Product 3: Hand-Painted Mug

```json
{
  "barcode": "MUG-PAINT-001",
  "name": "Hand-Painted Ceramic Mug",
  "description": "Beautiful hand-painted ceramic mug. Each piece is unique and food-safe. Microwave and dishwasher safe. A perfect gift for any occasion.",
  "price": 18.99,
  "image_filename": "mug-painted.jpg",
  "customization_type": "none",
  "customization_rules": null,
  "active": true
}
```

**No customization needed** - ready to order as-is.

---

## SQL Insert Statements

Copy and paste these into Supabase SQL Editor to add sample products:

```sql
-- Insert Product 1: Family Christmas Ornament
INSERT INTO products (barcode, name, description, price, image_filename, customization_type, customization_rules, active)
VALUES (
  'XMAS-ORN-001',
  'Family Christmas Ornament',
  'Personalized wooden ornament with family member names. Perfect keepsake for your Christmas tree. Handcrafted with care and ready to display your family''s love.',
  24.99,
  'ornament-family.jpg',
  'names',
  '{"max_names": 8, "max_chars_per_name": 20, "allow_special_chars": false, "placeholder": "Enter family member names"}',
  true
);

-- Insert Product 2: Custom Wooden Sign
INSERT INTO products (barcode, name, description, price, image_filename, customization_type, customization_rules, active)
VALUES (
  'SIGN-WOOD-001',
  'Custom Wooden Sign',
  'Rustic wooden sign with your custom text. Perfect for home decor, weddings, or gifts. Available in natural wood finish.',
  34.99,
  'sign-wooden.jpg',
  'text',
  '{"max_chars": 50, "allow_special_chars": true, "placeholder": "Enter your custom text (max 50 characters)"}',
  true
);

-- Insert Product 3: Hand-Painted Mug
INSERT INTO products (barcode, name, description, price, image_filename, customization_type, customization_rules, active)
VALUES (
  'MUG-PAINT-001',
  'Hand-Painted Ceramic Mug',
  'Beautiful hand-painted ceramic mug. Each piece is unique and food-safe. Microwave and dishwasher safe. A perfect gift for any occasion.',
  18.99,
  'mug-painted.jpg',
  'none',
  null,
  true
);
```

---

## Placeholder Images

Place these files in `/public/images/products/`:

- `ornament-family.jpg` - Photo of wooden ornament
- `sign-wooden.jpg` - Photo of wooden sign
- `mug-painted.jpg` - Photo of ceramic mug

**Temporary placeholder option:**
Use https://placehold.co for testing until you have real images:
- https://placehold.co/600x400/png?text=Ornament
- https://placehold.co/600x400/png?text=Wooden+Sign
- https://placehold.co/600x400/png?text=Ceramic+Mug

---

## QR Code URLs for Testing

Generate QR codes pointing to these URLs:

**Product-specific:**
- Ornament: `https://your-site.com/p/XMAS-ORN-001?src=qr&display=counter`
- Sign: `https://your-site.com/p/SIGN-WOOD-001?src=qr&display=shelf`
- Mug: `https://your-site.com/p/MUG-PAINT-001?src=qr&display=register`

**Catalog:**
- `https://your-site.com/?src=qr&campaign=in-store`

Use a QR code generator like:
- https://qr.io
- https://www.qr-code-generator.com
