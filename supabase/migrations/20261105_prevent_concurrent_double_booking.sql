-- Apply after resolving existing active overlapping reservations.
-- PostgreSQL exclusion constraint closes concurrent double-booking races.
create extension if not exists btree_gist;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'reservations_no_overlapping_staff_slot'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_no_overlapping_staff_slot
      exclude using gist (
        staff_id with =,
        tsrange(appointment_date + start_time, appointment_date + end_time, '[)') with &&
      )
      where (status <> 'cancelled');
  end if;
end;
$$;
