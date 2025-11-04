# Product Requirements Document: Redman Designs Ordering Site

## Overview
A React-based ordering platform for a consignment shop with Supabase database, Square payment integration, and basic admin panel. Starting with ~3 products (including customizable Christmas ornaments). The system handles product browsing, customization, secure payment, order storage, and notifications. Primary entry will be via QR codes placed in-store or on marketing materials.

---

## MVP Summary

**What we're building:**
- Multi-product ordering site (≈3 products initially)
- Product customization where applicable (e.g., ornament names)
- Square payments embedded in your UI
- Supabase for products and orders
- Dual email notifications: shop owner + customer
- Pickup-only fulfillment (no delivery/shipping)
- QR code deep links to specific products or catalog
- **Basic admin panel** for product and order management
- Static image files in project folder

**What's included:**
- Product catalog and detail pages
- Customization forms (dynamic by product type)
- Square Web Payments SDK integration
- Order confirmation and email notifications
- QR/barcode deep linking
- **Admin dashboard:**
  - Password-protected access
  - Product management (add, edit, toggle active/inactive)
  - Order viewing (read-only list with details)
  - Static image filename management

**What's NOT included:**
- User accounts/authentication
- Image upload UI (manual file management)
- Order status updates for customers
- Inventory management
- Delivery/shipping options
- Refund processing UI
- Advanced admin features (bulk operations, analytics)

---

## Project Goals
1. Enable customers to browse and order products online with QR entry
2. Collect customization details for customizable products
3. Process payments securely via Square
4. Store all orders and product data in Supabase
5. Notify shop owner and customer when orders are placed
6. Provide simple admin interface for product management without touching Supabase directly
7. Support barcode-based product identification

---

## Phase 1: MVP Features

### Customer-Facing
- [ ] **Supabase Integration**
  - Connect with @supabase/supabase-js
  - Products table with barcode support
  - Orders table with payment metadata
  - RLS policies (public read on products, public insert on orders)

- [ ] **Product Catalog Page**
  - Grid display of all active products
  - Product cards with image, name, and price
  - Click to view details

- [ ] **Product Detail Page**
  - Dynamic routing: `/p/[barcode]` or `/product/[id]`
  - Full product information display
  - Images from `/public/images/products/`
  - "Order Now" CTA

- [ ] **Customization Form**
  - Dynamic form based on product.customization_type
  - For ornaments: family member names input
  - Validation based on product.customization_rules from DB
  - Live character count / name limit display

- [ ] **Order Form**
  - Customer contact info (name, email, phone)
  - Pickup confirmation
  - Order summary with customization preview
  - Total price display

- [ ] **Square Payment Integration**
  - Square Web Payments SDK
  - Embedded payment form styled with Tailwind
  - Support credit/debit cards
  - Apple Pay / Google Pay support
  - Payment processed before order creation
  - Error handling with retry option

- [ ] **Order Confirmation**
  - Unique order number generation
  - Order summary display
  - Payment confirmation
  - Pickup location, hours, and instructions
  - Expected pickup date

- [ ] **Email Notifications (SMTP2GO)**
  - Shop owner notification with full order details
  - Customer confirmation email with order number
  - Both triggered on successful payment

- [ ] **QR Code Deep Links**
  - Support `/p/[barcode]` for direct product access
  - Support `/?src=qr&campaign=[name]` for catalog tracking
  - Graceful fallback to catalog if barcode not found
  - Optional tracking params for analytics

### Admin Panel
- [ ] **Admin Authentication**
  - Password-protected admin area at `/admin`
  - Simple environment variable password (no user accounts)
  - Session-based access (stays logged in)

- [ ] **Product Management**
  - List all products (active and inactive)
  - Add new product form:
    - Name, description, price
    - Barcode (unique)
    - Image filename (e.g., `ornament-1.jpg`)
    - Customization type and rules (JSON)
    - Active toggle
  - Edit existing products
  - Toggle product active/inactive status
  - Delete products (with confirmation)

- [ ] **Order Management (Read-Only)**
  - List all orders (newest first)
  - Filter by status (pending, ready, picked up)
  - Search by order number or customer name
  - View full order details:
    - Customer info
    - Product details
    - Customization data
    - Payment information
    - Timestamps

