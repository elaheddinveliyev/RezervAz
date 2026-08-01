-- RezervAZ LaLiga Lounge Center demo seed data
-- Run after schema.sql when preparing a LaLiga Lounge Center sales demo.

truncate table public.reservations restart identity cascade;
truncate table public.customers restart identity cascade;
truncate table public.services restart identity cascade;
truncate table public.staff_members restart identity cascade;
truncate table public.business_settings restart identity cascade;

insert into public.business_settings (
  business_name,
  business_type,
  public_slug,
  custom_domain,
  phone,
  address,
  working_days,
  work_start,
  work_end,
  logo_url,
  primary_color,
  secondary_color
) values (
  'LaLiga Lounge Center',
  'lounge',
  'laliga-lounge-center',
  'instagram.com/laligaloungecenter',
  '+994 55 814 64 64',
  'Zahid Xalilov 25B, Elmler, Baku',
  array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
  '09:00',
  '03:00',
  '/clients/laliga-logo.png',
  '#4b145c',
  '#facc15'
);

insert into public.staff_members (
  id,
  name,
  role_specialty,
  phone,
  working_days,
  work_start,
  work_end,
  active
) values
  ('00000000-0000-0000-0000-000000002101', 'Game Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002102', 'La Liga Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002103', 'Futurizm', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002104', 'Paris Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002105', 'London Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002106', 'Morocco Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002107', 'Loft Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002108', 'Vintage Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002109', 'Retro Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002110', 'Athens Room', '7 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002111', 'Kabinet 504', '4-5 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002112', 'Kabinet 502', '4-5 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002113', 'Kabinet 501', '4-5 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002114', 'Kabinet 503', '5-6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002115', 'Country Room', '7 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002116', 'Prizma Room', '8-15 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002117', 'Africa Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002118', 'East Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002119', 'Bakı Room', '8-10 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002120', 'Roma Room', '8-10 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002121', 'İstanbul', '8-10 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002122', 'Kiev', '8 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002123', 'Dubay', '8-10 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002124', 'Planet Room', '8-15 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002125', 'Macao Room', '6 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002126', 'Kabinet 505', '4-5 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true),
  ('00000000-0000-0000-0000-000000002127', 'Şuşa Room', '8 nəfərlik otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat', '+994 55 814 64 64', array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], '09:00', '03:00', true);

insert into public.services (
  id,
  name,
  duration_minutes,
  price,
  description,
  active
) values
  (
    '00000000-0000-0000-0000-000000002201',
    'Otaq rezervasiyası - 1 saat',
    60,
    8,
    'Standart otaq rezervasiyası. Hər otaq üçün saatlıq qiymət 8 AZN.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000002202',
    'PS5 ilə otaq - 1 saat',
    60,
    10,
    'PS5 ilə otaq rezervasiyası. Hər otaq üçün saatlıq qiymət 10 AZN.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000002203',
    'Otaq rezervasiyası - 2 saat',
    120,
    16,
    'İki saatlıq standart otaq rezervasiyası.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000002204',
    'PS5 ilə otaq - 2 saat',
    120,
    20,
    'İki saatlıq PS5 ilə otaq rezervasiyası.',
    true
  );

insert into public.customers (
  id,
  full_name,
  phone,
  email,
  notes
) values
  (
    '00000000-0000-0000-0000-000000002301',
    'Rauf Mammadli',
    '+994 55 210 44 11',
    null,
    'Often books Game Room in the evening.'
  ),
  (
    '00000000-0000-0000-0000-000000002302',
    'Ayan Ismayilova',
    '+994 50 680 88 22',
    'ayan@example.com',
    'Asked for Prizma Room group reservation.'
  ),
  (
    '00000000-0000-0000-0000-000000002303',
    'Nicat Hasanov',
    '+994 70 445 19 90',
    null,
    'Prefers PS5 after 20:00.'
  );

insert into public.reservations (
  customer_id,
  staff_id,
  service_id,
  appointment_date,
  start_time,
  end_time,
  status,
  notes,
  source
) values
  (
    '00000000-0000-0000-0000-000000002301',
    '00000000-0000-0000-0000-000000002101',
    '00000000-0000-0000-0000-000000002201',
    current_date,
    '21:00',
    '22:00',
    'confirmed',
    'Game Room, 6 nəfərlik.',
    'admin'
  ),
  (
    '00000000-0000-0000-0000-000000002303',
    '00000000-0000-0000-0000-000000002102',
    '00000000-0000-0000-0000-000000002202',
    current_date,
    '19:30',
    '20:30',
    'pending',
    'La Liga Room with PS5.',
    'public'
  ),
  (
    '00000000-0000-0000-0000-000000002302',
    '00000000-0000-0000-0000-000000002116',
    '00000000-0000-0000-0000-000000002203',
    current_date + interval '2 days',
    '18:00',
    '20:00',
    'confirmed',
    'Prizma Room group reservation, 8-15 nəfərlik.',
    'admin'
  );
