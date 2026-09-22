/* ===== The Bellwood Culinary Path =====
 * One entry per stop. This file is the SEED: the trail starts from it, and
 * once someone saves in /admin the live copy lives in the content store
 * (app/lib/content-store.ts) and this file is no longer read.
 *
 * PROTOTYPE DATA NOTICE. Every stop below is a real, independently owned food
 * business with a Bellwood, Illinois address. The roster was built from the
 * Village of Bellwood's own business directory
 * (vil.bellwood.il.us/business/bellwood-businesses/), cross-checked against
 * each business's website where it has one and against its public listings
 * where it does not. National chains in the village (Burger King, McDonald's,
 * Dunkin', Subway) are deliberately left off: this is a trail of Bellwood's
 * own kitchens.
 *
 * Hours are the weakest field. Where a schedule below is marked VERIFIED the
 * business or a first-party listing publishes it. Where it is marked
 * UNVERIFIED it is a placeholder and the card will show the wrong open/closed
 * chip until someone calls the business and corrects it in /admin. See
 * docs/bellwood-stops.md for the per-stop source list and the call sheet.
 *
 * `liveDetails` marks stops whose own website publishes schema.org hours,
 * phone and address — the cards read those live at request time and fall back
 * to the values here only if the fetch fails. None of the Bellwood stops
 * publish usable structured data yet, so today every stop's values here ARE
 * its source. Turning a stop's website into one that publishes them is the
 * digital-storefront work this prototype is meant to argue for. */

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
  /** The business's own website. Empty when it has none — the cards drop the
   *  "Visit website" button rather than link nowhere. */
  site: string;
  /** Read hours, phone and address live from `site` (needs schema.org JSON-LD). */
  liveDetails: boolean;
  /** Card photo: a /public path without extension (resolved on the server), a
   *  path with one, or a full URL (photos saved from /admin). Empty until
   *  someone photographs the storefront — the card then shows its name plate
   *  instead of a stock photo of somewhere else. */
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
  corridor: "st-charles" | "mannheim" | "bellwood-ave" | "butterfield-25th";
  /** Seats to eat in (true) or carryout only (false) — the Dining pills.
   *  Leave unset if unconfirmed: the stop then matches neither pill. */
  dineIn?: boolean;
  /** Meals it is a real option for — the Meal pills. Breakfast = it advertises
   *  a breakfast menu. Lunch / dinner = it serves full meals and is open at
   *  noon / past 6 PM. Bakeries and dessert shops carry none. */
  meals: Meal[];
}

