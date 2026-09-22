# Base44 Expert — ops (v1)

Short runbook for Naor. Independent studio site on Vercel.

## Traffic / visits

1. Open [Vercel Dashboard](https://vercel.com) → project **base44expert**.
2. Open **Analytics**.
3. If Web Analytics is off: **Analytics → Enable** (Hobby supports Web Analytics; toggle in the dashboard).
4. Speed Insights ships with the site via `@vercel/speed-insights` — enable/view under the same project if prompted.

Optional Google Analytics: set `PUBLIC_GA_MEASUREMENT_ID` in Vercel → Project → Settings → Environment Variables (Production). Leave unset if unused — the site only loads gtag when the env is present.

Do not invent traffic numbers offline; read them in the Vercel UI.

## Content admin (Decap CMS)

- Entry: **https://base44expert.com/admin/** (also `/admin/index.html`).
- Config: `public/admin/config.yml`
- Backend: GitHub repo `rept0rix/base44expert`
- Editable collection (v1): **FAQ** → `src/data/faq.json` (categories + Q&As)
- Media folder: `public/uploads`

### Enable GitHub auth for Decap (Naor action)

Decap’s GitHub backend needs an OAuth application (or Netlify Identity / Git Gateway). Practical options:

1. **Netlify Identity + Git Gateway** pointing at this GitHub repo (common Decap path), or
2. A small OAuth proxy (e.g. `decap-cms-oauth` / Netlify’s auth endpoint) with a GitHub OAuth App:
   - Homepage: `https://base44expert.com`
   - Callback: as required by your OAuth proxy
3. **Local edits**: run `npx decap-server` in the repo with `local_backend: true`, open `/admin`, commit as usual.

Until OAuth is wired, edit `src/data/faq.json` in GitHub/PR like any other file. FAQ page reads that file at build time.

Blog posts today are Astro pages under `src/pages/blog/` — not Decap-backed in v1. FAQ is the CMS-backed surface.

## FAQ data

- Source: `src/data/faq.json`
- Module: `src/lib/faq.ts`
- Page: `/faq` (category jump links, client search, accordion, FAQPage JSON-LD)

## Deploys

- Production aliases follow Vercel project **base44expert**.
- Prefer git push → Vercel build. Do not dump engineering CHANGELOG bullets onto `/updates`.

## Contact path

Lead intake: `/start` → mailto diagnostic. No Formspree.
