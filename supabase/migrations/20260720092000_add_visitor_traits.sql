-- Add coarse, privacy-preserving browser traits without exposing raw rows.

alter table public.visitor_locations
  add column if not exists device_type text not null default 'unknown'
    check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  add column if not exists os_family text not null default 'unknown'
    check (os_family in ('windows', 'macos', 'ios', 'android', 'linux', 'chromeos', 'other', 'unknown')),
  add column if not exists browser_family text not null default 'unknown'
    check (browser_family in ('chrome', 'safari', 'firefox', 'edge', 'opera', 'samsung', 'other', 'unknown')),
  add column if not exists language text not null default 'unknown'
    check (language in ('en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'it', 'other', 'unknown')),
  add column if not exists screen_size text not null default 'unknown'
    check (screen_size in ('small', 'medium', 'large', 'unknown')),
  add column if not exists referrer_source text not null default 'unknown'
    check (referrer_source in ('direct', 'internal', 'google', 'bing', 'baidu', 'duckduckgo', 'github', 'linkedin', 'twitter', 'academic', 'other', 'unknown')),
  add column if not exists entry_page text not null default 'other'
    check (entry_page in ('home', 'publications', 'other'));

alter table public.visitor_locations enable row level security;
revoke all on table public.visitor_locations from anon, authenticated;

create or replace function public.record_visit_v2(
  p_visitor_id uuid,
  p_country text,
  p_city text,
  p_lat double precision,
  p_lng double precision,
  p_device_type text,
  p_os_family text,
  p_browser_family text,
  p_language text,
  p_screen_size text,
  p_referrer_source text,
  p_entry_page text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_device_type text := lower(trim(coalesce(p_device_type, 'unknown')));
  v_os_family text := lower(trim(coalesce(p_os_family, 'unknown')));
  v_browser_family text := lower(trim(coalesce(p_browser_family, 'unknown')));
  v_language text := lower(trim(coalesce(p_language, 'unknown')));
  v_screen_size text := lower(trim(coalesce(p_screen_size, 'unknown')));
  v_referrer_source text := lower(trim(coalesce(p_referrer_source, 'unknown')));
  v_entry_page text := lower(trim(coalesce(p_entry_page, 'other')));
begin
  if p_visitor_id is null
     or p_country is null
     or p_lat is null
     or p_lng is null
     or char_length(trim(p_country)) not between 1 and 80
     or char_length(coalesce(trim(p_city), '')) > 100
     or p_lat not between -90 and 90
     or p_lng not between -180 and 180
     or v_device_type not in ('mobile', 'tablet', 'desktop', 'unknown')
     or v_os_family not in ('windows', 'macos', 'ios', 'android', 'linux', 'chromeos', 'other', 'unknown')
     or v_browser_family not in ('chrome', 'safari', 'firefox', 'edge', 'opera', 'samsung', 'other', 'unknown')
     or v_language not in ('en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'it', 'other', 'unknown')
     or v_screen_size not in ('small', 'medium', 'large', 'unknown')
     or v_referrer_source not in ('direct', 'internal', 'google', 'bing', 'baidu', 'duckduckgo', 'github', 'linkedin', 'twitter', 'academic', 'other', 'unknown')
     or v_entry_page not in ('home', 'publications', 'other') then
    raise exception 'Invalid visitor data';
  end if;

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
        end,
        device_type = case when device_type = 'unknown' and v_device_type <> 'unknown' then v_device_type else device_type end,
        os_family = case when os_family = 'unknown' and v_os_family <> 'unknown' then v_os_family else os_family end,
        browser_family = case when browser_family = 'unknown' and v_browser_family <> 'unknown' then v_browser_family else browser_family end,
        language = case when language = 'unknown' and v_language <> 'unknown' then v_language else language end,
        screen_size = case when screen_size = 'unknown' and v_screen_size <> 'unknown' then v_screen_size else screen_size end,
        referrer_source = case
          when referrer_source = 'unknown' and v_referrer_source <> 'unknown' then v_referrer_source
          else referrer_source
        end,
        entry_page = case
          when entry_page = 'other' and v_entry_page <> 'other' then v_entry_page
          else entry_page
        end
    where visitor_id = p_visitor_id;
    return;
  end if;

  if (select count(*) from public.visitor_locations where first_seen >= now() - interval '1 hour') >= 120
     or (select count(*) from public.visitor_locations where first_seen >= now() - interval '1 day') >= 1000 then
    raise exception 'Visitor intake is temporarily rate limited';
  end if;

  insert into public.visitor_locations (
    visitor_id, country, city, lat, lng, device_type, os_family,
    browser_family, language, screen_size, referrer_source, entry_page
  ) values (
    p_visitor_id,
    trim(p_country),
    nullif(trim(p_city), ''),
    round(p_lat::numeric, 1)::double precision,
    round(p_lng::numeric, 1)::double precision,
    v_device_type,
    v_os_family,
    v_browser_family,
    v_language,
    v_screen_size,
    v_referrer_source,
    v_entry_page
  );
end;
$$;

create or replace function public.record_visit(
  p_visitor_id uuid,
  p_country text,
  p_city text,
  p_lat double precision,
  p_lng double precision
)
returns void
language sql
security definer
set search_path = ''
as $$
  select public.record_visit_v2(
    p_visitor_id,
    p_country,
    p_city,
    p_lat,
    p_lng,
    'unknown',
    'unknown',
    'unknown',
    'unknown',
    'unknown',
    'unknown',
    'other'
  );
$$;

revoke all on function public.record_visit_v2(uuid, text, text, double precision, double precision, text, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.record_visit(uuid, text, text, double precision, double precision) from public, anon, authenticated;
grant execute on function public.record_visit_v2(uuid, text, text, double precision, double precision, text, text, text, text, text, text, text) to anon;
grant execute on function public.record_visit(uuid, text, text, double precision, double precision) to anon;

notify pgrst, 'reload schema';
