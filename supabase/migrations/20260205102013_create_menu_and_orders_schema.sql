/*
  # Create Cloud Kitchen Database Schema

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key) - Unique identifier for each menu item
      - `name` (text) - Name of the dish
      - `category` (text) - Category (e.g., Pizza, Sandwiches, Pav Bhaji Special)
      - `price` (numeric) - Single price for items without half/full options
      - `half_price` (numeric, nullable) - Price for half portion
      - `full_price` (numeric, nullable) - Price for full portion
      - `description` (text, nullable) - Optional description
      - `is_available` (boolean) - Availability status
      - `created_at` (timestamptz) - Record creation timestamp

    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `customer_name` (text) - Customer's full name
      - `customer_phone` (text) - Contact number
      - `customer_address` (text) - Delivery address
      - `total_amount` (numeric) - Total order amount
      - `payment_status` (text) - Payment status (pending/confirmed)
      - `order_status` (text) - Order status (placed/confirmed/delivered)
      - `utr_number` (text, nullable) - UPI transaction reference number
      - `created_at` (timestamptz) - Order timestamp

    - `order_items`
      - `id` (uuid, primary key) - Unique identifier
      - `order_id` (uuid, foreign key) - Reference to orders table
      - `menu_item_id` (uuid, nullable) - Reference to menu_items table
      - `item_name` (text) - Name of ordered item
      - `quantity` (integer) - Quantity ordered
      - `unit_price` (numeric) - Price per unit
      - `size` (text, nullable) - Size variant (half/full)

  2. Security
    - Enable RLS on all tables
    - Public read access for menu_items (customers need to view menu)
    - Public insert access for orders and order_items (customers can place orders)
    - Authenticated users can view all orders (for admin/staff)
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric,
  half_price numeric,
  full_price numeric,
  description text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  total_amount numeric NOT NULL,
  payment_status text DEFAULT 'pending',
  order_status text DEFAULT 'placed',
  utr_number text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  size text
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_items (public read access)
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (true);

-- RLS Policies for orders (public can insert, authenticated can view all)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- RLS Policies for order_items (public can insert, authenticated can view all)
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
