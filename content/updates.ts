/* ===== Updates =====
 * A dated feed, newest first. Like restaurants.ts this is the SEED: once
 * someone saves in /admin, the live copy lives in the content store. Dates
 * are ISO so they sort and format without ambiguity.
 *
 * PROTOTYPE CONTENT. Every item below is sourced from something already
 * public — a press report, or the Village of Bellwood's own site. Nothing here
 * quotes Mayor Harvey or announces a Village decision; anything of that kind
 * has to come from the Mayor's office before it is published. */
export interface Update {
  id: string;
  date: string;
  title: string;
  body: string;
  href?: string;
  tag: "New on the path" | "Event" | "Village news" | "Announcement";
}

export const UPDATE_TAGS: Update["tag"][] = ["New on the path", "Event", "Village news", "Announcement"];

export const UPDATES: Update[] = [
  { id: "2026-09-22-launch", date: "2026-09-22", tag: "Announcement", title: "Twenty Bellwood kitchens, on one path",
    body: "The Bellwood Culinary Path opens with twenty locally owned restaurants across four corridors — St. Charles Road, Mannheim, Bellwood Avenue, and 25th at Butterfield. No chains. Every stop is a Bellwood business with a Bellwood address." },
  { id: "2026-09-04-varis", date: "2026-09-04", tag: "New on the path", title: "Vari's Southern Cuisine is coming to 2712 St. Charles Road",
    body: "Nanetta Dancy-Matthews is opening a second Vari's in downtown Bellwood, bringing the fried ribs, catfish filet, oxtail and lamb her Hillside dining room is known for. She is aiming for late October.",
    href: "https://whatnow.com/chicago/restaurants/local-restaurateur-bringing-second-southern-cuisine-spot-to-bellwood/" },
  { id: "2026-09-01-gateway", date: "2026-09-01", tag: "Village news", title: "The Gateway Project is rebuilding downtown Bellwood",
    body: "The $42.5 million Bellwood Gateway Project is reshaping St. Charles Road — the same stretch that carries seven of the twenty stops on this path, from Gioacchino's at 5201 down to Shark's at 2500.",
    href: "https://www.vil.bellwood.il.us/" },
  { id: "2026-08-15-since-1977", date: "2026-08-15", tag: "New on the path", title: "Two Bellwood kitchens older than most of the village's businesses",
    body: "Gioacchino's has been serving thin crust and Chicken Vesuvio at 5201 St. Charles Road since 1977. Lezza Spumoni, four blocks east at 4009, dates itself to 1904 — it has been making Bellwood's spumoni longer than the Eisenhower has existed.",
    href: "https://lezza.com" },
];