export const RESTAURANTS: Restaurant[] = [
  // ——— St. Charles Road: downtown Bellwood ———
  {
    slug: "gioacchinos", name: "Gioacchino's Ristorante & Pizzeria",
    tagline: "Sunday dinner at Nonna's, on St. Charles Road since 1977.",
    cuisine: ["Italian", "Pizza", "Pasta"],
    signature: ["Thin-Crust Pizza", "Chicken Vesuvio", "Baked Mostaccioli", "Italian Beef", "Full Bar"],
    neighborhood: "Bellwood", address: "5201 St Charles Rd, Bellwood, IL 60104",
    phone: "(708) 544-0380", phoneHref: "tel:+17085440380",
    site: "https://gioacchinosristorante.pizza", liveDetails: false,
    // From the banner on its own site.
    image: "/images/restaurants/gioacchinos.jpg",
    imageAlt: "A cheese and sausage thin-crust pizza on a pan, from Gioacchino's website",
    since: "1977",
    // UNVERIFIED beyond one day: its site shows "Open today 11:00 am – 10:00 pm"
    // and notes the kitchen closes 30 minutes before the dining room. Whether
    // it keeps a closed day (most independents on this block do) is unconfirmed.
    schedule: Array.from({ length: 7 }, () => [h(11), h(22)] as const),
    dineIn: true, meals: ["lunch", "dinner"],
    // The Census geocoder assigns 5201 St Charles to Berkeley; the restaurant,
    // the village directory and the Chamber all list it as Bellwood 60104.
    lat: 41.889075, lng: -87.897908, corridor: "st-charles",
  },
  {
    slug: "mi-jerez", name: "Taqueria Mi Jerez",
    tagline: "Tacos, tortas and a full breakfast, made by hand.",
    cuisine: ["Mexican", "Tacos", "Breakfast"],
    signature: ["Street Tacos", "Tortas", "Birria", "Huevos con Chorizo", "Aguas Frescas"],
    neighborhood: "Bellwood", address: "5003 St Charles Rd, Bellwood, IL 60104",
    phone: "(708) 401-5424", phoneHref: "tel:+17084015424",
    site: "", liveDetails: false, image: "",
    // VERIFIED: 9 AM – 6 PM every day (its map listing, checked 2026-09-22).
    // The village directory lists a second number, (708) 238-8534.
    schedule: Array.from({ length: 7 }, () => [h(9), h(18)] as const),
    dineIn: true, meals: ["breakfast", "lunch"],
    lat: 41.889001, lng: -87.894550, corridor: "st-charles",
  },
  {
    slug: "md-phats", name: "MD Phats",
    tagline: "Comfort food on the downtown stretch.",
    cuisine: ["Southern", "Comfort Food", "Wings"],
    signature: ["Wings", "Catfish", "Mac & Cheese", "Greens"],
    neighborhood: "Bellwood", address: "4310 St Charles Rd, Bellwood, IL 60104",
    phone: "(708) 493-1100", phoneHref: "tel:+17084931100",
    site: "", liveDetails: false, image: "",
    // UNVERIFIED — placeholder hours. Call before the demo.
    schedule: [null, [h(11), h(20)], [h(11), h(20)], [h(11), h(20)], [h(11), h(20)], [h(11), h(21)], [h(11), h(21)]],
    meals: ["lunch", "dinner"],
    lat: 41.888752, lng: -87.886058, corridor: "st-charles",
  },
  {
    slug: "lezza", name: "Lezza Spumoni & Desserts",
    tagline: "The spumoni Chicago weddings are built on.",
    cuisine: ["Desserts", "Ice Cream", "Bakery"],
    signature: ["Spumoni", "Italian Ice", "Cassata Cake", "Tortoni", "Cannoli"],
    neighborhood: "Bellwood", address: "4009 St Charles Rd, Bellwood, IL 60104",
    phone: "(708) 547-5969", phoneHref: "tel:+17085475969",
    site: "https://lezza.com", liveDetails: false,
    // Lezza's own product photograph, published on lezza.com.
    image: "/images/restaurants/lezza.jpg",
    imageAlt: "Pistachio-crusted cannoli dusted with sugar, from Lezza's website",
    // The company dates itself to 1904; a 2026 business listing puts it at
    // "121 years in business," which agrees within a year. Worth confirming
    // with the family before it goes on a sign.
    since: "1904",
    // UNVERIFIED — placeholder. This is a wholesale bakery with a retail
    // counter, so its counter hours are narrower than a restaurant's.
    schedule: [null, [h(9), h(17)], [h(9), h(17)], [h(9), h(17)], [h(9), h(17)], [h(9), h(17)], [h(9), h(15)]],
    dineIn: false, meals: [],
    lat: 41.888757, lng: -87.882528, corridor: "st-charles",
  },
  {
    slug: "varis", name: "Vari's Southern Cuisine",
    tagline: "Fried ribs, oxtail and lamb — Nanetta's second dining room.",
    cuisine: ["Southern", "Soul Food", "Seafood"],
    signature: ["Fried Ribs", "Catfish Filet", "Oxtail", "Lamb", "Wings & Fries"],
    neighborhood: "Bellwood", address: "2712 St Charles Rd, Bellwood, IL 60104",
    phone: "", phoneHref: "",
    site: "", liveDetails: false, image: "",
    // OPENING LATE OCTOBER 2026. Nanetta Dancy-Matthews is bringing her
    // Hillside restaurant's second location to downtown Bellwood. The hours
    // below are the ones she has published (noon–7 daily), so until the doors
    // open the card's open/closed chip will be optimistic. Either hide this
    // stop or add an opening-day note before the demo.
    schedule: Array.from({ length: 7 }, () => [h(12), h(19)] as const),
    dineIn: true, meals: ["lunch", "dinner"],
    lat: 41.887610, lng: -87.866539, corridor: "st-charles",
  },
  {
    slug: "joes-hideaway", name: "Joe's Hideaway",
    tagline: "The corner bar that has outlasted the corner.",
    cuisine: ["Bar & Grill", "Burgers"],
    signature: ["Burgers", "Wings", "Cold Beer"],
    neighborhood: "Bellwood", address: "2601 St Charles Rd, Bellwood, IL 60104",
    phone: "(708) 547-9320", phoneHref: "tel:+17085479320",
    site: "", liveDetails: false, image: "",
    // UNVERIFIED — it publishes no hours anywhere. Tavern hours assumed.
    schedule: Array.from({ length: 7 }, () => [h(15), h(24)] as const),
    dineIn: true, meals: ["dinner"],
    lat: 41.887918, lng: -87.865055, corridor: "st-charles",
  },
  {
    slug: "sharks", name: "Shark's Fish & Chicken",
    tagline: "Catfish, perch and wings, late into the night.",
    cuisine: ["Seafood", "Fried Fish", "Wings"],
    signature: ["Catfish Fillet", "Ocean Perch", "Wing Dinner", "Jumbo Shrimp", "Frozen Lemonade"],
    neighborhood: "Bellwood", address: "2500 St Charles Rd, Bellwood, IL 60104",
    phone: "(708) 493-9300", phoneHref: "tel:+17084939300",
    site: "", liveDetails: false, image: "",
    // VERIFIED: Sun 11–11, Mon–Thu 10–11, Fri–Sat 10 AM – 1 AM (its own
    // listings, agreeing across three sources, checked 2026-09-22).
    schedule: [[h(11), h(23)], [h(10), h(23)], [h(10), h(23)], [h(10), h(23)], [h(10), h(23)], [h(10), h(25)], [h(10), h(25)]],
    meals: ["lunch", "dinner"],
    // Interpolated between the geocoded 2601 and 2712 St Charles, at the
    // 25th Avenue corner its listing names. Verify the pin before launch.
    lat: 41.887970, lng: -87.863705, corridor: "st-charles",
  },

  // ——— Mannheim Road ———
  {
    slug: "stacys", name: "Stacy's Cafe",
    tagline: "An old-fashioned supper club. Pork chops and a martini.",
    cuisine: ["Steakhouse", "American", "Bar & Grill"],
    signature: ["Pork Chops", "Steaks", "Homemade Soup", "Broiled Fish", "Full Bar"],
    neighborhood: "Bellwood", address: "845 Mannheim Rd, Bellwood, IL 60104",
    phone: "(708) 544-6636", phoneHref: "tel:+17085446636",
    site: "", liveDetails: false, image: "",
    // VERIFIED: closed Sunday, Mon–Thu 11–10, Fri 11–11, Sat 4–11 (its
    // listing, checked 2026-09-22). Saturday is dinner only.
    schedule: [null, [h(11), h(22)], [h(11), h(22)], [h(11), h(22)], [h(11), h(22)], [h(11), h(23)], [h(16), h(23)]],
    dineIn: true, meals: ["lunch", "dinner"],
    lat: 41.876675, lng: -87.882987, corridor: "mannheim",
  },
  {
    slug: "ariston", name: "Ariston Restaurant",
    tagline: "Gyros, ribs and that house sauce, till one in the morning.",
    cuisine: ["Greek", "Gyros", "Barbecue"],
    signature: ["Gyros with Ariston Sauce", "Baby Back Ribs", "Chicken Kabob", "Pizza Puff", "Fries with Mild Sauce"],
    neighborhood: "Bellwood", address: "919 Mannheim Rd, Bellwood, IL 60104",
    phone: "(708) 544-8766", phoneHref: "tel:+17085448766",
    site: "https://aristongyros.com", liveDetails: false,
    // From Ariston's own photo gallery — its food, not a stock picture.
    image: "/images/restaurants/ariston.jpg",
    imageAlt: "A gyros platter with crinkle-cut fries and a cup of Ariston sauce, from Ariston's website",
    // VERIFIED: Sun 10:30 AM–midnight, Mon–Thu 9:30 AM–1 AM, Fri 9:30 AM–2 AM,
    // Sat 9:30 AM–1 AM (its map listing, checked 2026-09-22).
    schedule: [[h(10, 30), h(24)], [h(9, 30), h(25)], [h(9, 30), h(25)], [h(9, 30), h(25)], [h(9, 30), h(25)], [h(9, 30), h(26)], [h(9, 30), h(25)]],
    dineIn: true, meals: ["breakfast", "lunch", "dinner"],
    lat: 41.875726, lng: -87.882946, corridor: "mannheim",
  },
  {
    slug: "nicks", name: "Nick's Pizza & Beef",
    tagline: "Thin crust and a dipped beef, two doors from Stacy's.",
    cuisine: ["Pizza", "Italian Beef", "Sandwiches"],
    signature: ["Thin-Crust Sausage", "Italian Beef", "Meatball Sandwich", "Stuffed Pizza"],
    neighborhood: "Bellwood", address: "815 Mannheim Rd, Bellwood, IL 60104",
    phone: "(708) 493-2200", phoneHref: "tel:+17084932200",
    site: "https://www.nickspizzabeef.com", liveDetails: false,
    // Its own logo mark. The only photographs on Nick's site are stock, so the
    // mark is the honest choice until someone shoots the storefront.
    image: "/images/restaurants/nicks.png",
    imageAlt: "The Original Nick's Pizza & Beef logo — a pizza wheel with a banner, Est. 1972",
    // "EST. 1972" is lettered on the logo.
    since: "1972",
    // UNVERIFIED — placeholder. Pizzeria hours assumed.
    schedule: [[h(11), h(21)], [h(11), h(21)], [h(11), h(21)], [h(11), h(21)], [h(11), h(21)], [h(11), h(23)], [h(11), h(23)]],
    meals: ["lunch", "dinner"],
    lat: 41.877361, lng: -87.883024, corridor: "mannheim",
  },
  {
    slug: "mickeys", name: "Mickey's Drive-In",
    tagline: "Famous Italian beef, sausage and meat balls. Since 1959.",
    // Straight off the marquee: FAMOUS ITALIAN BEEF / SAUSAGE AND MEAT BALLS /
    // HOT DOGS / Polish Sausage, and EST. 1959 along the bottom.
    cuisine: ["Italian Beef", "Hot Dogs", "Sausage"],
    signature: ["Famous Italian Beef", "Italian Sausage", "Meat Balls", "Hot Dogs", "Polish Sausage"],
    neighborhood: "Bellwood", address: "635 Mannheim Rd, Bellwood, IL 60104",
    phone: "(708) 547-7866", phoneHref: "tel:+17085477866",
    site: "", liveDetails: false, image: "/images/restaurants/mickeys.jpg",
    imageAlt: "Mickey's illuminated marquee above the roofline on Mannheim Road, lettered Famous Italian Beef, Sausage and Meat Balls, Hot Dogs, Polish Sausage, Est. 1959",
    since: "1959",
    // VERIFIED: closed Sunday, Mon–Thu 10:30–9, Fri–Sat 10:30–9:30 (its
    // listing, checked 2026-09-22).
    schedule: [null, [h(10, 30), h(21)], [h(10, 30), h(21)], [h(10, 30), h(21)], [h(10, 30), h(21)], [h(10, 30), h(21, 30)], [h(10, 30), h(21, 30)]],
    dineIn: false, meals: ["lunch", "dinner"],
    lat: 41.880617, lng: -87.883138, corridor: "mannheim",
  },
  {
    slug: "first-chop-suey", name: "First Chop Suey",
    tagline: "The neighbourhood Chinese counter on Mannheim.",
    cuisine: ["Chinese"],
    signature: ["Shrimp Fried Rice", "Egg Foo Young", "Sweet & Sour Chicken", "Egg Rolls"],
    neighborhood: "Bellwood", address: "530 Mannheim Rd, Bellwood, IL 60104",
    phone: "(708) 544-7900", phoneHref: "tel:+17085447900",
    site: "", liveDetails: false, image: "",
    // UNVERIFIED — placeholder.
    schedule: [[h(12), h(21)], [h(11), h(21, 30)], [h(11), h(21, 30)], [h(11), h(21, 30)], [h(11), h(21, 30)], [h(11), h(22, 30)], [h(11), h(22, 30)]],
    dineIn: false, meals: ["lunch", "dinner"],
    lat: 41.882583, lng: -87.883354, corridor: "mannheim",
  },
  {
    slug: "jj-fish", name: "JJ Fish & Chicken",
    tagline: "Fried fish and chicken, next door to the chop suey house.",
    cuisine: ["Seafood", "Fried Fish", "Wings"],
    signature: ["Catfish Nuggets", "Whiting", "8-Piece Wings", "Shrimp Dinner", "Hush Puppies"],
    neighborhood: "Bellwood", address: "528 Mannheim Rd, Bellwood, IL 60104",
    phone: "(708) 544-0505", phoneHref: "tel:+17085440505",
    site: "", liveDetails: false, image: "",
    // The village directory carries this address as "1st Choice Fish &
    // Chicken Inc" — the licence name behind the JJ sign.
    // UNVERIFIED — placeholder.
    schedule: [[h(11), h(22)], [h(10, 30), h(23)], [h(10, 30), h(23)], [h(10, 30), h(23)], [h(10, 30), h(23)], [h(10, 30), h(24)], [h(10, 30), h(24)]],
    meals: ["lunch", "dinner"],
    lat: 41.882742, lng: -87.883357, corridor: "mannheim",
  },

  // ——— Bellwood Avenue, behind Village Hall ———
  {
    slug: "montego-bay", name: "Montego Bay Restaurant & Grill",
    tagline: "Jerk chicken and oxtails, six days a week.",
    cuisine: ["Jamaican", "Caribbean"],
    signature: ["Jerk Chicken", "Oxtails", "Curry Goat", "Rice & Peas", "Plantains"],
    neighborhood: "Bellwood", address: "700 Bellwood Ave, Bellwood, IL 60104",
    phone: "(708) 547-7911", phoneHref: "tel:+17085477911",
    site: "", liveDetails: false, image: "",
    // VERIFIED: noon–10 PM Monday to Saturday, closed Sunday (its listing and
    // a regional visitor guide agree, checked 2026-09-22). One 2017 review
    // claims it also closes Mon–Tue; treat Monday as worth a phone call.
    // The village directory lists a second number, (708) 547-4625.
    schedule: [null, [h(12), h(22)], [h(12), h(22)], [h(12), h(22)], [h(12), h(22)], [h(12), h(22)], [h(12), h(22)]],
    dineIn: true, meals: ["lunch", "dinner"],
    // Interpolated from the geocoded 706 Bellwood Ave next door.
    lat: 41.880220, lng: -87.878350, corridor: "bellwood-ave",
  },
  {
    slug: "tastee-rolls", name: "Tastee Rolls",
    tagline: "Home of the original jerk chicken egg roll.",
    cuisine: ["Caribbean", "Asian Fusion", "Wings"],
    signature: ["Jerk Chicken Egg Roll", "Philly Chicken Egg Roll", "Jerk Chicken Dinner", "Wings"],
    neighborhood: "Bellwood", address: "633 Bellwood Ave, Bellwood, IL 60104",
    phone: "(773) 865-7526", phoneHref: "tel:+17738657526",
    site: "https://www.tasteerolls.com/bellwood", liveDetails: false, image: "",
    // UNVERIFIED — its delivery listings show roughly 10–7 weekdays and a
    // shorter Sunday, which is what is below, but the shop publishes none.
    schedule: [[h(11), h(17)], [h(10), h(19)], [h(10), h(19)], [h(10), h(19)], [h(10), h(19)], [h(10), h(19)], [h(10), h(19)]],
    dineIn: false, meals: ["lunch", "dinner"],
    lat: 41.881210, lng: -87.878229, corridor: "bellwood-ave",
  },
  {
    slug: "bellwood-sweets", name: "Bellwood Sweets",
    tagline: "The dessert counter across from Montego Bay.",
    cuisine: ["Desserts", "Bakery", "Ice Cream"],
    signature: ["Cupcakes", "Cobbler", "Banana Pudding", "Milkshakes"],
    neighborhood: "Bellwood", address: "706 Bellwood Ave, Bellwood, IL 60104",
    phone: "", phoneHref: "",
    site: "", liveDetails: false, image: "",
    // UNVERIFIED — placeholder, and the phone number is still unknown. This
    // is the thinnest entry on the trail; confirm it is still trading.
    schedule: [null, null, [h(12), h(19)], [h(12), h(19)], [h(12), h(19)], [h(12), h(20)], [h(12), h(20)]],
    dineIn: false, meals: [],
    lat: 41.880142, lng: -87.878354, corridor: "bellwood-ave",
  },

  // ——— 25th Avenue & Butterfield ———
  {
    slug: "captain-bs", name: "Captain B's Shrimp House",
    tagline: "Shrimp by the bag, on 25th.",
    cuisine: ["Seafood", "Fried Shrimp"],
    signature: ["Fried Shrimp", "Catfish", "Perch Dinner", "Shrimp Basket"],
    neighborhood: "Bellwood", address: "445 25th Ave, Bellwood, IL 60104",
    phone: "(708) 544-6900", phoneHref: "tel:+17085446900",
    site: "", liveDetails: false, image: "",
    // UNVERIFIED — placeholder. Listed in the village directory and on
    // Tripadvisor as "Captain B's Shrimp House II".
    schedule: [[h(12), h(21)], [h(11), h(21)], [h(11), h(21)], [h(11), h(21)], [h(11), h(21)], [h(11), h(23)], [h(11), h(23)]],
    dineIn: false, meals: ["lunch", "dinner"],
    lat: 41.884830, lng: -87.863631, corridor: "butterfield-25th",
  },
  {
    slug: "donnies", name: "Donnie's Bar & Grill",
    tagline: "A neighbourhood room at Randolph and 25th.",
    cuisine: ["Bar & Grill", "Burgers", "Wings"],
    signature: ["Wings", "Burgers", "Fish Fry", "Cold Beer"],
    neighborhood: "Bellwood", address: "466 25th Ave, Bellwood, IL 60104",
    phone: "", phoneHref: "",
    site: "", liveDetails: false, image: "",
    // UNVERIFIED — placeholder, phone unknown. Also listed as "Donnie's Place".
    schedule: [[h(13), h(23)], null, [h(15), h(24)], [h(15), h(24)], [h(15), h(24)], [h(15), h(26)], [h(13), h(26)]],
    dineIn: true, meals: ["dinner"],
    lat: 41.884065, lng: -87.863759, corridor: "butterfield-25th",
  },
  {
    slug: "taco-patio", name: "Taco Patio",
    tagline: "Steak tacos and a gigante burrito, open past midnight.",
    cuisine: ["Mexican", "Tacos", "Burritos"],
    signature: ["Steak Taco", "Gigante Burrito", "Shrimp Tacos", "Chimichanga", "Cheese Fries"],
    neighborhood: "Bellwood", address: "4018 Butterfield Rd, Bellwood, IL 60104",
    phone: "(708) 544-1112", phoneHref: "tel:+17085441112",
    site: "https://tacopatio.com", liveDetails: false,
    // Its own logo. Taco Patio's site carries polished food photography that is
    // stock rather than its kitchen's, so the mark goes on the card instead.
    image: "/images/restaurants/taco-patio.png",
    imageAlt: "The Taco Patio logo",
    // VERIFIED: 10 AM–midnight Sunday to Thursday, 10 AM–2 AM Friday and
    // Saturday (its listings, checked 2026-09-22).
    schedule: [[h(10), h(24)], [h(10), h(24)], [h(10), h(24)], [h(10), h(24)], [h(10), h(24)], [h(10), h(26)], [h(10), h(26)]],
    dineIn: true, meals: ["lunch", "dinner"],
    lat: 41.882719, lng: -87.882292, corridor: "butterfield-25th",
  },
  {
    slug: "mr-submarine", name: "Mr. Submarine",
    tagline: "A sub and a drive-thru, across from Taco Patio.",
    cuisine: ["Sandwiches", "Subs"],
    signature: ["Italian Sub", "Steak Sub", "Turkey Sub", "Mr. Sub Special"],
    neighborhood: "Bellwood", address: "4019 Butterfield Rd, Bellwood, IL 60104",
    phone: "(708) 544-1007", phoneHref: "tel:+17085441007",
    site: "", liveDetails: false, image: "",
    // UNVERIFIED — placeholder.
    schedule: [[h(11), h(20)], [h(10), h(21)], [h(10), h(21)], [h(10), h(21)], [h(10), h(21)], [h(10), h(22)], [h(10), h(22)]],
    dineIn: false, meals: ["lunch", "dinner"],
    // Interpolated from the geocoded 4018 Butterfield across the street.
    lat: 41.882840, lng: -87.882290, corridor: "butterfield-25th",
  },
];

