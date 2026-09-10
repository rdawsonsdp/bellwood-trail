# Chatham Culinary Path

A Greater Chatham Initiative showcase: the food businesses of Chicago's South
Side as one trail, for people discovering Chatham for the first time.

Live status: **built and committed, not yet deployed.** See *Where this stands*.

## What it is

- **Hero** — an overhead shot of Brown Sugar Bakery on 75th, two-tone Figtree headline.
- **The Path** — thirteen kitchens grouped by corridor (75th, 79th, Cottage
  Grove, and just beyond), each with a live *Open now · until 9 PM* chip.
- **Search** — instant, client-side, across name, cuisine, signature dishes and
  neighborhood, plus an *Open now* filter and Food / Dining / Meal pills
  (Soul Food, Barbecue… · Dine in, Carryout only · Breakfast, Lunch, Dinner).
- **Updates** — a dated feed.
- **Admin** at `/admin` — edit every stop, add or hide stops, change card
  photos, and post to the Updates feed. See *Admin*.

## Stack

Next.js 16 · React 19 · Tailwind v4 · App Router · TypeScript. One dependency
beyond next/react: `@vercel/blob`, where the admin saves. No database, no
search service — thirteen entries do not need one.

## How the cards stay current

A card is the stored stop (`content/`, or the Blob store once someone has
saved in the admin), overlaid with what the restaurant's own site publishes
right now. For stops marked `builtByGci` ("Read hours, phone and address live
from this website" in the admin), `app/lib/site-data.ts` fetches the site's home
page at request time, cached ten minutes, and reads its schema.org JSON-LD:
hours, phone and address. That is the same block that drives the site's own
chip and its Google listing. Sites that list several locations (Tropic Island,
Uncle John's) are matched on the stop's street number.

Anything the site doesn't publish, or a site that's down, falls back to the
stored value. A restaurant site going down never removes a card.

The photo, name, tagline and tags are editorial and set in the admin. The
photo picker lists every image on the restaurant's home page, so "use the
picture from their site" is one click.

Brown Sugar Bakery, Justice of the Pies and HerBachi (herbachi.com) are
external sites with no usable structured data, and Lem's site publishes none,
so for those four the stored values ARE the source.

## Admin

`/admin`, one shared password from the `ADMIN_PASSWORD` environment variable,
which is never in the code or the repo. Locally it lives in `.env.local`. A login lasts twelve hours;
changing the password signs everyone out.

The dashboard checks every stop's site as it loads: up, SSL problems, and
whether the card is getting live details. **Refresh all sites now** drops
the ten-minute cache so every card re-reads its site.

**Where saves go** (`app/lib/content-store.ts`):

| Where it's running | Storage | Notes |
|---|---|---|
| Vercel, Blob store connected | Vercel Blob | One JSON document for all content, plus photo files. Saves carry the version they were made against, so two people saving at once get "reload and try again" instead of a silent overwrite. |
| Your machine, no Blob token | `.content/` and `public/uploads/` | Git-ignored. Lets you try the admin without touching production. |
| Vercel, no store connected | none | The trail serves the seed in `content/`; the admin says it can't save. |

Until the first save, the trail serves the seed files in `content/`. After
that the Blob copy is the truth and `content/` is only the starting point.
There is no edit history yet: each save replaces the document.

**To turn it on in production:** in the Vercel project, create a Blob store
(Storage → Blob, **public** access) and connect it to the project, which sets
`BLOB_READ_WRITE_TOKEN`. Then add `ADMIN_PASSWORD` under Settings →
Environment Variables and redeploy.

## Brand

Sampled from gci2016.org, not guessed — crimson `#bf1e2d`, orange `#f26927`,
gold `#c2915e`, Figtree Black/ExtraBold, full-pill buttons. One deliberate
correction: GCI's own site puts white and crimson labels on orange buttons at
3.08:1 and ~2:1; **black on orange is 6.83:1**, so the pills here carry black.
Orange and gold are split into fill and `-ink` text rungs (5.59:1 / 5.43:1).

## Where this stands (handoff, 2026-09-10)

**Done**
- 13 stops with verified NAP from each business's own site. Refreshed
  2026-09-10 against every home page: Soul Veg and Tropic Island hours, Uncle
  John's full address, Lem's phone and marquee photo, Oooh Wee's dining-room
  photo.
- Admin: login, stop editor with live site check and photo picker, uploads,
  hide and delete, updates feed, conflict handling. All exercised locally in
  local mode.
- Repo `rdawsonsdp/chatham-culinary-path` (private).

**Not yet done — in order**
1. **Deploy.** Held deliberately for a separate go-ahead. `vercel deploy --yes`
   from this directory; Vercel will alias the first deployment to production.
2. **Connect a Blob store and set `ADMIN_PASSWORD`** (see *Admin*). Until then
   the production admin can't save.
3. **Run the verification checklist** from the `gci-restaurant-template`
   skill: overflow at 390/1280, console/hydration, every image rendering.
4. **Copy pass.** The hero and corridor blurbs are working copy in GCI's voice.
   Worth a read by GCI before launch; the `storybrand` skill applies.
5. Set `NEXT_PUBLIC_SITE_URL` when a real domain is chosen.

**Known issues on the underlying sites**
- **herbachi.com's SSL certificate expired 2026-08-11.** Visitors who tap
  Visit get a browser warning until HerBachi's host renews it.
  herbachi.vercel.app is up if the card should point there meanwhile.
- **Lem's site publishes no structured data**, so its card can't update
  itself. Adding the template's JSON-LD to that site would fix it.
- Uncle John's neighborhood reads "Greater Grand Crossing"; at 8249 S Cottage
  Grove that's likely wrong. Dat Donut next door is listed as Chatham.
- Carried from their builds: Uncle John's hours contradiction, Just Jerk's
  three-way closing time, Soul Veg's one unpriced item.