### Nice to Have (Phase 1)
- Loading states and error handling throughout
- Mobile-responsive design with Tailwind CSS
- Order lookup for customers (by order number + email)
- Image preview in admin when filename entered
- Admin dashboard stats (total orders today, pending count)

### Out of Scope (Phase 1)
- ❌ Image upload UI (manual file management)
- ❌ Order status updates from admin
- ❌ User authentication system
- ❌ Customer accounts
- ❌ Inventory management
- ❌ Delivery/shipping options
- ❌ Refund processing UI
- ❌ Promotional codes/discounts
- ❌ Admin analytics dashboard
- ❌ Email templates customization UI

---

## Phase 2: Enhanced Features (Future)

### Planned Features
- [ ] **Enhanced Admin Dashboard**
  - Image upload UI with preview
  - Mark orders as ready/picked up
  - Send status update emails to customers
  - Process refunds via Square API
  - Analytics and reporting
  - Bulk operations
  
- [ ] **Customer Features**
  - Order status tracking
  - Order history (with account)
  - Reorder previous orders
  
- [ ] **Product Features**
  - Product categories/tags
  - Product variants (sizes, colors)
  - Bulk pricing
  - Inventory tracking
  - Low stock alerts
  
- [ ] **Advanced Square Integration**
  - Cash App Pay
  - Gift cards
  - Loyalty program
  - Subscription products

---

## Technical Stack

### Confirmed
- **Frontend:** React with Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Payment:** Square Web Payments SDK
- **Email Service:** SMTP2GO via Nodemailer
- **Hosting:** Vercel (recommended)
- **Image Storage:** Static files in `/public/images/products/`

### Libraries
- **Supabase Client:** @supabase/supabase-js
- **Square SDK:** @square/web-payments-sdk-react (or vanilla)
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Email:** Nodemailer
- **Admin Auth:** next-auth (simple credentials provider) or custom session

---

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_filename TEXT, -- e.g., 'ornament-1.jpg'
  customization_type TEXT, -- 'names', 'text', 'none'
  customization_rules JSONB, -- { "max_names": 8, "max_chars_per_name": 20 }
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example customization_rules for ornament:
-- {
--   "max_names": 8,
--   "max_chars_per_name": 20,
--   "allow_special_chars": false
-- }
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customization_data JSONB, -- { "names": ["John", "Jane", "Bob"] }
  status TEXT DEFAULT 'pending', -- 'pending', 'ready', 'picked_up', 'cancelled'
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Payment fields
  payment_id TEXT NOT NULL, -- Square payment ID
  payment_status TEXT DEFAULT 'completed', -- 'completed', 'failed', 'refunded'
  paid_at TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Row Level Security (RLS)
```sql
-- Products: Allow public read access for active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (active = true);

-- Orders: Allow public insert only (no read access for customers)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Admin access via service role key (bypasses RLS)
```

---

## Project Structure

```
redman-designs-ordering2/
├── public/
│   └── images/
│       └── products/
│           ├── ornament-1.jpg
│           ├── ornament-2.jpg
│           └── product-3.jpg
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Catalog/homepage
│   │   ├── p/
│   │   │   └── [barcode]/
│   │   │       └── page.tsx         # Product detail by barcode
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Product detail by ID
│   │   ├── order/
│   │   │   ├── new/[productId]/
│   │   │   │   └── page.tsx         # Order form
│   │   │   └── confirmation/[orderId]/
│   │   │       └── page.tsx         # Order confirmation
│   │   ├── admin/
│   │   │   ├── page.tsx             # Admin dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Admin login
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx     # Add product
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit product
│   │   │   └── orders/
│   │   │       ├── page.tsx         # Order list
│   │   │       └── [id]/
│   │   │           └── page.tsx     # Order details
│   │   └── api/
│   │       ├── orders/
│   │       │   └── route.ts         # Create order
│   │       ├── payments/
│   │       │   └── route.ts         # Process Square payment
│   │       └── emails/
│   │           └── route.ts         # Send emails
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── CustomizationForm.tsx
│   │   ├── OrderForm.tsx
│   │   ├── PaymentForm.tsx
│   │   ├── admin/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── OrderList.tsx
│   │   │   └── AdminNav.tsx
│   │   └── ui/                      # Reusable UI components
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   ├── square.ts                # Square SDK setup
│   │   └── email.ts                 # SMTP2GO email functions
│   └── types/
│       └── index.ts                 # TypeScript types
├── .env.local                        # Environment variables
├── tailwind.config.ts
└── package.json
```

