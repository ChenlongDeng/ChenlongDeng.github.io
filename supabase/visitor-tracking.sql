-- Backend for privacy-conscious visitor statistics on the static website.
-- The public site may call the two RPCs below but cannot access raw rows.

create table if not exists public.visitor_locations (
  visitor_id uuid primary key,
  country text not null check (char_length(country) between 1 and 80),
  city text check (city is null or char_length(city) <= 100),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  visit_count bigint not null default 1 check (visit_count > 0)
);

create index if not exists visitor_locations_first_seen_idx
  on public.visitor_locations (first_seen);

alter table public.visitor_locations enable row level security;
revoke all on table public.visitor_locations from anon, authenticated;

create or replace function public.record_visit(
  p_visitor_id uuid,
  p_country text,
  p_city text,
  p_lat double precision,
  p_lng double precision
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if char_length(trim(p_country)) not between 1 and 80
     or char_length(coalesce(trim(p_city), '')) > 100
     or p_lat not between -90 and 90
     or p_lng not between -180 and 180 then
    raise exception 'Invalid visitor location';
  end if;

  -- Serialize this low-volume endpoint so the creation caps are race-safe.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('visitor_locations:new'));

  if exists (
    select 1 from public.visitor_locations where visitor_id = p_visitor_id
  ) then
    update public.visitor_locations
    set country = trim(p_country),
        city = nullif(trim(p_city), ''),
        lat = round(p_lat::numeric, 1)::double precision,
        lng = round(p_lng::numeric, 1)::double precision,
        last_seen = case
          when last_seen < now() - interval '6 hours' then now()
          else last_seen
        end,
        visit_count = visit_count + case
          when last_seen < now() - interval '6 hours' then 1
          else 0
        end
    where visitor_id = p_visitor_id;
    return;
  end if;

  -- A public UUID can be forged. These caps bound storage growth without
  -- collecting IP addresses; they are abuse protection, not identity proof.
  if (select count(*) from public.visitor_locations where first_seen >= now() - interval '1 hour') >= 120
     or (select count(*) from public.visitor_locations where first_seen >= now() - interval '1 day') >= 1000 then
    raise exception 'Visitor intake is temporarily rate limited';
  end if;

  insert into public.visitor_locations (
    visitor_id, country, city, lat, lng
  ) values (
    p_visitor_id,
    trim(p_country),
    nullif(trim(p_city), ''),
    round(p_lat::numeric, 1)::double precision,
    round(p_lng::numeric, 1)::double precision
  );
end;
$$;

create or replace function public.get_visitor_map()
returns table (
  country text,
  city text,
  lat double precision,
  lng double precision,
  last_seen timestamptz,
  unique_visitors bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    locations.country,
    locations.city,
    locations.lat,
    locations.lng,
    max(locations.last_seen) as last_seen,
    count(*)::bigint as unique_visitors
  from public.visitor_locations as locations
  group by locations.country, locations.city, locations.lat, locations.lng
  order by last_seen desc;
$$;

revoke all on function public.record_visit(uuid, text, text, double precision, double precision) from public;
revoke all on function public.get_visitor_map() from public;
grant execute on function public.record_visit(uuid, text, text, double precision, double precision) to anon;
grant execute on function public.get_visitor_map() to anon;