export const CORRIDORS: Record<Restaurant["corridor"], { label: string; blurb: string }> = {
  "st-charles":       { label: "St. Charles Road",          blurb: "Downtown Bellwood — Italian, Mexican, Southern and spumoni within a mile and a half." },
  "mannheim":         { label: "Mannheim Road",             blurb: "A supper club, a gyros counter, a beef stand and a pizzeria, all on one street." },
  "bellwood-ave":     { label: "Bellwood Avenue",           blurb: "Jerk chicken, egg rolls and dessert, a short walk from Village Hall." },
  "butterfield-25th": { label: "25th Avenue & Butterfield",  blurb: "Tacos past midnight, shrimp by the bag, and the corner bar." },
};

/** The Food pills atop the trail. A stop joins a category when any of its
 *  `cuisine` tags is listed here, so a new stop files itself; a category with
 *  no stops is simply not shown. */
export const FOOD_CATEGORIES: { key: string; label: string; cuisines: string[] }[] = [
  { key: "italian",    label: "Italian & Pizza",   cuisines: ["Italian", "Pizza", "Pasta"] },
  { key: "southern",   label: "Southern & Soul",   cuisines: ["Southern", "Soul Food", "Comfort Food"] },
  { key: "caribbean",  label: "Caribbean",         cuisines: ["Jamaican", "Caribbean"] },
  { key: "mexican",    label: "Mexican",           cuisines: ["Mexican", "Tacos", "Burritos"] },
  { key: "seafood",    label: "Fish & Seafood",    cuisines: ["Seafood", "Fried Fish", "Fried Shrimp"] },
  { key: "greek-bbq",  label: "Greek & Barbecue",  cuisines: ["Greek", "Gyros", "Barbecue"] },
  { key: "chinese",    label: "Chinese",           cuisines: ["Chinese"] },
  { key: "steak-bar",  label: "Steaks & Taverns",  cuisines: ["Steakhouse", "Bar & Grill"] },
  { key: "sandwiches", label: "Beef & Sandwiches", cuisines: ["Sandwiches", "Subs", "Italian Beef", "Hot Dogs", "Burgers"] },
  { key: "sweets",     label: "Sweets & Ice Cream", cuisines: ["Bakery", "Desserts", "Ice Cream"] },
];

export const SITE = {
  name: "Bellwood Culinary Path",
  org: "Village of Bellwood",
  orgUrl: "https://www.vil.bellwood.il.us/",
  tagline: "Twenty Bellwood kitchens, one path",
  description:
    "A trail through the kitchens of Bellwood, Illinois — gyros and ribs on Mannheim, jerk chicken off Washington, tacos on Butterfield, Italian and spumoni on St. Charles Road. Twenty locally owned restaurants in one village, thirteen miles west of the Loop.",
  instagram: "https://www.instagram.com/mayorandrefharvey/",
};
