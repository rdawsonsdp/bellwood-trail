# The twenty stops — sources, and what still needs a phone call

The roster in `content/restaurants.ts` was assembled on **2026-09-22**. This is
where each field came from, and which fields are still guesses.

## How the roster was chosen

Start point was the **Village of Bellwood's own business directory**
([vil.bellwood.il.us/business/bellwood-businesses/](https://www.vil.bellwood.il.us/business/bellwood-businesses/)),
filtered to rows the Village itself categorises as food service. That gave 24
rows, of which five are national chains (Burger King, McDonald's, two Dunkin'
locations, Subway) and two are industrial food businesses rather than places
you eat (Ferrara Candy on Washington Boulevard, Campagna-Turano's bakery plant
on Roosevelt). The rest were cross-checked against each business's own website
where it has one, and against its public listings where it does not.

Four stops are **not** in the Village directory and were added from other
public sources: MD Phats, Joe's Hideaway, Bellwood Sweets, and Donnie's Bar &
Grill. Vari's Southern Cuisine was added from a September 2026 press report and
has not opened yet.

Businesses deliberately left off:

| Not included | Why |
|---|---|
| Burger King, McDonald's, Dunkin' ×2, Subway | National chains. This is a trail of Bellwood's own kitchens. |
| Ferrara Candy, Campagna-Turano Bakery | Manufacturing plants, not places to eat. |
| Pitbull Ribs (5020-A St. Charles Rd) | In the Village directory, but its Yelp listing is marked closed. **Worth one call** — if it is trading, it belongs on the trail and would make 21. |
| Lawrence's Fish & Shrimp, See Thru Chinese Kitchen | Both are **Hillside**, not Bellwood, despite turning up in "Bellwood restaurants" searches. |
| Mama Rose Meats (1043 25th Ave) | A butcher, not a restaurant. A good candidate if the trail ever widens to food retail. |

## Per-stop data confidence

**Hours are the weak field.** Seven stops publish them; thirteen do not. Where
they do not, `content/restaurants.ts` carries a plausible placeholder marked
`UNVERIFIED` in a comment, and the card's *Open now* chip will be wrong until
someone calls.

| Stop | Address | Phone | Hours | Website |
|---|---|---|---|---|
| Gioacchino's Ristorante & Pizzeria | 5201 St Charles Rd | ✅ | ⚠️ one day only | ✅ own site |
| Taqueria Mi Jerez | 5003 St Charles Rd | ✅ | ✅ 9–6 daily | ✗ |
| MD Phats | 4310 St Charles Rd | ✅ | ❌ placeholder | ✗ |
| Lezza Spumoni & Desserts | 4009 St Charles Rd | ✅ | ❌ placeholder | ✅ lezza.com |
| Vari's Southern Cuisine | 2712 St Charles Rd | ✗ | ⚠️ published, not open yet | ✗ |
| Joe's Hideaway | 2601 St Charles Rd | ✅ | ❌ placeholder | ✗ |
| Shark's Fish & Chicken | 2500 St Charles Rd | ✅ | ✅ three sources agree | ✗ |
| Stacy's Cafe | 845 Mannheim Rd | ✅ | ✅ | ✗ |
| Ariston Restaurant | 919 Mannheim Rd | ✅ | ✅ | ✅ aristongyros.com |
| Nick's Pizza & Beef | 815 Mannheim Rd | ✅ | ❌ placeholder | ✅ nickspizzabeef.com |
| Mickey's Drive-In | 635 Mannheim Rd | ✅ | ✅ | ✗ |
| First Chop Suey | 530 Mannheim Rd | ✅ | ❌ placeholder | ✗ |
| JJ Fish & Chicken | 528 Mannheim Rd | ✅ | ❌ placeholder | ✗ |
| Montego Bay Restaurant & Grill | 700 Bellwood Ave | ✅ | ✅ two sources, Monday disputed | ✗ |
| Tastee Rolls | 633 Bellwood Ave | ✅ | ❌ delivery-listing hours only | ✅ tasteerolls.com |
| Bellwood Sweets | 706 Bellwood Ave | ❌ unknown | ❌ placeholder | ✗ |
| Captain B's Shrimp House | 445 25th Ave | ✅ | ❌ placeholder | ✗ |
| Donnie's Bar & Grill | 466 25th Ave | ❌ unknown | ❌ placeholder | ✗ |
| Taco Patio | 4018 Butterfield Rd | ✅ | ✅ | ✅ tacopatio.com |
| Mr. Submarine | 4019 Butterfield Rd | ✅ | ❌ placeholder | ✗ |

## The call sheet

Thirteen calls, in the order that most improves the demo. Each one is a
two-minute call, and every answer goes straight into `/admin`.

1. **Bellwood Sweets** (no phone, no hours) — confirm it is still trading at all.
2. **Donnie's Bar & Grill** (no phone, no hours).
3. **Pitbull Ribs**, (708) 240-4067 — open or closed? If open, add it.
4. **Vari's Southern Cuisine** — opening date, and hide the stop until then.
5. **MD Phats**, (708) 493-1100.
6. **Nick's Pizza & Beef**, (708) 493-2200.
7. **JJ Fish & Chicken**, (708) 544-0505.
8. **First Chop Suey**, (708) 544-7900.
9. **Captain B's Shrimp House**, (708) 544-6900.
10. **Mr. Submarine**, (708) 544-1007.
11. **Tastee Rolls**, (773) 865-7526.
12. **Lezza Spumoni**, (708) 547-5969 — retail counter hours, and confirm the 1904 founding date before it goes on a sign.
13. **Gioacchino's**, (708) 544-0380 — the full week, and whether it keeps a closed day.
14. **Montego Bay**, (708) 547-7911 — is it open Mondays? One review says no, its own listing says yes.

## Coordinates

Every address was run through the **US Census geocoder**
(`geocoding.geo.census.gov`, Public_AR_Current benchmark). Seventeen matched
exactly. Four did not, and are handled as follows:

- **5201 St Charles Rd** — the geocoder places it in **Berkeley**
  (41.889075, −87.897908). The restaurant, the Village directory and the
  Bellwood Chamber all give its address as Bellwood 60104; it sits on the
  municipal line. Coordinate used as returned.
- **2500 St Charles Rd** — no match. Interpolated along St. Charles between
  the geocoded 2601 and 2712, at the 25th Avenue corner its own listing names.
- **700 Bellwood Ave** — no match. Interpolated from 706 Bellwood Ave next door.
- **4019 Butterfield Rd** — no match. Interpolated from 4018 Butterfield across
  the street.

The four interpolated pins are good to roughly a building's width, which is
fine for a map at village zoom and should still be nudged in `/admin` before
launch.

## Photographs

**There are none.** Every card currently shows its name on the village blue
with a gold rule, because borrowing a photograph of somewhere else would be
worse than showing no photograph. Twenty storefront photos is the single
biggest visual upgrade available, and the admin photo picker will pull one
straight off a business's website for the four stops that have one.

## What this prototype is arguing

Sixteen of the twenty have **no website at all**. Of the four that do, **none**
publish structured hours, so no card on this trail can update itself yet —
compare the Chatham build, where eight GCI-template sites fed their own cards
live. That gap is the case for the digital-storefront work: the trail is the
shop window, and right now Bellwood's kitchens have nothing behind the glass
for it to read.
