# Bellwood Culinary Path

A Village of Bellwood prototype: the food businesses of Bellwood, Illinois as
one trail, for people discovering the village for the first time.

**This is a prototype.** It is the Greater Chatham Culinary Trail's structure,
rebranded to Bellwood and repopulated with twenty Bellwood restaurants, built
to show Mayor Harvey's office what a village culinary trail looks like when it
is real rather than a mockup. It does not replace or affect the Greater Chatham
Culinary Trail, which lives on in its own repository.

Read [docs/bellwood-stops.md](docs/bellwood-stops.md) before showing this to
anyone: it lists where every stop's data came from, which hours are still
guesses, and the fourteen phone calls that would make the roster solid.

## The twenty stops

Every stop is an independently owned food business with a Bellwood, IL 60104
address. No chains. They group onto four corridors:

- **St. Charles Road** (7) — downtown Bellwood. Gioacchino's, Taqueria Mi
  Jerez, MD Phats, Lezza Spumoni, Vari's Southern Cuisine, Joe's Hideaway,
  Shark's Fish & Chicken.
- **Mannheim Road** (6) — Stacy's Cafe, Ariston, Nick's Pizza & Beef, Mickey's
  Drive-In, First Chop Suey, JJ Fish & Chicken.
- **Bellwood Avenue** (3) — Montego Bay, Tastee Rolls, Bellwood Sweets.
- **25th Avenue & Butterfield** (4) — Captain B's, Donnie's Bar & Grill, Taco
  Patio, Mr. Submarine.

The roster came from the Village's own business directory, cross-checked
against each business's site and listings. Sources are in
[docs/bellwood-stops.md](docs/bellwood-stops.md).

## Discovery experience

- Structured hero search for a dish, cuisine, kitchen, or street.
- Food collections and four corridor choices.
- Kitchen cards with open status, location, save actions, and in-page details.
- Combined food, corridor, dining, meal, and open-now filters, with sorting and
  shareable URL state.
- Saved kitchens persist on the visitor's device. No account or booking service
  is implied.
- Native accessible dialogs for filters and restaurant details, compact mobile
  controls, and horizontal food browsing.
- Admin at `/admin` — edit every stop, add or hide stops, change card photos,
  and post to the Updates feed.

### Local checks

`npm ci`, `npm test`, `npm run build`, then `npm run dev -- --port 3002`. The
tests use the project's own TypeScript compiler and the Node test runner; no
extra dependency is needed.

## Brand

The palette is the Village of Bellwood's, sampled pixel-for-pixel from the
logo files served on vil.bellwood.il.us — not guessed, and not matched by eye.
The village logo is exactly two colours, and those two are the whole palette:

| Token | Value | Contrast on white | Role |
|---|---|---|---|
| `--color-blue` | `#0055a5` | **7.39:1** | Body text, links, headings, button fills (white labels, also 7.39:1) |
| `--color-blue-dark` | `#003f7d` | 10.46:1 | Hover, pressed, card headings |
| `--color-gold` | `#fdb813` | 1.74:1 | **Fill only.** Dark ink on it is 10.72:1; it never takes a white label |
| `--color-gold-ink` | `#8a5a00` | 5.93:1 | Small gold words on a light ground |

The village blue is unusually dark for a brand blue, which is a gift: it
carries small text as well as button fills, so the interface needs only one
accent rung rather than the fill/text split GCI's orange required. The gold
follows the same discipline GCI's orange did — a fill, at display size, with
dark labels.

Type is Figtree throughout, loaded via `next/font`. The village motto is *Your
Family Is Our Future*.

### Art

**There are no photographs in this repo.** The hero and the card fallbacks are
drawn marks in the village's two colours, generated so that nothing on the page
claims to be a picture of a Bellwood block it isn't. The single biggest visual
upgrade available is twenty storefront photographs, uploaded through `/admin`.

## Stack

Next.js 16 · React 19 · Tailwind v4 · App Router · TypeScript. One dependency
beyond next/react: `@vercel/blob`, where the admin saves. No database, no
search service — twenty entries do not need one.

## How the cards stay current

