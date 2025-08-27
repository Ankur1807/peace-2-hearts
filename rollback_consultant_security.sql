-- ROLLBACK SQL for consultant security changes
-- This will restore the previous state while keeping RLS enabled

-- Drop admin policies
drop policy if exists "consultants_select_admin" on public.consultants;
drop policy if exists "consultant_profiles_select_admin" on public.consultant_profiles;

-- Drop the public view
drop view if exists public.consultants_public;

-- NOTE: Service role policies are kept intact for webhook functionality
-- NOTE: RLS remains enabled on both tables as required
-- NOTE: Public access policies are NOT restored - this is intentional for security

select 'rollback complete' as status;