---

## User Flows

### A. Customer Orders via QR Code
```
1. Customer scans QR code in store
   → Lands on /p/{barcode}?src=qr&display=counter
   
2. Product detail page loads
   → Shows product image, description, price
   → "Customize & Order" button
   
3. Customer fills customization form
   → Enters family member names (for ornament)
   → Sees validation and character limits
   → Reviews customization preview
   
4. Customer fills contact form
   → Name, email, phone
   → Confirms pickup at shop
   → Reviews order summary
   
5. Customer pays via Square
   → Embedded payment form appears
   → Enters card details (or uses Apple/Google Pay)
   → Payment processed
   
6. Order created in Supabase
   → Order record with payment_id saved
   → Unique order number generated
   
7. Emails sent via SMTP2GO
   → Shop owner receives order notification
   → Customer receives confirmation email
   
8. Confirmation page displays
   → Order number
   → Customization summary
   → Payment confirmation
   → Pickup instructions
   
9. Customer picks up order at shop (already paid)
```

### B. Admin Manages Products
```
1. Admin visits /admin
   → Prompted to log in
   → Enters password
   
2. Admin dashboard loads
   → Quick stats (total orders, pending, etc.)
   → Navigation to Products and Orders
   
3. Admin clicks "Products"
   → List of all products (active and inactive)
   → "Add New Product" button
   
4. Admin clicks "Add New Product"
   → Form appears:
     - Name, description, price
     - Barcode (unique)
     - Image filename (e.g., ornament-1.jpg)
     - Customization type dropdown
     - Customization rules (JSON editor or form)
     - Active toggle
   
5. Admin saves product
   → Product added to database
   → Appears in catalog immediately
   → Admin returns to product list
   
6. Admin edits existing product
   → Clicks product from list
   → Edit form loads with current values
   → Makes changes and saves
   → Product updated in database
```

### C. Admin Views Orders
```
1. Admin clicks "Orders" in admin dashboard
   → List of all orders (newest first)
   → Filters: status, date range, search
   
2. Admin clicks on an order
   → Order detail view:
     - Order number, status, date
     - Customer info (name, email, phone)
     - Product ordered
     - Customization details
     - Payment info (amount, payment_id, status)
     - Timestamps
   
3. Admin notes order for fulfillment
   → Currently manual (Phase 2: status update buttons)
   → Admin prepares order based on details
```

---

## Image Management

### File Structure
```
/public/images/products/
  ├── ornament-1.jpg
  ├── ornament-2.jpg
  ├── product-3.jpg
  └── ...
```

### Workflow
1. **Add image:**
   - Place image file in `/public/images/products/`
   - Use descriptive filename (e.g., `christmas-ornament-family.jpg`)

2. **Reference in admin:**
   - When adding/editing product, enter filename only: `christmas-ornament-family.jpg`
   - App constructs full path: `/images/products/christmas-ornament-family.jpg`

3. **Display in app:**
   - Product pages use Next.js `<Image>` component
   - Automatic optimization and responsive images

### Future Enhancement (Phase 2)
- Dropdown showing available images in `/public/images/products/`
- Image preview in admin form
- Drag-and-drop upload UI
- Multiple images per product

---

## Square Integration Details

### Setup Requirements
- Square Developer account
- Application ID and Location ID
- Access tokens (sandbox for testing, production for live)
- Web Payments SDK initialization in Next.js

### Payment Flow
1. Customer completes order form
2. Square Web Payments SDK loads on client
3. Customer enters payment info (tokenized by Square - never touches your server)
4. Frontend sends payment token to your API route
5. API route calls Square Payments API with token
6. On success:
   - Create order in Supabase with payment_id
   - Return order details to frontend
   - Trigger email notifications
