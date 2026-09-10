# Chatham Culinary Path

A Greater Chatham Initiative showcase: the food businesses of Chicago's South
Side as one trail, for people discovering Chatham for the first time.

Live status: **built and committed, not yet deployed.** See *Where this stands*.

## What it is

- **Hero** — GCI's own aerial of the corridor, two-tone Figtree headline.
- **The Path** — twelve kitchens grouped by corridor (75th, 79th, Cottage
  Grove, and just beyond), each with a live *Open now · until 9 PM* chip.
- **Search** — instant, client-side, across name, cuisine, signature dishes and
  neighborhood, plus an *Open now* filter.
- **Updates** — a dated feed from `content/updates.ts`.

## Stack

Next.js 16 · React 19 · Tailwind v4 · App Router · TypeScript. **No
dependencies beyond next/react.** No CMS, no database, no search service —
twelve entries do not need one.

## Adding a stop

1. Add an entry to `content/restaurants.ts`. Every field is documented there.
2. Drop its photo at `public/images/restaurants/<slug>.jpg|png|webp`. The page
   resolves the extension itself.
3. That's it. Corridor grouping, search, and the live chip all derive from the
   entry.

## How "Open now" works

`app/lib/live-status.ts` fetches each kitchen's own site at request time
(ISR-cached ten minutes) and reads the `openingHoursSpecification` from its
JSON-LD — the same block that drives that site's own chip and its Google
listing. If the fetch fails or the block is missing, the stop falls back to the
`schedule` in `content/`. A restaurant site going down never removes a card.

Stops built on the GCI template (`builtByGci: true`) have that block. Brown
Sugar Bakery and Justice of the Pies are external and don't, so for those two
the `schedule` in content IS the source, transcribed from what they publish.

## Brand

Sampled from gci2016.org, not guessed — crimson `#bf1e2d`, orange `#f26927`,
gold `#c2915e`, Figtree Black/ExtraBold, full-pill buttons. One deliberate
correction: GCI's own site puts white and crimson labels on orange buttons at
3.08:1 and ~2:1; **black on orange is 6.83:1**, so the pills here carry black.
Orange and gold are split into fill and `-ink` text rungs (5.59:1 / 5.43:1).

## Where this stands (handoff, 2026-09-10)

**Done**
- 12 stops with verified NAP from each business's own site; 12 photos, each
  named by real MIME type.
- `next build` clean.
- Repo `rdawsonsdp/chatham-culinary-path` (private).

**Not yet done — in order**
1. **Deploy.** Held deliberately for a separate go-ahead. `vercel deploy --yes`
   from this directory; Vercel will alias the first deployment to production.
2. **Run the verification checklist** from the `gci-restaurant-template`
   skill: overflow at 390/1280, console/hydration, every image rendering, and
   the live-status fetch actually returning `source: "live"` for the ten
   GCI-built stops. The machine ran out of memory before a local smoke test
   could run, so this is unverified beyond the production build.
3. **Copy pass.** The hero and corridor blurbs are working copy in GCI's voice.
   Worth a read by GCI before launch; the `storybrand` skill applies.
4. **Confirm two data points** with the businesses: Lem's has no phone on its
   site; Uncle John's address on our own site is street-only.
5. Set `NEXT_PUBLIC_SITE_URL` when a real domain is chosen.

**Known open questions on the underlying sites** (carried from their builds):
Uncle John's hours contradiction, Just Jerk's three-way closing time, Soul
Veg's one unpriced item. These affect the live chips.
