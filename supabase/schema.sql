-- RezervAZ MVP schema
-- Run this in Supabase SQL Editor for a free-tier friendly setup.

create extension if not exists pgcrypto;

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'RezervAZ Clinic',
  business_type text not null default 'clinic'
    check (business_type in (
      'dental',
      'clinic',
      'beauty_salon',
      'nail_salon',
      'barber',
      'playstation_cafe',
      'stadium',
      'tour',
      'gym',
      'restaurant',
      'lounge',
      'agro_tourism'
    )),
  public_slug text not null default 'rezervaz-clinic',
  custom_domain text,
  phone text,
  address text,
  working_days text[] not null default array[
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ],
  work_start time not null default '09:00',
  work_end time not null default '18:00',
  logo_url text,
  primary_color text not null default '#0f766e',
  secondary_color text not null default '#14b8a6',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_settings
  add column if not exists public_slug text not null default 'rezervaz-clinic';

alter table public.business_settings
  add column if not exists custom_domain text;

alter table public.business_settings
  add column if not exists secondary_color text not null default '#14b8a6';

alter table public.business_settings
  drop constraint if exists business_settings_business_type_check;

alter table public.business_settings
  add constraint business_settings_business_type_check
  check (business_type in (
    'dental',
    'clinic',
    'beauty_salon',
    'nail_salon',
    'barber',
    'playstation_cafe',
    'stadium',
    'tour',
    'gym',
    'restaurant',
    'lounge',
    'agro_tourism'
  ));

create unique index if not exists business_settings_public_slug_idx
  on public.business_settings(public_slug);

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_specialty text,
  phone text,
  working_days text[] not null default array[
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ],
  work_start time not null default '09:00',
  work_end time not null default '18:00',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(10, 2) not null default 0 check (price >= 0),
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'customers_full_name_length_check') then
    alter table public.customers add constraint customers_full_name_length_check
      check (char_length(full_name) between 1 and 200);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'customers_phone_length_check') then
    alter table public.customers add constraint customers_phone_length_check
      check (char_length(phone) between 1 and 50);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'customers_email_length_check') then
    alter table public.customers add constraint customers_email_length_check
      check (email is null or char_length(email) <= 254);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'customers_notes_length_check') then
    alter table public.customers add constraint customers_notes_length_check
      check (notes is null or char_length(notes) <= 2000);
  end if;
end;
$$;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  staff_id uuid not null references public.staff_members(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  source text not null default 'admin' check (source in ('admin', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create index if not exists reservations_staff_date_idx
  on public.reservations(staff_id, appointment_date, start_time);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_business_settings_updated_at on public.business_settings;
create trigger set_business_settings_updated_at
before update on public.business_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_staff_members_updated_at on public.staff_members;
create trigger set_staff_members_updated_at
before update on public.staff_members
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

create or replace function public.prevent_double_booking()
returns trigger
language plpgsql
as $$
begin
  if new.status <> 'cancelled' and exists (
    select 1
    from public.reservations existing
    where existing.staff_id = new.staff_id
      and existing.appointment_date = new.appointment_date
      and existing.id <> new.id
      and existing.status <> 'cancelled'
      and new.start_time < existing.end_time
      and new.end_time > existing.start_time
  ) then
    raise exception 'This provider already has a reservation at that time.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_double_booking_trigger on public.reservations;
create trigger prevent_double_booking_trigger
before insert or update on public.reservations
for each row execute function public.prevent_double_booking();

create or replace function public.get_reservation_blocks(
  filter_date date default null,
  filter_staff_id uuid default null
)
returns table (
  id uuid,
  staff_id uuid,
  appointment_date date,
  start_time time,
  end_time time,
  status text
)
language sql
security definer
set search_path = public
as $$
  select
    reservations.id,
    reservations.staff_id,
    reservations.appointment_date,
    reservations.start_time,
    reservations.end_time,
    reservations.status
  from public.reservations
  where reservations.status <> 'cancelled'
    and (filter_date is null or reservations.appointment_date = filter_date)
    and (filter_staff_id is null or reservations.staff_id = filter_staff_id);
$$;

grant execute on function public.get_reservation_blocks(date, uuid)
to anon, authenticated;

alter table public.business_settings enable row level security;
alter table public.staff_members enable row level security;
alter table public.services enable row level security;
alter table public.customers enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "Public can read business settings" on public.business_settings;
create policy "Public can read business settings"
on public.business_settings for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can manage business settings" on public.business_settings;
create policy "Authenticated can manage business settings"
on public.business_settings for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read active staff" on public.staff_members;
create policy "Public can read active staff"
on public.staff_members for select
to anon, authenticated
using (
  active = true
  or (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'staff')
);

drop policy if exists "Authenticated can manage staff" on public.staff_members;
create policy "Authenticated can manage staff"
on public.staff_members for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services for select
to anon, authenticated
using (
  active = true
  or (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'staff')
);

drop policy if exists "Authenticated can manage services" on public.services;
create policy "Authenticated can manage services"
on public.services for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can create customers" on public.customers;
create policy "Public can create customers"
on public.customers for insert
to anon
with check (true);

drop policy if exists "Authenticated can read customers" on public.customers;
create policy "Authenticated can read customers"
on public.customers for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'staff'));

drop policy if exists "Authenticated can manage customers" on public.customers;
create policy "Authenticated can manage customers"
on public.customers for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read reservation blocks" on public.reservations;

drop policy if exists "Public can create pending reservations" on public.reservations;
create policy "Public can create pending reservations"
on public.reservations for insert
to anon
with check (status = 'pending' and source = 'public');

drop policy if exists "Authenticated can manage reservations" on public.reservations;
create policy "Authenticated can manage reservations"
on public.reservations for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'staff'))
with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'staff'));
