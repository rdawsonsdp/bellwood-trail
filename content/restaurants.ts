/* ===== The Culinary Path =====
 * One entry per stop. This file is the SEED: the trail starts from it, and
 * once someone saves in /admin the live copy lives in the content store
 * (app/lib/content-store.ts) and this file is no longer read.
 *
 * Every address, phone and schedule below was taken from the business's own
 * site. `builtByGci` marks sites built on the GCI template, which publish
 * schema.org hours, phone and address — the cards read those live at request
 * time and fall back to the values here only if the fetch fails. External
 * sites have no usable structured data, so the values here ARE their source
 * and are transcribed from what they publish. */

/** [open, close] in minutes past midnight, America/Chicago; null = closed. Index 0 = Sunday. */
export type DayHours = readonly [number, number] | null;
const h = (hr: number, min = 0) => hr * 60 + min;

export type Meal = "breakfast" | "lunch" | "dinner";

export interface Restaurant {
  slug: string;
  name: string;
  tagline: string;
  cuisine: string[];
  signature: string[];
  neighborhood: string;
  address: string;
  phone: string;
  phoneHref: string;
  site: string;
  /** Read hours, phone and address live from `site` (GCI template sites publish them). */
  builtByGci: boolean;
  /** Card photo: a /public path without extension (resolved on the server), a
   *  path with one, or a full URL (photos saved from /admin). */
  image: string;
  /** What the card photo shows, for screen readers. Defaults to the first signature dish. */
  imageAlt?: string;
  since?: string;
  schedule: DayHours[];
  lat?: number;
  lng?: number;
  /** Kept in the content but left off the trail. */
  hidden?: boolean;
  /** Which corridor the stop sits on — drives the trail grouping. */
  corridor: "75th" | "79th" | "cottage-grove" | "beyond";
  /** Seats to eat in (true) or carryout only (false) — the Dining pills. From
   *  the business's own site where it says, otherwise its public listings.
   *  Leave unset if unconfirmed: the stop then matches neither pill. */
  dineIn?: boolean;
  /** Meals it is a real option for — the Meal pills. Breakfast = it advertises
   *  a breakfast menu. Lunch / dinner = it serves full meals and is open at
   *  noon / past 6 PM. Bakeries and dessert shops carry none. */
  meals: Meal[];
}

