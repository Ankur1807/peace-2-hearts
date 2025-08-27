-- Ensure RLS is properly enforced - drop and recreate policies
drop policy if exists "consultants_service_role_all" on public.consultants;
drop policy if exists "consultants_select_admin" on public.consultants;

create policy "consultants_service_role_all"
on public.consultants
for all
using ((auth.jwt()->>'role')='service_role')
with check ((auth.jwt()->>'role')='service_role');

create policy "consultants_select_admin"
on public.consultants
for select to authenticated
using (public.is_admin(auth.uid()));

-- Same for consultant_profiles
drop policy if exists "consultant_profiles_service_role_all" on public.consultant_profiles;
drop policy if exists "consultant_profiles_select_admin" on public.consultant_profiles;

create policy "consultant_profiles_service_role_all"
on public.consultant_profiles
for all
using ((auth.jwt()->>'role')='service_role')
with check ((auth.jwt()->>'role')='service_role');

create policy "consultant_profiles_select_admin"
on public.consultant_profiles
for select to authenticated
using (public.is_admin(auth.uid()));