A card is the stored stop (`content/`, or the Blob store once someone has saved
in the admin), overlaid with what the restaurant's own site publishes right
now. For stops marked `liveDetails` ("Read hours, phone and address live from
this website" in the admin), `app/lib/site-data.ts` fetches the site's home
page at request time, cached ten minutes, and reads its schema.org JSON-LD:
hours, phone and address.

**No Bellwood stop qualifies yet.** Sixteen of the twenty have no website at
all, and the four that do publish no structured data, so today every card is
served entirely from the stored values. That is the gap this prototype exists
to argue about — see the last section of
[docs/bellwood-stops.md](docs/bellwood-stops.md).

The photo, name, tagline and tags are editorial and set in the admin. The photo
picker lists every image on the restaurant's home page, so "use the picture
from their site" is one click for the four stops that have one.

## Admin

`/admin`, one shared password from the `ADMIN_PASSWORD` environment variable,
which is never in the code or the repo. Locally it lives in `.env.local`. A
login lasts twelve hours; changing the password signs everyone out.

The dashboard checks every stop's site as it loads: up, SSL problems, and
whether the card is getting live details. **Refresh all sites now** drops the
ten-minute cache so every card re-reads its site.

A stop may be saved with **no website and no photo** — that is the normal
starting condition in Bellwood, and the card falls back to its name plate
rather than borrowing a picture of somewhere else.

**Where saves go** (`app/lib/content-store.ts`):

| Where it's running | Storage | Notes |
|---|---|---|
| Vercel, Blob store connected | Vercel Blob | One JSON document for all content, plus photo files. Saves carry the version they were made against, so two people saving at once get "reload and try again" instead of a silent overwrite. |
| Your machine, no Blob token | `.content/` and `public/uploads/` | Git-ignored. Lets you try the admin without touching production. |
| Vercel, no store connected | none | The trail serves the seed in `content/`; the admin says it can't save. |

Until the first save, the trail serves the seed files in `content/`. After that
the Blob copy is the truth and `content/` is only the starting point.

**To turn it on in production:** in the Vercel project, create a Blob store
(Storage → Blob, **public** access) and connect it to the project, which sets
`BLOB_READ_WRITE_TOKEN`. Then add `ADMIN_PASSWORD` under Settings →
Environment Variables and redeploy.

## What changed from the Chatham build

Structure, components, filter model, admin and tests are all carried over
unchanged in shape. What is Bellwood's:

- **Palette** — blue and gold from the village logo, replacing GCI's crimson,
  orange and gold. All hardcoded brand hexes in the CSS were replaced, and the
  Tailwind tokens renamed (`crimson`→`blue`, `orange`→`gold`, `cream`→`mist`,
  `warm-gray`→`muted`) rather than left with misleading names.
- **Corridors** — `st-charles` / `mannheim` / `bellwood-ave` /
  `butterfield-25th`, replacing 75th / 79th / Cottage Grove / beyond. The
  "beyond" special case in `StopCard` is gone: every Bellwood stop has a real
  corridor.
- **Twenty stops** replacing thirteen, with new food categories.
- **`builtByGci` renamed `liveDetails`** — the field was always about
  structured data, not about who built the site.
- **Website and photo are now optional** on a stop, in the data, the admin
  validation and the rendered cards. In Chatham every stop had both; in
  Bellwood almost none do.
- **The Google-reviews address matcher was fixed.** It folded *Street*→*St* and
  *Avenue*→*Ave* but not *Road*→*Rd* or *Saint*→*St*, so all seven St. Charles
  Road stops would have failed to match their own Google listing. It now folds
  the full set of street types. This was a latent bug in Chatham too; it just
  never fired there.

## Next steps

1. **Make the calls** in [docs/bellwood-stops.md](docs/bellwood-stops.md).
   Thirteen stops have placeholder hours and two have no phone number.
2. **Photograph the twenty storefronts.**
3. **Copy pass with the Mayor's office.** The taglines and corridor blurbs are
   working copy. Nothing in the repo quotes Mayor Harvey or announces a Village
   decision, and nothing should until his office writes it.
4. **Deploy.** `vercel deploy --yes` from this directory.
5. **Connect a Blob store and set `ADMIN_PASSWORD`** (see *Admin*).
6. Set `NEXT_PUBLIC_SITE_URL` when a domain is chosen.
