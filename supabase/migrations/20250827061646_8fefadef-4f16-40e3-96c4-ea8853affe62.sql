-- Stage B: Service role safety net (idempotent)
drop policy if exists "consultants_service_role_all" on public.consultants;
create policy "consultants_service_role_all"
on public.consultants
for all
using ((auth.jwt()->>'role')='service_role')
with check ((auth.jwt()->>'role')='service_role');

drop policy if exists "consultant_profiles_service_role_all" on public.consultant_profiles;
create policy "consultant_profiles_service_role_all"
on public.consultant_profiles
for all
using ((auth.jwt()->>'role')='service_role')
with check ((auth.jwt()->>'role')='service_role');

-- Stage C: Remove public access (idempotent)
drop policy if exists "Consultants are publicly accessible" on public.consultants;
drop policy if exists "Consultant profiles are publicly accessible" on public.consultant_profiles;

-- Stage D: Create safe public view
-- Safe fields: id, specialization, is_available, available_days, available_hours, hourly_rate
-- Excluded sensitive fields: name, bio, qualifications, experience, profile_picture_url, profile_id, full_name
create or replace view public.consultants_public as
select 
  id,
  specialization,
  is_available,
  available_days,
  available_hours,
  hourly_rate
from public.consultants
where is_available = true;

-- Grant public select on view only
revoke all on public.consultants_public from public;
grant select on public.consultants_public to anon, authenticated;

-- Stage E: Minimal user policies on base tables
drop policy if exists "consultants_select_admin" on public.consultants;
create policy "consultants_select_admin"
on public.consultants
for select to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "consultant_profiles_select_admin" on public.consultant_profiles;
create policy "consultant_profiles_select_admin"
on public.consultant_profiles
for select to authenticated
using (public.is_admin(auth.uid()));