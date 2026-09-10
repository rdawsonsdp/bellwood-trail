/* ===== The Culinary Path =====
 * One entry per stop. This file is the single source of truth for the trail:
 * adding a business is adding an entry here and dropping its photo in
 * /public/images/restaurants/<slug>.*. Nothing else needs touching.
 *
 * Every address, phone and schedule below was taken from the business's own
 * site. `builtByGci` marks sites built on the GCI template, which all emit a
 * schema.org openingHoursSpecification — the live "open now" reads that at
 * request time, and falls back to `schedule` here only if the fetch fails.
 * External sites have no usable structured hours, so `schedule` IS their
 * source and is transcribed from what they publish. */

/** [open, close] in minutes past midnight, America/Chicago; null = closed. Index 0 = Sunday. */
export type DayHours = readonly [number, number] | null;
const h = (hr: number, min = 0) => hr * 60 + min;

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
  builtByGci: boolean;
  image: string;
  since?: string;
  schedule: DayHours[];
  lat: number;
  lng: number;
  /** Which corridor the stop sits on — drives the trail grouping. */
  corridor: "75th" | "79th" | "cottage-grove" | "beyond";
}

export const RESTAURANTS: Restaurant[] = [
  {
    slug: "harolds", name: "Harold's Chicken #24",
    tagline: "Fried fresh. Mild sauce mandatory.",
    cuisine: ["Fried Chicken", "Soul Food"], signature: ["Wings", "Half Chicken", "Mild Sauce", "Fish & Shrimp", "Gizzards"],
    neighborhood: "Chatham", address: "407 E 75th St, Chicago, IL 60619",
    phone: "(773) 488-9533", phoneHref: "tel:+17734889533",
    site: "https://harolds.vercel.app", builtByGci: true, image: "/images/restaurants/harolds",
    schedule: [[h(11),h(25)],[h(11),h(25)],[h(11),h(25)],[h(11),h(25)],[h(11),h(25)],[h(11),h(26)],[h(11),h(26)]],
    lat: 41.7587, lng: -87.6149, corridor: "75th",
  },
  {
    slug: "soulveg", name: "Soul Veg City",
    tagline: "Vegan soul food, since the beginning.",
    cuisine: ["Vegan", "Soul Food"], signature: ["Cauliflower Wings", "Jerk Nachos", "Kale Greens", "Italian V", "Smoothies"],
    neighborhood: "Chatham", address: "203 E 75th St, Chicago, IL 60619",
    phone: "(773) 224-0104", phoneHref: "tel:+17732240104",
    site: "https://soulveg.vercel.app", builtByGci: true, image: "/images/restaurants/soulveg",
    schedule: [[h(11),h(18)],[h(11),h(18)],[h(11),h(18)],[h(11),h(18)],[h(11),h(18)],[h(11),h(18)],[h(11),h(18)]],
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
    lat: 41.7586, lng: -87.6181, corridor: "75th",
  },
  {
    slug: "lemsbbq", name: "Lem's Bar-B-Q",
    tagline: "BBQ as God meant it to be. Since 1954.",
    cuisine: ["Barbecue", "Rib Tips"], signature: ["Rib Tips", "Hot Links", "Slab", "Sauce"],
    neighborhood: "Chatham", address: "311 E 75th St, Chicago, IL 60619",
    phone: "", phoneHref: "",
    site: "https://lemsbbq.vercel.app", builtByGci: true, image: "/images/restaurants/lemsbbq",
    since: "1954",
    // Closed Tuesdays — their site says so twice.
    schedule: [[h(12),h(22)],[h(12),h(22)],null,[h(12),h(22)],[h(12),h(22)],[h(12),h(23)],[h(12),h(23)]],
    lat: 41.7586, lng: -87.6186, corridor: "75th",
  },
  {
    slug: "just-jerk", name: "Just Jerk Cafe",
    tagline: "Jerk chicken, oxtails & curry goat on 79th.",
    cuisine: ["Jamaican", "Caribbean"], signature: ["Jerk Chicken", "Oxtails", "Curry Goat", "Jerk Wings", "Rice & Peas"],
    neighborhood: "Chatham", address: "119 E 79th St, Chicago, IL 60619",
    phone: "(773) 846-2232", phoneHref: "tel:+17738462232",
    site: "https://just-jerk.vercel.app", builtByGci: true, image: "/images/restaurants/just-jerk",
    schedule: [null,[h(11,30),h(22)],[h(11,30),h(22)],[h(11,30),h(22)],[h(11,30),h(22)],[h(11,30),h(23)],[h(11,30),h(22)]],
    lat: 41.7513, lng: -87.6210, corridor: "79th",
  },
  {
    slug: "herbachi", name: "HerBachi",
    tagline: "Modern Asian fusion. Fierce flavors. Chicago fire.",
    cuisine: ["Hibachi", "Asian Fusion"], signature: ["Hibachi Bowl", "Fried Korean Wings", "Bang Bang Salmon", "Gold Reserve"],
    neighborhood: "Chatham", address: "522 E 79th St, Chicago, IL 60619",
    phone: "(872) 303-3100", phoneHref: "tel:+18723033100",
    site: "https://herbachi.vercel.app", builtByGci: true, image: "/images/restaurants/herbachi",
    schedule: [[h(11),h(20)],null,[h(11),h(20)],[h(11),h(20)],[h(11),h(20)],[h(11),h(20)],[h(11),h(20)]],
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
    schedule: [[h(12),h(20)],null,[h(10),h(20)],[h(10),h(20)],[h(10),h(20)],[h(10),h(21)],[h(10),h(21)]],
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
    lat: 41.7594, lng: -87.6382, corridor: "beyond",
  },
  {
    slug: "datdonut", name: "Dat Donut",
    tagline: "Home of the famous Big DAT Donut.",
    cuisine: ["Donuts", "Bakery", "Breakfast"], signature: ["Big DAT Donut", "Apple Fritter", "Breakfast Sandwich", "Glazed"],
    neighborhood: "Chatham", address: "8251 S Cottage Grove Ave, Chicago, IL 60619",
    phone: "(773) 723-1002", phoneHref: "tel:+17737231002",
    site: "https://datdonut.vercel.app", builtByGci: true, image: "/images/restaurants/datdonut",
    schedule: [[h(9),h(16)],[h(5,30),h(21)],[h(5,30),h(21)],[h(5,30),h(21)],[h(5,30),h(21)],[h(5,30),h(21)],[h(6),h(21)]],
    lat: 41.7449, lng: -87.6046, corridor: "cottage-grove",
  },
  {
    slug: "owi", name: "Oooh Wee! IT IS",
    tagline: "Old-school soul food and a Southern breakfast bar.",
    cuisine: ["Soul Food", "Breakfast"], signature: ["Smothered Potatoes", "Shrimp Dinner", "Breakfast Bar", "Cereal Bar"],
    neighborhood: "Chatham", address: "8548 S Cottage Grove Ave, Chicago, IL 60619",
    phone: "(773) 966-4435", phoneHref: "tel:+17739664435",
    site: "https://owi.vercel.app", builtByGci: true, image: "/images/restaurants/owi",
    schedule: [[h(8),h(21)],null,[h(8),h(21)],[h(8),h(21)],[h(8),h(21)],[h(8),h(21)],[h(8),h(21)]],
    lat: 41.7395, lng: -87.6046, corridor: "cottage-grove",
  },
  {
    slug: "unclejohns", name: "Uncle John's Barbecue",
    tagline: "Rib tips, hot links and the aquarium smoker.",
    cuisine: ["Barbecue", "Soul Food"], signature: ["Rib Tips", "Hot Links", "Fried Chicken", "Full Slab"],
    neighborhood: "Greater Grand Crossing", address: "S Cottage Grove Ave, Chicago, IL",
    phone: "", phoneHref: "",
    site: "https://unclejohns.vercel.app", builtByGci: true, image: "/images/restaurants/unclejohns",
    schedule: [[h(11),h(20)],[h(11),h(22)],[h(11),h(22)],[h(11),h(19,30)],[h(11),h(22)],[h(11),h(23)],[h(11),h(23)]],
    lat: 41.7620, lng: -87.6055, corridor: "cottage-grove",
  },
  {
    slug: "justicepies", name: "Justice of the Pies",
    tagline: "Sweet and savory pies with a mission.",
    cuisine: ["Bakery", "Pies", "Quiche"], signature: ["Sweet Potato Pie", "Blue Cheese Praline Pear", "Quiche"],
    neighborhood: "Avalon Park", address: "8655 S Blackstone Ave, Chicago, IL 60619",
    phone: "", phoneHref: "",
    site: "https://www.justiceofthepies.com", builtByGci: false, image: "/images/restaurants/justicepies",
    schedule: [[h(9),h(17)],null,null,null,null,[h(9),h(17)],[h(9),h(17)]],
    lat: 41.7377, lng: -87.5897, corridor: "beyond",
  },
];

export const CORRIDORS: Record<Restaurant["corridor"], { label: string; blurb: string }> = {
  "75th":          { label: "75th Street",            blurb: "The heart of the Chatham Heritage Trail — a bakery, a vegan kitchen and a chicken shack within three blocks." },
  "79th":          { label: "79th Street",            blurb: "Jerk, hibachi and Caribbean fire, side by side." },
  "cottage-grove": { label: "Cottage Grove Avenue",   blurb: "Donuts at dawn, soul food all day, barbecue into the night." },
  "beyond":        { label: "Greater Grand Crossing & Avalon Park", blurb: "Just off the corridors, and worth the trip." },
};

export const SITE = {
  name: "Chatham Culinary Path",
  org: "Greater Chatham Initiative",
  orgUrl: "https://www.gci2016.org/",
  tagline: "Taste the culinary path of Greater Chatham",
  description:
    "A trail through the kitchens of Chicago's South Side — fried chicken, jerk, barbecue, vegan soul food, donuts, caramel cake and pie, all within a few blocks of 75th and 79th. Curated by the Greater Chatham Initiative.",
  instagram: "https://www.instagram.com/greaterchatham/",
};
