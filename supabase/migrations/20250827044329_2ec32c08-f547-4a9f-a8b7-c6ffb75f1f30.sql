-- Stage 2: Lock contact_messages with minimal risk

-- Drop permissive policies if present
DROP POLICY IF EXISTS "Public access to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public read access to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow contact messages administration" ON public.contact_messages;

-- Insert allowed for anon and authenticated
DROP POLICY IF EXISTS "contact_messages_insert_anon_ok" ON public.contact_messages;
CREATE POLICY "contact_messages_insert_anon_ok"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Select allowed only for admins
DROP POLICY IF EXISTS "contact_messages_select_admin_only" ON public.contact_messages;
CREATE POLICY "contact_messages_select_admin_only"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Service role policy already exists and must remain
-- (contact_messages_service_role_all)