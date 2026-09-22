# Discovery redesign — inherited design record

> **This is the Greater Chatham Culinary Trail's design review, kept because it
> is why the interface looks the way it does.** The structure it describes —
> the hero search, the food rail, the corridor cards, the filter model — is
> what the Bellwood Culinary Path is built on, and is still accurate. The
> **colours in it are not**: every crimson `#BF1E2D` here is Bellwood blue
> `#0055A5` in this repo, and every orange `#F26927` is Bellwood gold
> `#FDB813`. See `app/globals.css` for the palette that actually ships.

## Original review

Reviewed September 14, 2026.

## Reference and interpretation

Vrbo's homepage makes a structured search the primary action, follows it with confidence-building information, and offers photographic collections. Its Chicago destination page repeats a consistent photo/name/location/key-facts hierarchy. Its Trip Planner uses heart actions to save places for later comparison.

Sources: [Vrbo homepage](https://www.vrbo.com/), [Chicago destination](https://www.vrbo.com/vacation-rentals/usa/illinois/chicago), [Trip Planner](https://www.vrbo.com/why/trip-planning).

The direct browser request to Vrbo returned a rate-limit page. This review uses accessible page content and official planning documentation; it is not a pixel-by-pixel reproduction of Vrbo's current interface. Chatham's production page was inspected at desktop and mobile widths.

## Design plan

- Palette: white #FFFFFF, navy #172B45 for public-page headings, GCI crimson #BF1E2D for primary actions, orange #F26927 for small accents, pale slate #F3F6F8 for utility surfaces, gray #566273 for supporting text. Preserve existing GCI logo and admin tokens.
- Type: the existing self-hosted Figtree; 700–800 display weights, 600 utility labels, 400 body. Large white hero heading, quieter navy section headings. Sentence case.
- Layout: 1280px centered content, a photographic hero containing a structured search panel, horizontal food collections, a compact filter toolbar, consistent kitchen cards, a neighborhood guide, and the existing dated updates.
- Alignment: left-aligned copy and card details. Only small icon controls are centered.
- Character: actual South Side restaurants and neighborhood photography are the memorable element. GCI identity remains visible; Vrbo supplies discovery patterns rather than a copied identity.

```text
GCI / Chatham Culinary Path      Explore  Neighborhoods  Updates  Saved
[ Neighborhood photograph / headline                                ]
[ Dish or kitchen             Area                 Search kitchens  ]
Local curation                Useful hours          Save your stops
Browse by craving             [photographic category rail]
Explore the kitchens          [Open now / Dining / Filters / Saved]
[photo / heart] [photo / heart] [photo / heart] [photo / heart]
[status/name/address/signature dishes/actions in a repeated order]
Get to know the neighborhood  [photo] [four area choices]
Latest from the path          [existing dated announcements]
GCI / useful links / factual hours disclosure
```

## Decisions before implementation

A generic travel-site copy would introduce dates, guest counts, invented ratings, or booking flows. None belongs in this restaurant directory. Search is adapted to dishes and streets; restaurant data supplies hours, cuisine, signature dishes and addresses. Saves live on the visitor's device and do not imply accounts or reservations. Food collections use current published restaurants, not separate duplicate listings. Filter state is shareable in the URL. Keep existing content editing, live-site fallback, and admin authentication intact.

## Intended interactions

Search by kitchen, dish, address or neighborhood; combine corridor, cuisine, meal, dining and open-now filters; clear individual or all filters; sort; save/remove kitchens and retrieve them on the same device; browse food or neighborhood collections; open each restaurant's site, phone and map. Mobile uses native horizontal collection scrolling and a compact filter dialog with keyboard and focus support.

## Implementation and validation

- Public styling is scoped to the discovery interface; existing admin and content-store code is unchanged.
- Existing photography, published restaurant entries, live-hours resolution, and fallback schedules drive the interface. No reviews, prices, or availability were invented.
- Added eight passing Node tests for combined filters, unconfirmed dining, text search, saved IDs, sorting, and URL parsing/round trips.
- Browser checks at 320, 390, 768, 1024, and 1440px: no horizontal overflow, no page errors, working dialogs and images.
- Exercised hero search, zero results, clearing filters, saved/unsaved state and reload persistence, browser Back, filter apply/cancel, sorting, food collections, area choices, detail hours, and mobile navigation.
- Confirmed `/admin` continues to redirect unauthenticated visitors to `/admin/login`. No admin credentials or live content were changed.
- Vrbo’s saved-trips pattern is adapted to a device-local kitchen list. Search URLs can be shared; saved lists are private to each device.
- Production build passed, including TypeScript. Production browser smoke checks decoded every photo and confirmed URL restoration, filters, and mobile layouts.
- Baseline dependency audit: three existing advisories (Next.js: critical; transitive PostCSS and sharp: high). Package versions and the lockfile were not changed by this redesign. Address these advisories as a separate dependency update before publishing.
