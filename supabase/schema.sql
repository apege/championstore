-- =========================================================
-- CHAMPIONSTORE SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- =========================================================

-- 1. PRODUCTS TABLE (Katalog Paket Robux)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    amount INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    is_promo BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_sultan BOOLEAN DEFAULT FALSE,
    badge TEXT,
    category TEXT NOT NULL CHECK (category IN ('popular', 'promo', 'sultan', 'regular')),
    stock INTEGER DEFAULT 999,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was previously created
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_promo BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_sultan BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'regular';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 999;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. CUSTOMERS TABLE (Daftar Pelanggan)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roblox_username TEXT UNIQUE NOT NULL,
    roblox_id TEXT,
    phone TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    tier TEXT DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Sultan')),
    is_blacklisted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_order_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist for customers
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS roblox_id TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Bronze';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS is_blacklisted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS last_order_at TIMESTAMPTZ DEFAULT NOW();

-- 3. ORDERS TABLE (Transaksi / Order Masuk)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_username TEXT NOT NULL,
    customer_roblox_id TEXT,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_robux INTEGER NOT NULL,
    total_price NUMERIC NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('WEBSITE', 'WHATSAPP')),
    status TEXT NOT NULL DEFAULT 'Menunggu Bayar' CHECK (status IN ('Menunggu Bayar', 'Diproses', 'Selesai', 'Dibatalkan')),
    payment_proof_url TEXT,
    customer_note TEXT,
    admin_notes TEXT,
    is_id_active BOOLEAN DEFAULT TRUE,
    source TEXT NOT NULL DEFAULT 'WEBSITE' CHECK (source IN ('WEBSITE', 'WHATSAPP')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all order columns exist if table was already created earlier
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_roblox_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_robux INTEGER DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_price NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'WEBSITE';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Menunggu Bayar';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_note TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_id_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'WEBSITE';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. BLACKLIST TABLE (Daftar Akun / No WA Terblokir)
CREATE TABLE IF NOT EXISTS public.blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roblox_username TEXT UNIQUE NOT NULL,
    phone TEXT,
    reason TEXT NOT NULL,
    added_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist for blacklist
ALTER TABLE public.blacklist ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.blacklist ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT 'Indikasi penipuan';
ALTER TABLE public.blacklist ADD COLUMN IF NOT EXISTS added_by TEXT DEFAULT 'Admin';

-- 5. STORE SETTINGS TABLE (Pengaturan Toko & Catatan)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT DEFAULT 'ChampionStore_IDN',
    whatsapp_number TEXT DEFAULT '6285189196307',
    whatsapp_url TEXT DEFAULT 'https://wa.me/6285189196307',
    is_store_open BOOLEAN DEFAULT TRUE,
    announcement_banner TEXT DEFAULT '⚡ PROMO RAMADHAN & WEEKEND: BONUS HINGGA 200 ROBUX SETIAP PEMBELIAN PAKET SULTAN! PROSES OTOMATIS 1-5 MENIT.',
    admin_note TEXT DEFAULT 'Catatan penting untuk tim admin: Selalu cek bukti transfer dan status ID Roblox sebelum memproses pesanan.',
    qris_image_url TEXT DEFAULT '/qris.png',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist for store_settings
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS store_name TEXT DEFAULT 'ChampionStore_IDN';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '6285189196307';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS whatsapp_url TEXT DEFAULT 'https://wa.me/6285189196307';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS is_store_open BOOLEAN DEFAULT TRUE;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS announcement_banner TEXT;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS qris_image_url TEXT DEFAULT '/qris.png';

-- 6. ACTIVITY LOGS TABLE (Riwayat Aktivitas Admin & Toko)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    order_id TEXT,
    user_target TEXT,
    type TEXT DEFAULT 'system' CHECK (type IN ('order', 'status', 'system', 'blacklist', 'product', 'settings')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- INDEXES FOR FAST QUERYING
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_username ON public.orders(customer_username);
CREATE INDEX IF NOT EXISTS idx_customers_username ON public.customers(roblox_username);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products, service_role has full control
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow service role all on products" ON public.products;
CREATE POLICY "Allow service role all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Store Settings: Everyone can read, service_role has full control
DROP POLICY IF EXISTS "Allow public read on store_settings" ON public.store_settings;
CREATE POLICY "Allow public read on store_settings" ON public.store_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow service role all on store_settings" ON public.store_settings;
CREATE POLICY "Allow service role all on store_settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- Orders: Public can insert their order, service_role has full control
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public read order by id" ON public.orders;
CREATE POLICY "Allow public read order by id" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow service role all on orders" ON public.orders;
CREATE POLICY "Allow service role all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Customers, Blacklist, Activity: Service role has full control
DROP POLICY IF EXISTS "Allow public read on blacklist" ON public.blacklist;
CREATE POLICY "Allow public read on blacklist" ON public.blacklist FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow service role all on blacklist" ON public.blacklist;
CREATE POLICY "Allow service role all on blacklist" ON public.blacklist FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow service role all on customers" ON public.customers;
CREATE POLICY "Allow service role all on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow service role all on activity_logs" ON public.activity_logs;
CREATE POLICY "Allow service role all on activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

-- =========================================================
-- STORAGE BUCKETS SETUP (Run via Storage or Supabase SQL)
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Allow public upload and view
DROP POLICY IF EXISTS "Allow public upload payment proofs" ON storage.objects;
CREATE POLICY "Allow public upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Allow public view payment proofs" ON storage.objects;
CREATE POLICY "Allow public view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs');

-- =========================================================
-- SEED INITIAL DATA
-- =========================================================

-- Seed Default Store Settings
INSERT INTO public.store_settings (id, store_name, whatsapp_number, whatsapp_url, is_store_open, announcement_banner, admin_note, qris_image_url)
VALUES (
    'default',
    'ChampionStore_IDN',
    '6285189196307',
    'https://wa.me/6285189196307',
    true,
    '⚡ PROMO RAMADHAN & WEEKEND: BONUS HINGGA 200 ROBUX SETIAP PEMBELIAN PAKET SULTAN! PROSES OTOMATIS 1-5 MENIT.',
    'Catatan penting untuk tim admin: Selalu cek bukti transfer dan status ID Roblox sebelum memproses pesanan.',
    '/qris.png'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, amount, price, original_price, is_promo, is_best_seller, is_sultan, badge, category, stock, is_active, sort_order)
VALUES
    ('rbx-800', 800, 105000, 120000, false, false, false, NULL, 'popular', 999, true, 1),
    ('rbx-1200', 1200, 155000, 180000, false, true, false, 'TERLARIS', 'popular', 999, true, 2),
    ('rbx-1700', 1700, 215000, 250000, false, false, false, NULL, 'popular', 999, true, 3),
    ('rbx-2200', 2200, 275000, 320000, true, false, false, 'PROMO SPESIAL', 'promo', 999, true, 4),
    ('rbx-3200', 3200, 395000, 460000, false, false, false, NULL, 'regular', 999, true, 5),
    ('rbx-5600', 5600, 695000, 800000, false, false, true, 'SULTAN PACK', 'sultan', 999, true, 6),
    ('rbx-10000', 10000, 1190000, 1400000, false, false, true, 'ULTIMATE SULTAN', 'sultan', 999, true, 7)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Blacklist
INSERT INTO public.blacklist (roblox_username, phone, reason, added_by)
VALUES
    ('TukangTipu99', '081234567890', 'Kirim bukti transfer palsu / editan berkali-kali', 'System Admin'),
    ('FakeRobloxer', '089876543210', 'Spamming invoice tanpa pembayaran', 'System Admin')
ON CONFLICT (roblox_username) DO NOTHING;

-- Seed Initial Customers
INSERT INTO public.customers (roblox_username, roblox_id, phone, total_orders, total_spent, tier, is_blacklisted)
VALUES
    ('hssuen2', '4805117766', '+62882007441347', 5, 450000, 'Gold', false),
    ('AlifGamer99', '182736452', '+628123456789', 2, 260000, 'Silver', false),
    ('SultanRobux_ID', '992837461', '+628571234567', 12, 4800000, 'Sultan', false)
ON CONFLICT (roblox_username) DO NOTHING;

-- Seed Initial Orders
INSERT INTO public.orders (id, customer_username, customer_roblox_id, customer_phone, items, total_robux, total_price, payment_method, status, payment_proof_url, customer_note, admin_notes, is_id_active, source, created_at)
VALUES
    ('CS-13576381', 'hssuen2', '4805117766', '+62882007441347', '[{"id": "rbx-1700", "amount": 1700, "price": 215000, "quantity": 1, "name": "1.700 Robux"}]'::jsonb, 1700, 215000, 'WEBSITE', 'Menunggu Bayar', NULL, 'Tolong proses cepat ya', NULL, true, 'WEBSITE', NOW() - INTERVAL '10 minutes'),
    ('CS-99023318', 'AlifGamer99', '182736452', '+628123456789', '[{"id": "rbx-1200", "amount": 1200, "price": 155000, "quantity": 1, "name": "1.200 Robux"}]'::jsonb, 1200, 155000, 'WHATSAPP', 'Diproses', NULL, '-', 'Sedang dikirim via gamepass', true, 'WHATSAPP', NOW() - INTERVAL '1 hour'),
    ('CS-98855577', 'SultanRobux_ID', '992837461', '+628571234567', '[{"id": "rbx-10000", "amount": 10000, "price": 1190000, "quantity": 1, "name": "10.000 Robux"}]'::jsonb, 10000, 1190000, 'WEBSITE', 'Selesai', NULL, 'Langganan setia', 'Robux berhasil terkirim', true, 'WEBSITE', NOW() - INTERVAL '3 hours')
ON CONFLICT (id) DO NOTHING;

-- Seed Activity Logs
INSERT INTO public.activity_logs (action, details, order_id, user_target, type, created_at)
VALUES
    ('Sistem Aktif', 'Backend Supabase berhasil dikoneksikan ke ChampionStore', NULL, NULL, 'system', NOW()),
    ('Order Baru', 'Order #CS-13576381 dibuat oleh hssuen2', 'CS-13576381', 'hssuen2', 'order', NOW() - INTERVAL '10 minutes'),
    ('Status Diperbarui', 'Order #CS-99023318 diubah status menjadi Diproses', 'CS-99023318', 'AlifGamer99', 'status', NOW() - INTERVAL '45 minutes'),
    ('Order Selesai', 'Order #CS-98855577 selesai diproses', 'CS-98855577', 'SultanRobux_ID', 'order', NOW() - INTERVAL '3 hours');

-- RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
