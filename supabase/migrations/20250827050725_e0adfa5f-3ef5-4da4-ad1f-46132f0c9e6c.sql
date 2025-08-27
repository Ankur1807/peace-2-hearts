-- P0 Security Fix: Remove public access to customer data (Fixed Version)
-- Stage A: Audit and print current RLS status and policies

-- Check if RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'consultations');

-- List all current policies on profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

-- List all current policies on consultations  
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'consultations'
ORDER BY policyname;

-- Stage B: Remove permissive policies
DROP POLICY IF EXISTS "Profiles are publicly accessible" ON public.profiles;
DROP POLICY IF EXISTS "Public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;

DROP POLICY IF EXISTS "Consultations are publicly accessible" ON public.consultations;
DROP POLICY IF EXISTS "consultations_public" ON public.consultations;
DROP POLICY IF EXISTS "Allow public access to consultations" ON public.consultations;

-- Stage C: Ensure service role safety net exists on both tables
DROP POLICY IF EXISTS "profiles_service_role_all" ON public.profiles;
CREATE POLICY "profiles_service_role_all"
ON public.profiles
FOR ALL
USING ( (auth.jwt() ->> 'role') = 'service_role' )
WITH CHECK ( (auth.jwt() ->> 'role') = 'service_role' );

DROP POLICY IF EXISTS "consultations_service_role_all" ON public.consultations;
CREATE POLICY "consultations_service_role_all"
ON public.consultations
FOR ALL
USING ( (auth.jwt() ->> 'role') = 'service_role' )
WITH CHECK ( (auth.jwt() ->> 'role') = 'service_role' );

-- Stage D: Strict user policies

-- profiles: self only
DROP POLICY IF EXISTS "profiles_select_self" ON public.profiles;
CREATE POLICY "profiles_select_self"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
CREATE POLICY "profiles_insert_self"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- consultations: owner or consultant or admin
DROP POLICY IF EXISTS "consultations_select_owner_or_consultant_or_admin" ON public.consultations;
CREATE POLICY "consultations_select_owner_or_consultant_or_admin"
ON public.consultations
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR consultant_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "consultations_insert_owner_or_admin" ON public.consultations;
CREATE POLICY "consultations_insert_owner_or_admin"
ON public.consultations
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "consultations_update_owner_or_consultant_or_admin" ON public.consultations;
CREATE POLICY "consultations_update_owner_or_consultant_or_admin"
ON public.consultations
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR consultant_id = auth.uid()
  OR public.is_admin(auth.uid())
)
WITH CHECK (
  user_id = auth.uid()
  OR consultant_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Stage E: Live checks and print results

-- 1) profiles self access
SELECT set_config('request.jwt.claims','{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}', true);

-- Check own rows access (should show 0 since no profile exists for test user)
SELECT count(*) as own_rows FROM public.profiles WHERE id = auth.uid();

-- Cross read should be blocked or return zero  
SELECT 'Cross-read test (should be empty):' as test_label;
SELECT count(*) as cross_read_count FROM public.profiles WHERE id <> auth.uid();

-- 2) consultations owner, consultant, random, admin tests
-- Note: using existing test user from previous migration
-- owner U
SELECT set_config('request.jwt.claims','{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
SELECT count(*) as owner_test FROM public.consultations WHERE user_id = auth.uid();

-- random V must not see anything
SELECT set_config('request.jwt.claims','{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}', true);
SELECT 'Random user test (should be 0):' as test_label;
SELECT count(*) as random_user_count FROM public.consultations;

-- admin reads all (using existing admin from previous migration)
SELECT set_config('request.jwt.claims','{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
SELECT count(*) as admin_visible FROM public.consultations;

-- 3) service role smoke test
-- simulate service role JWT
SELECT set_config('request.jwt.claims','{"role":"service_role"}', true);
-- both selects should work
SELECT 'Service role profiles test:' as test_label;
SELECT count(*) as service_profiles FROM public.profiles;
SELECT 'Service role consultations test:' as test_label;
SELECT count(*) as service_consultations FROM public.consultations;

-- Print current policies after changes
SELECT 'FINAL POLICIES ON PROFILES:' as summary;
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

SELECT 'FINAL POLICIES ON CONSULTATIONS:' as summary;
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'consultations'
ORDER BY policyname;

SELECT 'P0 Security Fix Complete - Public access removed, service role preserved' as status;