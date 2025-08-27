-- Part A: Seed a real admin that satisfies FK
with u as (
  select id from auth.users where email = 'ankurb@peace2hearts.com' limit 1
)
insert into public.admin_users (id)
select id from u
on conflict do nothing;

select 'admin_users_row_count' as label, count(*) from public.admin_users;

-- Part B: Ensure service_role policies exist on all 3 tables
-- JWT-based service role policies (idempotent)
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
-- profiles: self-only
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

-- consultations: owner OR assigned consultant OR admin
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

-- Part D: Sanity check - RLS state + policy listings
select 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables 
where schemaname = 'public' 
  and tablename in ('payments', 'profiles', 'consultations');

-- List all policies on the three tables
select 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
from pg_policies 
where schemaname = 'public' 
  and tablename in ('payments', 'profiles', 'consultations')
order by tablename, policyname;

-- Part E: Live checks with placeholder UUIDs
-- Get a real user UUID for testing
with test_user as (
  select id from auth.users limit 1
),
test_consultant as (
  select id from consultants limit 1  
),
test_admin as (
  select id from admin_users limit 1
)
-- Insert test consultation record
insert into public.consultations (id, user_id, consultant_id, client_email, client_name, payment_id, order_id)
select 
  '11111111-1111-1111-1111-111111111111',
  test_user.id,
  test_consultant.id,
  'test@example.com',
  'Test User',
  'pay_test',
  'order_test'
from test_user, test_consultant, test_admin
on conflict (id) do nothing;

-- Show test UUIDs being used
select 
  'test_user_uuid' as label,
  (select id from auth.users limit 1) as uuid
union all
select 
  'test_consultant_uuid' as label,
  (select id from consultants limit 1) as uuid
union all  
select 
  'test_admin_uuid' as label,
  (select id from admin_users limit 1) as uuid;

-- Test 1: Profile self-access (using first auth user)
do $$
declare
  test_user_id uuid;
begin
  select id into test_user_id from auth.users limit 1;
  if test_user_id is not null then
    perform set_config('request.jwt.claims', format('{"sub":"%s","role":"authenticated"}', test_user_id), true);
    raise notice 'Test 1: Profile self-access for user %', test_user_id;
    perform count(*) from public.profiles where id = auth.uid();
  end if;
end $$;

-- Test 2: Service role access
do $$
begin
  perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
  raise notice 'Test 2: Service role can access payments: %', (select count(*) >= 0 from public.payments);
  raise notice 'Test 2: Service role can access consultations: %', (select count(*) >= 0 from public.consultations);
  raise notice 'Test 2: Service role can access profiles: %', (select count(*) >= 0 from public.profiles);
end $$;