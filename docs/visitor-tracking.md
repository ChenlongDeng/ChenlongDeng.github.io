# Visitor tracking

The production site records privacy-conscious, approximate visitor statistics
without rendering a visitor map. A map can be added later after enough data has
been collected.

## Data flow

1. The browser respects Do Not Track and Global Privacy Control.
2. `ipwhois.io` resolves the request to an approximate city location. Its free
   browser endpoint currently allows 1,000 requests per day per domain.
3. Coordinates are rounded to one decimal place before submission.
4. Supabase stores a random browser UUID, country, city, rounded coordinates,
   and first/last visit timestamps. It does not store IP addresses.
5. The browser and database both suppress repeat counts within six hours.

The public database role cannot read the underlying table. It can only call the
restricted write RPC and the city-level aggregate read RPC. New browser IDs are
capped per hour and per day to bound abuse of the public endpoint.

## Deployment

Run `supabase/visitor-tracking.sql` in the Supabase project, then configure these
GitHub Actions repository variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No secret or service-role key belongs in GitHub, the repository, or the browser.