7. On failure:
   - Return error to frontend
   - Show error message
   - Allow customer to retry

### Square Dashboard Integration
- All payments appear in Square dashboard automatically
- Customer emails captured
- Transaction history synced
- Refunds processed via Square dashboard (Phase 2: UI for this)

---

## Email Notification Templates

### Shop Owner Notification
```
Subject: 💰 New Paid Order #[ORDER_NUMBER] - [PRODUCT_NAME]

New order received and paid!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: [ORDER_NUMBER]
Product: [PRODUCT_NAME]
Price: $[PRICE]
Payment ID: [SQUARE_PAYMENT_ID]
Order Date: [DATE_TIME]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: [CUSTOMER_NAME]
Email: [CUSTOMER_EMAIL]
Phone: [CUSTOMER_PHONE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[CUSTOMIZATION_DETAILS]
Example: Family names: John, Jane, Bob, Alice

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULFILLMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pickup Location: [SHOP_ADDRESS]
Payment Status: ✅ PAID

View in Square: [SQUARE_DASHBOARD_LINK]
View Order Details: [ADMIN_ORDER_LINK]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Customer Confirmation Email
```
Subject: Order Confirmation #[ORDER_NUMBER] - [SHOP_NAME]

Hi [CUSTOMER_NAME],

Thank you for your order! Your payment has been processed successfully.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: [ORDER_NUMBER]
Product: [PRODUCT_NAME]
Price: $[PRICE]

Your Customization:
[CUSTOMIZATION_DETAILS]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PICKUP INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: [SHOP_ADDRESS]
Hours: [PICKUP_HOURS]

