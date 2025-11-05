# Setup Instructions

## Current Status

✅ **Completed:**
- Next.js project initialized with TypeScript and Tailwind
- Supabase client configured (server and client)
- ProductCard component with hover effect
- Product catalog homepage
- Fonts configured (Geist and Playfair Display)
- Placeholder images added
- TypeScript types defined

🔲 **Next Steps:**
- Set up Supabase database
- Add sample products
- Configure Square payments
- Set up SMTP2GO emails
- Build product detail pages
- Build order flow
- Build admin panel

---

## 1. Set Up Supabase Database

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and API keys

### Run the Database Schema
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the sidebar
3. Copy the contents of `docs/database-schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to create tables, indexes, and sample products

This will create:
- `products` table with RLS policies
- `orders` table with RLS policies
- 3 sample products (ornament, sign, mug)

### Get Your API Keys
1. In Supabase dashboard, go to Settings > API
2. Copy these values:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)

---

## 2. Configure Environment Variables

1. Open `.env.local` in the project root
2. Replace the placeholder values with your real credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

---

## 3. Test the Application

### Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### What You Should See
- "Redman Designs Collection" heading with Playfair font
- 3 product cards in a grid
- Hover over cards to see the animation and product details
- Each card shows: image, name, description, price, and "Customizable" badge

---

## 4. Replace Placeholder Images

The project currently has placeholder images at:
```
public/images/products/
  ├── ornament-family.jpg
  ├── sign-wooden.jpg
  └── mug-painted.jpg
```

Replace these with your actual product photos. Keep the same filenames or update the product records in Supabase.

**Image Recommendations:**
- Size: 600x400px minimum
- Format: JPG or PNG
- Aspect ratio: 3:2 (horizontal)

---

## 5. Customize Products in Supabase

### View Products
1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select "products" table
4. You'll see the 3 sample products

### Edit a Product
Click on any field to edit:
- `name` - Product display name
- `description` - Detailed description (shows on hover)
- `price` - Price as decimal (e.g., 24.99)
- `image_filename` - Just the filename (e.g., `ornament-family.jpg`)
- `barcode` - Unique barcode for QR codes
- `customization_type` - `'names'`, `'text'`, or `'none'`
- `customization_rules` - JSON with limits (see examples below)
- `active` - true/false (only active products show on site)

### Customization Rules Examples

**For name customization (ornament):**
```json
{
  "max_names": 8,
  "max_chars_per_name": 20,
  "allow_special_chars": false,
  "placeholder": "Enter family member names"
}
```

**For text customization (sign):**
```json
{
  "max_chars": 50,
  "allow_special_chars": true,
  "placeholder": "Enter your custom text"
}
```

**For no customization (mug):**
```
null
```

---

## 6. Add More Products

### Via Supabase Dashboard
1. Go to Table Editor > products
2. Click "Insert row"
3. Fill in all required fields
4. Make sure `barcode` is unique
5. Save

### Via SQL
```sql
INSERT INTO products (barcode, name, description, price, image_filename, customization_type, customization_rules, active)
VALUES (
  'YOUR-BARCODE-HERE',
  'Product Name',
  'Product description that appears on hover',
  19.99,
  'your-image.jpg',
  'none',
  null,
  true
);
```

---

## 7. Generate QR Codes

Once your site is deployed, generate QR codes for each product:

**Product-specific QR:**
```
https://your-site.com/p/XMAS-ORN-001
https://your-site.com/p/SIGN-WOOD-001
https://your-site.com/p/MUG-PAINT-001
```

**Catalog QR:**
```
https://your-site.com/?src=qr&campaign=in-store
```

Use a QR generator:
- [qr.io](https://qr.io)
- [qr-code-generator.com](https://www.qr-code-generator.com)

Print these QR codes and place them in your shop or on marketing materials.

---

## 8. Next: Square Payment Integration

To accept payments, you'll need:
1. Square developer account
2. Application ID and Location ID
3. Access tokens (sandbox for testing, production for live)

We'll set this up in the next phase.

---

## 9. Next: SMTP2GO Email Notifications

To send order confirmations:
1. SMTP2GO account and API key
2. Configure sender email

---

## Troubleshooting

### Products Not Showing
- Check `.env.local` has correct Supabase credentials
- Restart dev server after changing env variables
- Check Supabase dashboard > products table has active products
- Check browser console for errors

### Images Not Loading
- Ensure images are in `public/images/products/`
- Filenames in database match actual files
- Restart dev server

### Fonts Look Wrong
- Clear browser cache
- Check Network tab for font loading errors
- Restart dev server

---

## Project Structure

```
redman-designs-ordering2/
├── app/
│   ├── page.tsx              # Catalog homepage
│   ├── layout.tsx            # Root layout with fonts
│   └── globals.css           # Global styles
├── components/
│   └── ProductCard.tsx       # Product card component
├── lib/
│   └── supabase/
│       ├── client.ts         # Client-side Supabase
│       └── server.ts         # Server-side Supabase
├── types/
│   └── index.ts              # TypeScript types
├── public/
│   └── images/
│       └── products/         # Product images
├── docs/
│   ├── PRD.md               # Product Requirements Doc
│   ├── database-schema.sql  # Database setup SQL
│   └── SETUP.md            # This file
└── .env.local               # Environment variables
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Square Developer](https://developer.squareup.com)
