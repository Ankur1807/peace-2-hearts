-- Stage 1: Create service_role policies only (RLS already enabled but we need service_role access)

-- Create idempotent service_role policies using JWT-based checks
-- Note: is_admin function already exists and uses id column correctly

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