-- Explicit deny policies for private demo tables.
-- These tables are intentionally not exposed to browser roles.

create policy "deny_browser_complaints"
on public.cosmo_complaints
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create policy "deny_browser_widget_settings"
on public.cosmo_widget_settings
as restrictive
for all
to anon, authenticated
using (false)
with check (false);
