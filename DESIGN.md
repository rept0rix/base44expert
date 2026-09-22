# Base44 Expert — DESIGN.md (v0.4.0 liquid orange)

## Concept
Molten rescue studio. Stuck Base44 apps thaw under heat. A molten orange mark drips from the top of the viewport, puddles, and reforms into the studio wordmark. Dark foundry charcoal, one Base44-family orange as heat (not their product UI clone), loud motion, zero AI-purple, zero three-equal feature cards.

## Feel
Industrial heat + liquid play. Not teal tutorial. Not beige paper (v0.3). Closer to a motion studio landing than a SaaS template.

## Palette (locks)
- `--bg`: `#0F0E0E`
- `--bg-2`: `#1A1816`
- `--ink`: `#F9F7F4`
- `--muted`: `#8E8E8E`
- `--line`: `#312F2F`
- `--accent`: `#FF6A00` (Base44 orange heat — single accent lock)
- `--accent-2`: `#FF8F5C`
- `--accent-glow`: `rgba(255, 106, 0, 0.35)`
Never introduce blue/purple/teal accents mid-page.

## Type
- Display: `Syne` (700/800) — weird, geometric, not Instrument Serif
- Body: `IBM Plex Sans` 400/500
- Mono: `IBM Plex Mono` 400/500
Cap body ~65ch. Loosen tracking on uppercase labels.

## Shape lock
Rounded 12–16px cards (`rounded-xl`). Buttons slightly rounder (`rounded-full` pills OK for CTAs). Consistent across page.

## Motion (Emil rules)
- Enter/exit: ease-out; on-screen morph: ease-in-out; hover: ease; marquee: linear
- Micro 100–150ms; UI 150–250ms; hero melt 1.2–1.8s once
- Appear from `scale(0.95)` + opacity, never `scale(0)`
- Active press: `scale(0.97)`
- Prefer CSS `@keyframes` + `IntersectionObserver` / scroll-driven CSS. No `window.addEventListener('scroll')` writing React/DOM state in a loop.
- `prefers-reduced-motion: reduce` disables melt loop and big drifts; keep opacity fades under 200ms

## Hero
- Full viewport. Melting orange mark falls from above, drips, reforms.
- Headline max 2 lines desktop / 4 mobile, under 20 words.
- One primary CTA visible without scroll: Start a diagnostic → `/start`
- No scroll cue, no version pill, no weather strip, no fake terminal.

## Layout bans (Taste)
- No 3 equal feature cards
- No AI purple / mesh blobs
- No numbered eyebrows (`01 / INDEX`)
- No em-dashes in copy
- Asymmetric zig-zag or sticky stack for "what we unstick"

## Logo
Custom SVG molten blob + "Base44 Expert" wordmark. Do NOT paste Base44 Inc trademark artwork. Inspired by heat/melt metaphor only.

## Pages in this pass
Priority: global CSS tokens, Layout/Nav/Footer dark, Home hero+sections, `/start` restyle to match. Other pages inherit tokens; deep rewrite later.

## Ship gate
Draft on branch `v0.4.0-liquid-orange` only. No production / DNS / public send without OMEGA card + `תעשה`.