export const RESTAURANTS: Restaurant[] = [
  {
    slug: "park-manor-75", name: "Park Manor 75",
    tagline: "Wine, charcuterie, and Chicago-inspired fatbreads on 75th.",
    cuisine: ["Wine Bar", "Charcuterie", "Small Plates"],
    signature: ["Chef’s Choice Charcuterie", "The Park Manor Fatbread", "The Pilsen Fatbread", "Collard Green Dip", "Craft Cocktails"],
    neighborhood: "Greater Grand Crossing", address: "600 E 75th St, Chicago, IL 60619",
    phone: "(773) 919-3986", phoneHref: "tel:+17739193986",
    site: "https://parkmanor75.com", builtByGci: false,
    image: "/images/restaurants/park-manor-75.jpg",
    imageAlt: "Screenshot of Park Manor 75’s teal logo and patterned artwork on its website",
    // Official website hours, checked 2026-09-16. Friday and Saturday close at 1 AM the next day.
    // Phone/neighborhood: Choose Chicago. Coordinates: Census address geocoder.
    // Sources and screenshot capture are documented in docs/park-manor-75.md.
    schedule: [[h(13),h(20)],null,null,[h(14),h(22)],[h(14),h(23)],[h(14),h(25)],[h(14),h(25)]],
    dineIn: true, meals: ["dinner"],
    lat: 41.758546461524, lng: -87.610178959674, corridor: "75th",
  },
  {
    slug: "harolds", name: "Harold's Chicken #24",
    tagline: "Fried fresh. Mild sauce mandatory.",
    cuisine: ["Fried Chicken", "Soul Food"], signature: ["Wings", "Half Chicken", "Mild Sauce", "Fish & Shrimp", "Gizzards"],
    neighborhood: "Chatham", address: "407 E 75th St, Chicago, IL 60619",
    phone: "(773) 488-9533", phoneHref: "tel:+17734889533",
    site: "https://harolds.vercel.app", builtByGci: true, image: "/images/restaurants/harolds",
    schedule: [[h(11),h(25)],[h(11),h(25)],[h(11),h(25)],[h(11),h(25)],[h(11),h(25)],[h(11),h(26)],[h(11),h(26)]],
    meals: ["lunch", "dinner"],
    lat: 41.7587, lng: -87.6149, corridor: "75th",
  },
  {
    slug: "soulveg", name: "Soul Veg City",
    tagline: "Vegan soul food, since the beginning.",
    cuisine: ["Vegan", "Soul Food"], signature: ["Cauliflower Wings", "Jerk Nachos", "Kale Greens", "Italian V", "Smoothies"],
    neighborhood: "Chatham", address: "203 E 75th St, Chicago, IL 60619",
    phone: "(773) 224-0104", phoneHref: "tel:+17732240104",
    site: "https://soulveg.vercel.app", builtByGci: true, image: "/images/restaurants/soulveg",
    schedule: [[h(10),h(18)],[h(9),h(17)],[h(9),h(17)],[h(11),h(18)],[h(11),h(18)],[h(11),h(18)],[h(10),h(18)]],
    dineIn: true, meals: ["lunch"],
    lat: 41.7587, lng: -87.6215, corridor: "75th",
  },
  {
    slug: "brownsugar", name: "Brown Sugar Bakery",
    tagline: "Caramel cake that made 75th Street famous.",
    cuisine: ["Bakery", "Cakes", "Candy"], signature: ["Caramel Cake", "German Chocolate", "Sweet Potato Cake", "Life Is Sweet Candy"],
    neighborhood: "Chatham", address: "328 E 75th St, Chicago, IL 60619",
    phone: "(773) 570-7676", phoneHref: "tel:+17735707676",
    site: "https://www.brownsugarbakerychicago.com", builtByGci: false, image: "/images/restaurants/brownsugar",
    since: "2004",
    schedule: [[h(12),h(17)],[h(10),h(18)],[h(10),h(18)],[h(10),h(18)],[h(10),h(18)],[h(10),h(18)],[h(10),h(18)]],
    // Carryout only: counter service, no seating (its FAQ; The Infatuation, 2023).
    dineIn: false, meals: [],
    lat: 41.7586, lng: -87.6181, corridor: "75th",
  },
  {
    slug: "lemsbbq", name: "Lem's Bar-B-Q",
    tagline: "BBQ as God meant it to be. Since 1954.",
    cuisine: ["Barbecue", "Rib Tips"], signature: ["Rib Tips", "Hot Links", "Ribs", "Fried Chicken", "Shrimp"],
    neighborhood: "Chatham", address: "311 E 75th St, Chicago, IL 60619",
    phone: "(773) 994-2428", phoneHref: "tel:+17739942428",
    site: "https://lemsbbq.vercel.app", builtByGci: true, image: "/images/restaurants/lemsbbq",
    imageAlt: "Lem's green and red Bar-B-Q marquee sign on 75th Street",
    since: "1954",
    // Its site publishes no structured hours, so this schedule drives the chip.
    // Closed Tuesdays — matches lemsbbq.vercel.app as of 2026-09-10.
    schedule: [[h(12),h(22)],[h(12),h(22)],null,[h(12),h(22)],[h(12),h(22)],[h(12),h(23)],[h(12),h(23)]],
    // Carryout only: "doesn't offer indoor dining. Never has." (Resy, 2022).
    dineIn: false, meals: ["lunch", "dinner"],
    lat: 41.7586, lng: -87.6186, corridor: "75th",
  },
  {
    slug: "mabes", name: "Mabe's Sandwich Shop",
    tagline: "Hot off the press, made to order.",
    cuisine: ["Sandwiches", "Salads", "Breakfast"], signature: ["DJ's Jerk Turkey Panini", "Double Decker Turkey Club", "Turkey Cristo", "French Toast Breakfast Sandwich"],
    neighborhood: "Chatham", address: "312 E 75th St, Chicago, IL 60619",
    phone: "(773) 891-1798", phoneHref: "tel:+17738911798",
    site: "https://www.mabessandwich.com", builtByGci: true, image: "/images/restaurants/mabes",
    schedule: [null,[h(10),h(16)],[h(9),h(16)],[h(9),h(16)],[h(9),h(16)],[h(10),h(17)],[h(10),h(15)]],
    meals: ["breakfast", "lunch"],
    lat: 41.7587, lng: -87.6156, corridor: "75th",
  },
  {
    slug: "just-jerk", name: "Just Jerk Cafe",
    tagline: "Jerk chicken, oxtails & curry goat on 79th.",
    cuisine: ["Jamaican", "Caribbean"], signature: ["Jerk Chicken", "Oxtails", "Curry Goat", "Jerk Wings", "Rice & Peas"],
    neighborhood: "Chatham", address: "119 E 79th St, Chicago, IL 60619",
    phone: "(773) 846-2232", phoneHref: "tel:+17738462232",
    site: "https://just-jerk.vercel.app", builtByGci: true, image: "/images/restaurants/just-jerk",
    schedule: [null,[h(11,30),h(22)],[h(11,30),h(22)],[h(11,30),h(22)],[h(11,30),h(22)],[h(11,30),h(23)],[h(11,30),h(22)]],
    dineIn: true, meals: ["lunch", "dinner"],
    lat: 41.7513, lng: -87.6210, corridor: "79th",
  },
  {
    slug: "herbachi", name: "HerBachi",
    tagline: "Modern Asian fusion. Fierce flavors. Chicago fire.",
    cuisine: ["Hibachi", "Asian Fusion"], signature: ["Hibachi Bowl", "Fried Korean Wings", "Bang Bang Salmon", "Gold Reserve"],
    neighborhood: "Chatham", address: "522 E 79th St, Chicago, IL 60619",
    phone: "(872) 303-3100", phoneHref: "tel:+18723033100",
    // Links to HerBachi's own WordPress site, which publishes no structured
    // hours, so `schedule` is the source — matches herbachi.com as of 2026-09-10.
    site: "https://herbachi.com", builtByGci: false, image: "/images/restaurants/herbachi",
    schedule: [[h(11),h(20)],null,[h(11),h(20)],[h(11),h(20)],[h(11),h(20)],[h(11),h(20)],[h(11),h(20)]],
    // dineIn unset: its site says pickup and delivery, but a 2026 video says it
    // added a dine-in area. Confirm by phone before setting.
    meals: ["lunch", "dinner"],
    lat: 41.7509, lng: -87.6072, corridor: "79th",
  },
  {
    slug: "tropic-island", name: "Tropic Island Jerk Chicken",
    tagline: "Chicago's original jerk, since 1993.",
    cuisine: ["Jamaican", "Caribbean"], signature: ["Jerk Chicken", "Oxtails", "Curry Goat", "Jerk Tacos", "Plantains"],
    neighborhood: "Chatham", address: "553 E 79th St, Chicago, IL 60619",
    phone: "(773) 224-7766", phoneHref: "tel:+17732247766",
    site: "https://tropic-island.vercel.app", builtByGci: true, image: "/images/restaurants/tropic-island",
    since: "1993",
    // Its site lists three locations; these are the 79th Street hours.
    schedule: [null,[h(10),h(20)],[h(10),h(20)],null,[h(10),h(20)],[h(10),h(20)],[h(10),h(20)]],
    meals: ["lunch", "dinner"],
    lat: 41.7510, lng: -87.6062, corridor: "79th",
  },
  {
    slug: "hareshrimp", name: "Haire's Gulf Shrimp",
    tagline: "It started in a train caboose. It's the bomb.",
    cuisine: ["Seafood", "Louisiana", "Fried Shrimp"], signature: ["Shrimp Bomb Bag", "Shrimp Dinner", "Shrimp Po' Boy"],
    neighborhood: "Greater Grand Crossing", address: "7448 S Vincennes Ave, Chicago, IL 60620",
    phone: "(773) 783-1818", phoneHref: "tel:+17737831818",
    site: "https://hareshrimp.vercel.app", builtByGci: true, image: "/images/restaurants/hareshrimp",
    since: "1980s",
    schedule: [[h(12),h(17)],[h(11),h(20)],[h(11),h(20)],[h(11),h(20)],[h(11),h(20)],[h(11),h(22)],[h(11),h(22)]],
    // Carryout only: no indoor seating (public listings, 2026).
    dineIn: false, meals: ["lunch", "dinner"],
    lat: 41.7594, lng: -87.6382, corridor: "beyond",
  },
  {
    slug: "dat-hoagy-shoppe", name: "Dat Hoagy Shoppe",
    tagline: "Steak hoagies, sweet or hot, inside Dat Donut.",
    cuisine: ["Sandwiches", "Cheesesteak", "Italian Beef"],
    signature: ["Steak Hoagie", "The Greedy", "Turkey Hoagie", "Italian Beef", "Fries with House Sauce"],
    neighborhood: "Chatham", address: "8251 S Cottage Grove Ave, Chicago, IL 60619",
    phone: "(773) 723-1002", phoneHref: "tel:+17737231002",
    site: "https://dat-hoagy-shoppe.vercel.app", builtByGci: true,
    image: "/images/restaurants/dat-hoagy-shoppe.jpeg",
    imageAlt: "Dat Hoagy Shoppe deli and turkey hoagies with pickles, onion and tomato, beside a steak sandwich with peppers",
    // Published by the shop's website; the sandwich counter has its own hours.
    schedule: Array.from({ length: 7 }, () => [h(9), h(20,30)] as const),
    meals: ["lunch", "dinner"],
    lat: 41.7449, lng: -87.6046, corridor: "cottage-grove",
  },
  {
    slug: "datdonut", name: "Dat Donut",
    tagline: "Home of the famous Big DAT Donut.",
    cuisine: ["Donuts", "Bakery", "Breakfast"], signature: ["Big DAT Donut", "Apple Fritter", "Breakfast Sandwich", "Glazed"],
    neighborhood: "Chatham", address: "8251 S Cottage Grove Ave, Chicago, IL 60619",
    phone: "(773) 723-1002", phoneHref: "tel:+17737231002",
    site: "https://datdonut.vercel.app", builtByGci: true, image: "/images/restaurants/datdonut",
    schedule: [[h(9),h(16)],[h(5,30),h(21)],[h(5,30),h(21)],[h(5,30),h(21)],[h(5,30),h(21)],[h(5,30),h(21)],[h(6),h(21)]],
    dineIn: true, meals: ["breakfast"],
    lat: 41.7449, lng: -87.6046, corridor: "cottage-grove",
  },
  {
    slug: "owi", name: "Oooh Wee! IT IS",
    tagline: "Old-school soul food and a Southern breakfast bar.",
    cuisine: ["Soul Food", "Breakfast"], signature: ["Smothered Potatoes", "Shrimp Dinner", "Breakfast Bar", "Cereal Bar"],
    neighborhood: "Chatham", address: "8548 S Cottage Grove Ave, Chicago, IL 60619",
    phone: "(773) 966-4435", phoneHref: "tel:+17739664435",
    site: "https://owi.vercel.app", builtByGci: true, image: "/images/restaurants/owi",
    imageAlt: "The Oooh Wee! IT IS dining room — yellow walls, black tufted booths and gold ring-back chairs",
    schedule: [[h(8),h(21)],null,[h(8),h(21)],[h(8),h(21)],[h(8),h(21)],[h(8),h(21)],[h(8),h(21)]],
    dineIn: true, meals: ["breakfast", "lunch", "dinner"],
    lat: 41.7395, lng: -87.6046, corridor: "cottage-grove",
  },
  {
    slug: "unclejohns", name: "Uncle John's Barbecue",
    tagline: "Rib tips, hot links and the aquarium smoker.",
    cuisine: ["Barbecue", "Soul Food"], signature: ["Rib Tips", "Hot Links", "Fried Chicken", "Full Slab"],
    neighborhood: "Greater Grand Crossing", address: "8249 S Cottage Grove Ave, Chicago, IL 60619",
    phone: "", phoneHref: "",
    site: "https://unclejohns.vercel.app", builtByGci: true, image: "/images/restaurants/unclejohns",
    // Its site also lists a Wrigleyville location; these are the Cottage Grove hours.
    schedule: [[h(12),h(20)],[h(11),h(22)],[h(11),h(22)],[h(11),h(19,30)],[h(11),h(22)],[h(11),h(23)],[h(11),h(23)]],
    dineIn: true, meals: ["lunch", "dinner"],
    lat: 41.7443, lng: -87.6048, corridor: "cottage-grove",
  },
  {
    slug: "justicepies", name: "Justice of the Pies",
    tagline: "Sweet and savory pies with a mission.",
    cuisine: ["Bakery", "Pies", "Quiche"], signature: ["Sweet Potato Pie", "Blue Cheese Praline Pear", "Quiche"],
    neighborhood: "Avalon Park", address: "8655 S Blackstone Ave, Chicago, IL 60619",
    phone: "", phoneHref: "",
    site: "https://www.justiceofthepies.com", builtByGci: false, image: "/images/restaurants/justicepies",
    schedule: [[h(9),h(17)],null,null,null,null,[h(9),h(17)],[h(9),h(17)]],
    // Dine in: a small seating area (visitor reviews).
    dineIn: true, meals: [],
    lat: 41.7377, lng: -87.5897, corridor: "beyond",
  },
];

