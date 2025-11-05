-- =============================================
-- Redman Designs Database Schema
-- =============================================
-- Run this in Supabase SQL Editor to create tables

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_filename TEXT,
  customization_type TEXT CHECK (customization_type IN ('names', 'text', 'none')),
  customization_rules JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customization_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'picked_up', 'cancelled')),
  total_price DECIMAL(10,2) NOT NULL,
  payment_id TEXT NOT NULL,
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('completed', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Products
-- Allow public to view active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (active = true);

-- RLS Policies for Orders
-- Allow public to insert orders (for customer orders)
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Note: Admin access uses service role key which bypasses RLS

-- =============================================
-- Sample Product Data (Optional)
-- =============================================

-- Product 1: Family Christmas Ornament
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

-- Product 2: Custom Wooden Sign
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

-- Product 3: Hand-Painted Mug
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
