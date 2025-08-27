-- Part A: Seed a real admin that satisfies FK  
with u as (
  select id from auth.users where email = 'ankurb@peace2hearts.com' limit 1
)
insert into public.admin_users (id)
select id from u
on conflict do nothing;

select 'admin_users_row_count' as label, count(*) from public.admin_users;

-- Part B: Ensure service_role policies exist on all 3 tables
drop policy if exists "payments_service_role_all" on public.payments;
create policy "payments_service_role_all"
on public.payments
for all
using((auth.jwt()->>'role')='service_role')
with check((auth.jwt()->>'role')='service_role');

drop policy if exists "profiles_service_role_all" on public.profiles;
create policy "profiles_service_role_all"
on public.profiles
for all
using((auth.jwt()->>'role')='service_role')
with check((auth.jwt()->>'role')='service_role');

drop policy if exists "consultations_service_role_all" on public.consultations;
create policy "consultations_service_role_all"
on public.consultations
for all
using((auth.jwt()->>'role')='service_role')
with check((auth.jwt()->>'role')='service_role');

-- Part C: Re-apply strict user policies (NO public)
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
on public.profiles
for select to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "consultations_select_owner_or_consultant_or_admin" on public.consultations;
create policy "consultations_select_owner_or_consultant_or_admin"
on public.consultations
for select to authenticated
using (
  user_id = auth.uid()
  or consultant_id = auth.uid()
  or public.is_admin(auth.uid())
);

drop policy if exists "consultations_insert_owner_or_admin" on public.consultations;
create policy "consultations_insert_owner_or_admin"
on public.consultations
for insert to authenticated
with check (
  user_id = auth.uid()
  or public.is_admin(auth.uid())
);

drop policy if exists "consultations_update_owner_or_consultant_or_admin" on public.consultations;
create policy "consultations_update_owner_or_consultant_or_admin"
on public.consultations
for update to authenticated
using (
  user_id = auth.uid()
  or consultant_id = auth.uid()
  or public.is_admin(auth.uid())
)
with check (
  user_id = auth.uid()
  or consultant_id = auth.uid()
  or public.is_admin(auth.uid())
);

-- Part D: Verify RLS enabled and list policies
select 
  tablename,
  case when rowsecurity then 'ENABLED' else 'DISABLED' end as rls_status
from pg_tables 
where schemaname = 'public' 
  and tablename in ('payments', 'profiles', 'consultations')
order by tablename;

select 
  tablename,
  policyname,
  cmd as command,
  case when permissive = 'PERMISSIVE' then 'PERMISSIVE' else 'RESTRICTIVE' end as type
from pg_policies 
where schemaname = 'public' 
  and tablename in ('payments', 'profiles', 'consultations')
order by tablename, policyname;

-- Part E: Test with proper consultation_type field
with test_user as (
  select id from auth.users limit 1
),
test_consultant as (
  select id from consultants limit 1  
)
insert into public.consultations (
  id, 
  user_id, 
  consultant_id, 
  client_email, 
  client_name, 
  payment_id, 
  order_id,
  consultation_type,
  time_slot
)
select 
  '11111111-1111-1111-1111-111111111111',
  test_user.id,
  test_consultant.id,
  'test@example.com',
  'Test User',
  'pay_test',
  'order_test',
  'general',
  '10:00-11:00'
from test_user, test_consultant
where test_user.id is not null and test_consultant.id is not null
on conflict (id) do nothing;

-- Test service role access (critical for webhooks)
do $$
declare
  payments_count int;
  consultations_count int;
  profiles_count int;
begin
  perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
  
  select count(*) into payments_count from public.payments;
  select count(*) into consultations_count from public.consultations;  
  select count(*) into profiles_count from public.profiles;
  
  raise notice 'SERVICE ROLE ACCESS TEST:';
  raise notice 'Payments accessible: % rows', payments_count;
  raise notice 'Consultations accessible: % rows', consultations_count;
  raise notice 'Profiles accessible: % rows', profiles_count;
end $$;

-- Test authenticated user access
do $$
declare
  test_user_id uuid;
  user_profiles_count int;
begin
  select id into test_user_id from auth.users limit 1;
  
  if test_user_id is not null then
    perform set_config('request.jwt.claims', format('{"sub":"%s","role":"authenticated"}', test_user_id), true);
    
    select count(*) into user_profiles_count from public.profiles where id = auth.uid();
    
    raise notice 'USER ACCESS TEST:';
    raise notice 'User % can see own profiles: % rows', test_user_id, user_profiles_count;
    
    -- Test cross-user access (should be 0)
    select count(*) into user_profiles_count from public.profiles where id != auth.uid();
    raise notice 'User can see other profiles: % rows (should be 0)', user_profiles_count;
  else
    raise notice 'No auth users found for testing';
  end if;
end $$;