export const CORRIDORS: Record<Restaurant["corridor"], { label: string; blurb: string }> = {
  "75th":          { label: "75th Street",            blurb: "The heart of the Chatham Heritage Trail — a bakery, a vegan kitchen and a chicken shack within three blocks." },
  "79th":          { label: "79th Street",            blurb: "Jerk, hibachi and Caribbean fire, side by side." },
  "cottage-grove": { label: "Cottage Grove Avenue",   blurb: "Donuts at dawn, soul food all day, barbecue into the night." },
  "beyond":        { label: "Greater Grand Crossing & Avalon Park", blurb: "Just off the corridors, and worth the trip." },
};

/** The Food pills atop the trail. A stop joins a category when any of its
 *  `cuisine` tags is listed here, so a new stop files itself; a category with
 *  no stops is simply not shown. */
export const FOOD_CATEGORIES: { key: string; label: string; cuisines: string[] }[] = [
  { key: "wine-small-plates", label: "Wine & Small Plates", cuisines: ["Wine Bar", "Charcuterie", "Small Plates"] },
  { key: "soul-food",  label: "Soul Food",       cuisines: ["Soul Food"] },
  { key: "barbecue",   label: "Barbecue",        cuisines: ["Barbecue", "Rib Tips"] },
  { key: "caribbean",  label: "Caribbean",       cuisines: ["Jamaican", "Caribbean"] },
  { key: "seafood",    label: "Seafood",         cuisines: ["Seafood", "Fried Shrimp"] },
  { key: "hibachi",    label: "Hibachi & Asian", cuisines: ["Hibachi", "Asian Fusion"] },
  { key: "vegan",      label: "Vegan",           cuisines: ["Vegan"] },
  { key: "sandwiches", label: "Sandwiches",      cuisines: ["Sandwiches"] },
  { key: "sweets",     label: "Bakery & Sweets", cuisines: ["Bakery", "Cakes", "Candy", "Donuts", "Pies"] },
];

export const SITE = {
  name: "Greater Chatham Culinary Trail",
  org: "Greater Chatham Initiative",
  orgUrl: "https://www.gci2016.org/",
  tagline: "Taste the culinary path of Greater Chatham",
  description:
    "A trail through the kitchens of Chicago's South Side — fried chicken, jerk, barbecue, vegan soul food, donuts, caramel cake and pie, all within a few blocks of 75th and 79th. Curated by the Greater Chatham Initiative.",
  instagram: "https://www.instagram.com/greaterchatham/",
};
