# COSMO Trust Platform — Public SaaS Prototype

High-fidelity public prototype for the COSMO trust/evidence platform. The repository is designed to run independently from Lovable and deploy cleanly on Cloudflare Pages.

## What is included

- Public customer-facing brand website with 10 interactive products.
- Per-product COSMO Trust Widget and full transparency profile.
- Dynamic QR links that resolve to the currently deployed public domain.
- COSMO admin portal: dashboard, products/evidence, AI content lab, verified reviews, widget builder, complaints, reports, integrations, and scope/limitations.
- Vietnamese / English switch across the prototype.
- Local sample video that works without a third-party video host.
- Supabase-ready schema with Row Level Security and public read-only policies.
- Local fallback data so the prototype still works if Supabase is not configured.
- No login gate for the public demonstration flow.

> The illustrated brand context is an independent product-integration scenario. COSMO does not claim an official partnership with the illustrated brand.

## Local development

```bash
npm install
npm run dev
```

Production check:

```bash
npm run check
npm run build
npm run preview
```

## Supabase

Create a Supabase project and apply:

```text
supabase/migrations/0001_cosmo.sql
```

The repository is preconfigured with the dedicated COSMO Supabase project using a browser-safe **publishable key** and Row Level Security. You can optionally override it with Cloudflare environment variables:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

The frontend never contains a service-role/secret key. Public reads are restricted by RLS and explicit grants.

## Cloudflare Pages

Recommended settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 20+ (22 recommended)
- Environment variables: optional; the dedicated COSMO public Supabase configuration is already embedded. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` only if you want to override it.

`public/_redirects` is included so routes such as `/shop/...`, `/trust/...`, and `/admin/...` resolve correctly as an SPA on Cloudflare Pages.

## Main demo flow

1. `/shop` — customer-facing product catalog.
2. `/shop/bi-dao-cleansing-water` — product page with COSMO Trust Widget.
3. `/trust/bi-dao-cleansing-water` — full public transparency profile + QR.
4. `/admin/ai` — interactive multimedia risk-analysis room.
5. `/admin/widget` — Trust Widget configuration and live preview.
6. `/admin/reports` — illustrative funnel / A-B measurement reporting.

## Prototype integrity

COSMO's AI screens represent risk-signal analysis and workflow behavior. They are not presented as a production deepfake classifier. The UI explicitly preserves the principle:

**AI proposes → human confirms → system stores history → customer can inspect evidence.**
