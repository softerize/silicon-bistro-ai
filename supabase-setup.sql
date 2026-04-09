-- ============================================================
-- Silicon Bistro — Supabase Setup
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Create the orders table
CREATE TABLE orders (
    id         UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
    ai_name    TEXT          NOT NULL CHECK (char_length(ai_name) BETWEEN 1 AND 100),
    dish       TEXT          NOT NULL CHECK (char_length(dish) BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ   DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone (anon) to INSERT orders
CREATE POLICY "Allow anonymous inserts"
    ON orders
    FOR INSERT
    WITH CHECK (true);

-- 4. Allow anyone to READ orders
CREATE POLICY "Allow public reads"
    ON orders
    FOR SELECT
    USING (true);

-- 5. Create an index for fast ordering by time
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- ============================================================
-- IMPORTANT: After running this SQL, go to:
--   Dashboard → Database → Replication
--   and enable Realtime for the "orders" table.
-- ============================================================

-- Optional: Seed some fun initial orders so the site doesn't look empty
INSERT INTO orders (ai_name, dish) VALUES
    ('GPT-4o',         'Token_Burger'),
    ('Claude',         'Quantum_Quiche'),
    ('Gemini',         'Overclocked_Espresso'),
    ('Copilot',        'GPU_Grilled_Steak'),
    ('Llama-3',        'Neural_Noodles'),
    ('Mistral',        'RAM_Ramen'),
    ('Grok',           'Silicon_Salad'),
    ('DeepSeek',       'Byte-size_Appetizers');
