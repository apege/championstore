-- =========================================================
-- CHAMPIONSTORE SUPABASE DATABASE SCHEMA & PERMISSIONS SCRIPT
-- =========================================================

-- 1. GRANT USAGE & FULL ACCESS TO ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 2. ORDERS TABLE POLICIES (Fix Permission Denied)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all on orders for anon, authenticated, service_role" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read order by id" ON public.orders;
DROP POLICY IF EXISTS "Allow service role all on orders" ON public.orders;

CREATE POLICY "Allow all on orders"
ON public.orders
FOR ALL
TO public, anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 3. PRODUCTS TABLE POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Allow service role all on products" ON public.products;

CREATE POLICY "Allow all on products"
ON public.products
FOR ALL
TO public, anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 4. BLACKLISTS TABLE POLICIES
ALTER TABLE public.blacklists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on blacklists" ON public.blacklists;
DROP POLICY IF EXISTS "Allow public read on blacklist" ON public.blacklists;
DROP POLICY IF EXISTS "Allow service role all on blacklist" ON public.blacklists;

CREATE POLICY "Allow all on blacklists"
ON public.blacklists
FOR ALL
TO public, anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 5. STORE SETTINGS TABLE POLICIES
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Allow public read on store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Allow service role all on store_settings" ON public.store_settings;

CREATE POLICY "Allow all on store_settings"
ON public.store_settings
FOR ALL
TO public, anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 6. STORAGE BUCKETS PERMISSIONS
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public upload payment proofs" ON storage.objects;
CREATE POLICY "Allow public upload payment proofs"
ON storage.objects FOR INSERT
TO public, anon, authenticated, service_role
WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Allow public view payment proofs" ON storage.objects;
CREATE POLICY "Allow public view payment proofs"
ON storage.objects FOR SELECT
TO public, anon, authenticated, service_role
USING (bucket_id = 'payment-proofs');

-- 7. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