Your order will be ready for pickup by: [ESTIMATED_DATE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount Paid: $[PRICE]
Payment Date: [DATE_TIME]
Payment Method: [CARD_BRAND] ending in [LAST_4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Reply to this email or call us at [SHOP_PHONE].

Thank you for supporting [SHOP_NAME]!

[SHOP_NAME]
[SHOP_WEBSITE]
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Square
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-xxx (or production)
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-location-id
SQUARE_ACCESS_TOKEN=your-access-token
SQUARE_ENVIRONMENT=sandbox # or production

# SMTP2GO
SMTP2GO_API_KEY=your-smtp2go-api-key
SMTP2GO_FROM_EMAIL=orders@redmandesigns.com
SHOP_EMAIL=owner@redmandesigns.com

# Shop Details
NEXT_PUBLIC_SHOP_NAME=Redman Designs
NEXT_PUBLIC_SHOP_ADDRESS=123 Main Street, City, ST 12345
NEXT_PUBLIC_SHOP_PHONE=555-123-4567
NEXT_PUBLIC_SHOP_HOURS=Mon-Fri 10am-6pm, Sat 10am-4pm

# Admin
ADMIN_PASSWORD=your-secure-password-here

# App
NEXT_PUBLIC_BASE_URL=https://redmandesigns.com (or localhost:3000 for dev)
```

---

## Open Questions to Resolve

1. **Supabase Setup:**
   - Have you created the products and orders tables?
   - Need help with SQL schema?
   - Ready to share Supabase URL and keys?

2. **Square Setup:**
   - Do you have Square Developer account access?
   - Need help getting API credentials?
   - Start with sandbox, then switch to production?

3. **Initial Products (~3 to start):**
   - Product 1: Christmas ornament with family names - confirmed
   - Product 2: Name? Price? Customization?
   - Product 3: Name? Price? Customization?
   - Do you have product images ready to place in `/public/images/products/`?
   - Barcodes from your consignment shop system?

4. **Product Specifications (for each):**
   - Exact product names and descriptions
   - Prices
   - Image filenames
   - Customization rules:
     - Max names allowed?
     - Max characters per name?
     - Special characters allowed?

5. **Shop Details:**
   - Official shop name: "Redman Designs"?
   - Full pickup address
   - Pickup hours
   - Shop owner email for notifications
   - Shop phone number
   - Expected turnaround time for orders (e.g., "Ready in 3-5 business days")

6. **SMTP2GO:**
   - Do you have SMTP2GO account and API key?
   - What email should orders be sent from?

7. **Admin:**
   - Preferred admin password (store securely in env var)
   - Any other admin users needed? (Phase 2)

---

## Success Criteria (Phase 1 MVP)

### Customer Experience
- ✅ Products load from Supabase and display correctly
- ✅ QR codes link to correct products
- ✅ Customer can browse product catalog
- ✅ Customer can view individual product details with images
- ✅ Customer can customize products (when applicable)
- ✅ Customer can pay via Square successfully
- ✅ Order saved to Supabase after payment
- ✅ Shop owner receives email notification within 1 minute
- ✅ Customer receives confirmation email with order number
- ✅ Confirmation page shows all order details
- ✅ Payment appears in Square dashboard
- ✅ Site is mobile-responsive
- ✅ No critical bugs in happy path

### Admin Experience
- ✅ Admin can log in with password
- ✅ Admin can view all products
- ✅ Admin can add new products
- ✅ Admin can edit existing products
- ✅ Admin can toggle products active/inactive
- ✅ Admin can view all orders
- ✅ Admin can filter and search orders
- ✅ Admin can view full order details
- ✅ Admin interface is intuitive and easy to use

---

## Timeline Estimate (Phase 1 MVP)

### Setup & Infrastructure
- Next.js + Tailwind setup: 1-2 hours
- Supabase integration: 2-3 hours
- Environment configuration: 0.5-1 hour

### Customer-Facing Features
- Product catalog page: 2-3 hours
- Product detail page: 2-3 hours
- Customization form system: 3-4 hours
- Order form: 2-3 hours
- Square payment integration: 4-5 hours
- Order submission flow: 2-3 hours
- Confirmation page: 1-2 hours
- QR deep links & routing: 1-2 hours

### Email System
- SMTP2GO setup: 1-2 hours
- Email templates (shop + customer): 2-3 hours
- Email trigger integration: 1-2 hours

### Admin Panel
- Admin authentication: 2-3 hours
- Product list view: 2-3 hours
- Product add/edit forms: 3-4 hours
- Order list view: 2-3 hours
- Order detail view: 1-2 hours
- Admin navigation & layout: 1-2 hours

### Polish & Testing
- Styling & responsiveness: 4-5 hours
- Error handling: 2-3 hours
- Testing end-to-end flows: 3-4 hours
- Bug fixes: 2-3 hours

**Total Estimate: 40-55 hours**

---

## Development Phases

### Phase 1A: Foundation (Week 1)
- Set up Next.js project with Tailwind
- Connect to Supabase
- Create database schema and RLS policies
- Set up environment variables
- Create basic layout and navigation

### Phase 1B: Customer Flow (Week 2)
- Build product catalog and detail pages
- Implement customization forms
- Integrate Square payments
- Create order submission flow
- Build confirmation page

### Phase 1C: Notifications & QR (Week 3)
- Set up SMTP2GO email system
- Create email templates
- Implement email triggers
- Set up QR code routing
- Test end-to-end customer flow

### Phase 1D: Admin Panel (Week 4)
- Build admin authentication
- Create product management interface
- Build order viewing interface
- Style admin dashboard
- Test admin workflows

### Phase 1E: Polish & Launch (Week 5)
- Mobile responsiveness
- Error handling and validation
- Performance optimization
- Security review
- Final testing
- Deploy to production

---

## Next Steps

### Immediate Actions
1. ✅ PRD finalized with admin panel and static images
2. Gather all required information:
   - Product details (3 products)
   - Product images (place in project folder)
   - Shop details (address, hours, contact)
3. Set up accounts and get credentials:
   - Supabase (database + keys)
   - Square (sandbox + production credentials)
   - SMTP2GO (API key)
4. Choose admin password

### Development Start
1. Initialize Next.js project with Tailwind CSS
2. Set up Supabase database with schema
3. Configure all environment variables
4. Begin Phase 1A development

**Ready to start building!** Share your credentials and product details when ready, and we can kick off development.
