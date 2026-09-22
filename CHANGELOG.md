# Changelog

## [Unreleased]

## [v0.4.3] — 2026-09-22
- Home blast: pointer-reactive molten orb (canvas rAF) + heat-distorting headline + fault crack; custom `/viz/hero-fault.svg`, `fault-crack.svg`, `war-room-triage.svg`
- Specialist desk strip in the fold: PUB/DNS/SCH/PRV failure modes with first-check tips (readable intel, not motion-only)
- War room section: concrete Base44 symptoms → fault → first move + triage ladder diagram + changelog tension (not equal feature cards)
- Sharper home copy/CTAs; asymmetric field notes with blog SVGs; `prefers-reduced-motion` keeps static composition
- Impeccable: do not `display:none` magnetic CTAs under reduced-motion

## [v0.4.2] — 2026-09-22
- FAQ: rebuilt as `src/data/faq.json` + `src/lib/faq.ts` with ~200+ long-tail Q&As (categories, search, accordion, FAQPage JSON-LD); SEO title aimed at Base44 not working / stuck FAQ
- Analytics: `@vercel/analytics` + `@vercel/speed-insights` in Layout; optional `PUBLIC_GA_MEASUREMENT_ID` gtag when set; OPS notes for Vercel Analytics toggle
- Admin/ops v1: Decap CMS at `/admin` (GitHub backend, FAQ collection on `src/data/faq.json`) + `docs/OPS.md` (traffic + OAuth notes)
- `/updates`: DELETED public studio ship-notes aside that dumped CHANGELOG.md engineering bullets (RSS h3 / content:encoded / guid dedupe) onto visitors — page is Base44 product/dev feed only; removed `getStudioShipNotes` helper
- `/start` intake: practical tips instead of scope-refusal; open stuck type (free text + optional chips, not required 4-radio cage); stronger SEO H1/lead; drop contact/status footer line
- Unstick scrub motion: always-on liquid pulse/glow (even mid-sticky), scrub sticky trap lowered (~115vh), scroll scrub no longer freezes lava at mid-opacity
- Home scrub / heat band: brighter lava (#FF6A00+), higher opacity, stronger glow, readable copy scrim — fixes “invisible” fault-line section
- Site-wide motion + imagery: cursor heat trail + magnetic CTAs (reduced-motion safe); page-heat viz on start/work/updates/blog/keyword pages; reuse `/viz` + `/blog` SVGs
- `/updates`: human intro (no RSS/h3/build-time meta); Product + Developer chips; denser dual-feed merge (~22 items, longer summaries); “From the studio” blog links
- Blog: hero + diagram SVGs per post, index thumbnails, every post has FAQ (`FaqList`) + FAQPage JSON-LD; changelog post rewritten for builders (no scrape mechanics)
- ChangelogFeed empty state: calm official link only

## [v0.4.1] — 2026-09-22
- Updates feed: prefer first `<h3>` inside RSS `content:encoded` as title (RSS `<title>` is often just a date); strip HTML summary (~160 chars); parse category + guid; dedupe by guid
- `/updates` + ChangelogFeed show real headline, summary, category chip, date; clear empty-state copy when RSS fallback
- Optional studio ship notes (last bullets from CHANGELOG.md), labeled as studio — not Base44 product

## [v0.4.0] — working (branch v0.4.0-liquid-orange)
- Restore liquid-orange WOW: settling melt mark + breath, visible lava veins, fault diagrams, scroll liquid scrub; keep Impeccable bans (no marquee/kickers/buried grain/zero-offset orange glow)
- Impeccable pass: removed dark-glow / marquee / kickers / buried grain / all-caps body; fixed cramped padding with literal rem insets; excluded .agents from Tailwind scan (no amber tutorial utils in CSS)
- Molten orange / charcoal visual system (Base44-family #FF6A00 heat, not teal, not paper)
- Melting logo hero animation + motion-heavy home (Taste + Emil rules)
- Skills vendored: design-taste-frontend, emil-design-eng, impeccable
- Global tokens: Syne + IBM Plex, melt/@keyframes, reduced-motion guards, btn active scale(0.97), accent glow
- Assets: public/logo-melt.svg + orange/dark logo + favicon variants
- Layout/Nav/Footer restyled to dark foundry (#0F0E0E / #F9F7F4 / #FF6A00)
- Home rebuilt: full-viewport melt hero, asymmetric unstick zig-zag, process strip, restyled changelog/blog/FAQ/FixTheBase/CTA
- /start restyled to molten system; mailto diagnostic + urgency field kept
- Other pages inherit dark tokens (bg-white -> bg-bg-2)
- Amp: morphing SVG blob (feTurbulence + path morph), multi-strand drips, puddle, glow pulse, film grain
- Amp: CSS scroll-driven sticky scrub orb + view() section reveals (IO fallback); molten error marquee
- Amp: button hover lift, link-draw underline; reduced-motion still kills big motion
- Draft only - not live until תעשה

## [Unreleased]
- Lead path: `/start` urgency field, sharper case subject, clearer “what we do / don’t” box (on PR branch — not live until merge + תעשה)
- Draft outreach: `drafts/lead-outreach-base44-stuck.md` (not posted)
- Deduplicate Base44 product changelog RSS items on home/updates — park until Naor approves **v0.3.1**
- Sync note: PR #2 https://github.com/rept0rix/base44expert/pull/2 aligns git with live (merge when go)

## [v0.3.0] — 2026-09-15 (live)
- Deploy: `dpl_BTQhSXGN1azupsdX748sWZsfbS7W` → aliases `www.base44expert.com`
- Ink/paper visual system (kill teal); new logo mark + wordmark
- Lead machine `/start` (mailto case intake)
- Blog (4 posts), FAQ + FAQPage schema, `llms.txt`
- Live Base44 changelog feed from official docs RSS
- SEO / GEO / AIO + WCAG 2.2 AA baseline

## [v0.2.1] — 2026-09-07
- Contact: mailto `na0ryank0@gmail.com`, Formspree placeholder removed from git
- Live: git promote `dpl_5dVBTFU…` / sha `2ead537`
- Rule: no empty manual `deploy_to_vercel` file trees on production

## [v0.2.0] — 2026-09-02
- First studio redesign on main (“We get it unstuck”)
- Logo PR #1 merged (later replaced in Next)

## [v0.1.0]
- Initial Astro tutorial / personal-name site (retired)
