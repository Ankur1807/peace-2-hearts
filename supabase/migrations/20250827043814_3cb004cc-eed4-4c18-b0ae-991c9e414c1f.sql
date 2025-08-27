-- Stage 1: Prepare RLS ground safely (RLS stays DISABLED)

-- 1) Drop existing is_admin function and recreate with robust safety checks
DROP FUNCTION IF EXISTS public.is_admin(uuid);

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First check if admin_users table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'admin_users'
  ) THEN
    RETURN false;
  END IF;
  
  -- If table exists, check for user_id column first, fall back to id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'user_id'
  ) THEN
    RETURN EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = uid);
  ELSE
    RETURN EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = uid);
  END IF;
END;
$$;

-- 2) Create idempotent service_role policies using JWT-based checks

-- Profiles service_role policy
DROP POLICY IF EXISTS "profiles_service_role_all" ON public.profiles;
CREATE POLICY "profiles_service_role_all"
ON public.profiles
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Consultations service_role policy  
DROP POLICY IF EXISTS "consultations_service_role_all" ON public.consultations;
CREATE POLICY "consultations_service_role_all"
ON public.consultations
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Contact messages service_role policy
DROP POLICY IF EXISTS "contact_messages_service_role_all" ON public.contact_messages;
CREATE POLICY "contact_messages_service_role_all"
ON public.contact_messages
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');