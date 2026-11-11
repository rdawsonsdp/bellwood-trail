/* ===== Restaurant photo galleries =====
 * Food and dining-room photographs of each stop, shown in its detail sheet.
 * Kept apart from restaurants.ts on purpose: that file is only the seed, and
 * once /admin saves, the live content store replaces it. Galleries live here
 * so they survive admin edits. Every photo is of THIS restaurant — no stock.
 * Sources and credits: docs/gallery-manifests/<slug>.json. */

export interface GalleryPhoto {
  src: string;
  alt: string;
  /** "food" = its dishes; "atmosphere" = dining room, counter, storefront. */
  kind: "food" | "atmosphere";
  credit?: string;
}

export const GALLERIES: Record<string, GalleryPhoto[]> = {
  "ariston": [
    {
      "src": "/images/restaurants/gallery/ariston-1.jpg",
      "alt": "Gyros plate on pita with onions, tomato, Greek salad with feta and crinkle fries on a wood table",
      "kind": "food",
      "credit": "Ariston on DoorDash"
    },
    {
      "src": "/images/restaurants/gallery/ariston-2.jpg",
      "alt": "Italian beef sandwich heaped with hot giardiniera",
      "kind": "food",
      "credit": "Ariston on DoorDash"
    },
    {
      "src": "/images/restaurants/gallery/ariston-3.jpg",
      "alt": "Greek salad with tomatoes, green peppers, pepperoncini, olives, feta and a stuffed grape leaf",
      "kind": "food",
      "credit": "Ariston on DoorDash"
    },
    {
      "src": "/images/restaurants/gallery/ariston-4.jpg",
      "alt": "Beef sandwich on French bread smothered in melted cheese",
      "kind": "food",
      "credit": "Ariston on DoorDash"
    },
    {
      "src": "/images/restaurants/gallery/ariston-5.jpg",
      "alt": "Quarter-pound cheeseburger with tomato, onion and lettuce",
      "kind": "food",
      "credit": "Ariston on DoorDash"
    },
    {
      "src": "/images/restaurants/gallery/ariston-6.jpg",
      "alt": "Taco salad in a crisp tortilla bowl with cheddar and sour cream",
      "kind": "food",
      "credit": "Ariston on DoorDash"
    }
  ],
  "captain-bs": [
    {
      "src": "/images/restaurants/gallery/captain-bs-1.jpg",
      "alt": "Platter of golden fried shrimp with cups of hot sauce and cocktail sauce",
      "kind": "food",
      "credit": "Captain B's Shrimp House website (brand photo; Cicero/Villa Park menu)"
    },
    {
      "src": "/images/restaurants/gallery/captain-bs-2.jpg",
      "alt": "Jumbo fried shrimp on a white platter with hot sauce and cocktail sauce",
      "kind": "food",
      "credit": "Captain B's Shrimp House website (brand photo; Cicero/Villa Park menu)"
    },
    {
      "src": "/images/restaurants/gallery/captain-bs-3.jpg",
      "alt": "Fried perch fish chips on a white platter with dipping sauces",
      "kind": "food",
      "credit": "Captain B's Shrimp House website (brand photo; Cicero/Villa Park menu)"
    },
    {
      "src": "/images/restaurants/gallery/captain-bs-4.jpg",
      "alt": "Crisp fried catfish fillets on a white platter with hot sauce and cocktail sauce",
      "kind": "food",
      "credit": "Captain B's Shrimp House website (brand photo; Cicero/Villa Park menu)"
    }
  ],
  "gioacchinos": [
    {
      "src": "/images/restaurants/gallery/gioacchinos-1.jpg",
      "alt": "Chicago tavern-style thin-crust sausage pizza, square-cut with golden bubbling mozzarella, on a metal pizza tray",
      "kind": "food",
      "credit": "Gioacchino's website"
    },
    {
      "src": "/images/restaurants/gallery/gioacchinos-2.jpg",
      "alt": "Fried zucchini, mushrooms and mozzarella sticks around a bowl of marinara on a red-checkered tablecloth",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/gioacchinos-3.jpg",
      "alt": "Baked clams with golden herbed breadcrumb topping and lemon wedges",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/gioacchinos-4.jpg",
      "alt": "Thin-crust pizza with melted cheese over sausage, fresh from the oven",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/gioacchinos-5.jpg",
      "alt": "Vintage sepia collage of the founding couple: holding a fresh pizza, at the shop door, and cooking in the kitchen",
      "kind": "atmosphere",
      "credit": "Gioacchino's website"
    }
  ],
  "jj-fish": [
    {
      "src": "/images/restaurants/gallery/jj-fish-1.jpg",
      "alt": "Overhead spread of carryout boxes with fried chicken, shrimp, nuggets, fries and a loaded sub sandwich",
      "kind": "food",
      "credit": "JJ Fish & Chicken Bellwood online ordering (DoorDash)"
    },
    {
      "src": "/images/restaurants/gallery/jj-fish-2.jpg",
      "alt": "Golden fried chicken wings with crinkle-cut fries on red-checked paper over a wood table",
      "kind": "food",
      "credit": "JJ Fish & Chicken Bellwood online ordering (DoorDash)"
    },
    {
      "src": "/images/restaurants/gallery/jj-fish-3.jpg",
      "alt": "Crispy chicken tenders with fries, coleslaw and white bread",
      "kind": "food",
      "credit": "JJ Fish & Chicken Bellwood online ordering (DoorDash)"
    },
    {
      "src": "/images/restaurants/gallery/jj-fish-4.jpg",
      "alt": "Cornmeal-fried fish fillet and fried shrimp over fries, with coleslaw and hot sauce on the side",
      "kind": "food",
      "credit": "JJ Fish & Chicken Bellwood online ordering (DoorDash)"
    },
    {
      "src": "/images/restaurants/gallery/jj-fish-5.jpg",
      "alt": "Plate of fried nuggets piled beside thick-cut fries with ketchup",
      "kind": "food",
      "credit": "JJ Fish & Chicken Bellwood online ordering (DoorDash)"
    }
  ],
  "lezza": [
    {
      "src": "/images/restaurants/gallery/lezza-1.jpg",
      "alt": "Classic Lezza spumoni cake cut open to show its layered pistachio, cherry and chocolate, served with coffee",
      "kind": "food",
      "credit": "Lezza website"
    },
    {
      "src": "/images/restaurants/gallery/lezza-2.jpg",
      "alt": "Plate of lattice-top fruit and crumb pastry squares with small cookies",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/lezza-3.jpg",
      "alt": "Frosted cupcake and two cake pops on a plate beside autumn pumpkin decor",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/lezza-4.jpg",
      "alt": "Tray of glazed pastry bars, some topped with pink sprinkles",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/lezza-5.jpg",
      "alt": "Slice of spumoni plated with chocolate drizzle and whipped cream",
      "kind": "food",
      "credit": "Lezza website"
    }
  ],
  "mi-jerez": [
    {
      "src": "/images/restaurants/gallery/mi-jerez-1.jpg",
      "alt": "Enchiladas in green salsa over grilled carne asada with red rice, avocado, tomato and lime",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/mi-jerez-2.jpg",
      "alt": "Enchiladas verdes with rice, refried beans, avocado, salad and sour cream",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/mi-jerez-3.jpg",
      "alt": "Two sopes topped with steak, lettuce, tomato and queso, with rice and beans",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/mi-jerez-4.jpg",
      "alt": "Chiles rellenos plate with rice, refried beans topped with cheese, and avocado",
      "kind": "food",
      "credit": "Restaurantji gallery"
    },
    {
      "src": "/images/restaurants/gallery/mi-jerez-5.jpg",
      "alt": "Burrito especial cut in half with a pile of french fries",
      "kind": "food",
      "credit": "Restaurantji gallery"
    }
  ],
  "mickeys": [
    {
      "src": "/images/restaurants/gallery/mickeys-1.jpg",
      "alt": "Chicago-style hot dog with pickle spear, tomato and sport peppers beside fries on checkered paper",
      "kind": "food",
      "credit": "Mickey's website"
    },
    {
      "src": "/images/restaurants/gallery/mickeys-2.jpg",
      "alt": "Italian beef piled with hot giardiniera in deli paper",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Tripadvisor)"
    },
    {
      "src": "/images/restaurants/gallery/mickeys-3.jpg",
      "alt": "Mickey's glowing marquee sign: Famous Italian Beef, Sausage and Meat Balls, Hot Dogs, Polish Sausage, Est. 1959",
      "kind": "atmosphere",
      "credit": "Mickey's website"
    },
    {
      "src": "/images/restaurants/gallery/mickeys-4.jpg",
      "alt": "Vintage photo of the original Mickey's Drive-In walk-up stand with Vienna Beef signs",
      "kind": "atmosphere",
      "credit": "Mickey's website"
    }
  ],
  "mr-submarine": [
    {
      "src": "/images/restaurants/gallery/mr-submarine-1.jpg",
      "alt": "Two Mr. Sub sandwiches stacked with ham, salami, cheese, tomato and shredded lettuce on sesame rolls over branded wax paper",
      "kind": "food",
      "credit": "Mr. Submarine website (brand photography)"
    },
    {
      "src": "/images/restaurants/gallery/mr-submarine-2.jpg",
      "alt": "Overhead of a halved Mr. Sub with salami, ham and cheese beside a pile of potato chips on Mr. Submarine paper",
      "kind": "food",
      "credit": "Mr. Submarine website (brand photography)"
    },
    {
      "src": "/images/restaurants/gallery/mr-submarine-3.jpg",
      "alt": "Cold-cut sub, crinkle-cut fries and a Mr. Submarine cup against the chain's red-and-white tile wall",
      "kind": "food",
      "credit": "Mr. Submarine website (brand photography)"
    },
    {
      "src": "/images/restaurants/gallery/mr-submarine-4.jpg",
      "alt": "Crinkle-cut fries spilling from a retro French Fries bag with a cup of dipping sauce on Mr. Submarine paper",
      "kind": "food",
      "credit": "Mr. Submarine website (brand photography)"
    },
    {
      "src": "/images/restaurants/gallery/mr-submarine-5.jpg",
      "alt": "Tuna sub and seasoned fries on a red tray with a Mr. Submarine cup",
      "kind": "food",
      "credit": "Mr. Submarine website (brand photography)"
    }
  ],
  "nicks": [
    {
      "src": "/images/restaurants/gallery/nicks-1.jpg",
      "alt": "Close-up of a cheesy pizza slice lifted from the pie",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Foursquare)"
    },
    {
      "src": "/images/restaurants/gallery/nicks-2.jpg",
      "alt": "Italian beef with roasted sweet peppers and melted mozzarella on French bread",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Facebook)"
    },
    {
      "src": "/images/restaurants/gallery/nicks-3.jpg",
      "alt": "Barbecue ribs with crinkle fries, roll and coleslaw",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Foursquare)"
    },
    {
      "src": "/images/restaurants/gallery/nicks-4.jpg",
      "alt": "Staff member presenting a fresh cheese pizza across the counter",
      "kind": "atmosphere",
      "credit": "Restaurantji gallery (credited to Facebook)"
    },
    {
      "src": "/images/restaurants/gallery/nicks-5.jpg",
      "alt": "Italian sub with salami, lettuce and tomato on a fresh roll",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Foursquare)"
    },
    {
      "src": "/images/restaurants/gallery/nicks-6.jpg",
      "alt": "Smiling staff member handing an order out of the drive-thru window",
      "kind": "atmosphere",
      "credit": "Restaurantji gallery (credited to Foursquare)"
    }
  ],
  "stacys": [
    {
      "src": "/images/restaurants/gallery/stacys-1.jpg",
      "alt": "Thick slab of medium-rare prime rib in its own jus on a white plate",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Facebook)"
    },
    {
      "src": "/images/restaurants/gallery/stacys-2.jpg",
      "alt": "Spaghetti tossed with garlic shrimp and wilted spinach",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Facebook)"
    },
    {
      "src": "/images/restaurants/gallery/stacys-3.jpg",
      "alt": "Shrimp brochette with peppers, onion and mushroom over seasoned rice, with cocktail sauce and lemon",
      "kind": "food",
      "credit": "Stacy's website"
    },
    {
      "src": "/images/restaurants/gallery/stacys-4.jpg",
      "alt": "Triple-decker club sandwich with a pile of hand-cut fries",
      "kind": "food",
      "credit": "Restaurantji gallery (credited to Facebook)"
    },
    {
      "src": "/images/restaurants/gallery/stacys-5.jpg",
      "alt": "Dining room with set tables, wall sconces, framed art and holiday bows",
      "kind": "atmosphere",
      "credit": "Stacy's website"
    },
    {
      "src": "/images/restaurants/gallery/stacys-6.jpg",
      "alt": "Bar with leather booths, holiday garland and guests at the counter",
      "kind": "atmosphere",
      "credit": "Stacy's website"
    }
  ],
  "taco-patio": [
    {
      "src": "/images/restaurants/gallery/taco-patio-1.jpg",
      "alt": "Carnitas and barbacoa street tacos on corn tortillas topped with cilantro, onion and diced tomato, with lime wedges and a bottle of Jarritos",
      "kind": "food",
      "credit": "Taco Patio website"
    },
    {
      "src": "/images/restaurants/gallery/taco-patio-2.jpg",
      "alt": "Combination plate of melted-cheese enchilada, Mexican rice, refried beans, tortilla chips, shredded lettuce and tomato, with a cup of guacamole and red and green salsas",
      "kind": "food",
      "credit": "Taco Patio website"
    },
    {
      "src": "/images/restaurants/gallery/taco-patio-3.jpg",
      "alt": "Taco-bar catering spread: trays of grilled steak and chicken, warm tortillas, shredded lettuce, pico de gallo, cheese and limes on a woven Mexican runner",
      "kind": "food",
      "credit": "Taco Patio website"
    },
    {
      "src": "/images/restaurants/gallery/taco-patio-4.jpg",
      "alt": "Catering tray of halved burritos packed with rice, beans and meat, with tortilla chips and salsas",
      "kind": "food",
      "credit": "Taco Patio website"
    }
  ],
  "tastee-rolls": [
    {
      "src": "/images/restaurants/gallery/tastee-rolls-1.jpg",
      "alt": "Overhead spread of golden egg rolls on black plates and a silver tray with dipping sauces, around a cheese-topped rice bowl",
      "kind": "food",
      "credit": "Tastee Rolls website"
    },
    {
      "src": "/images/restaurants/gallery/tastee-rolls-2.jpg",
      "alt": "Close-up of a crispy Italian beef egg roll cut open to show beef, melted cheese and giardiniera, with sauce behind",
      "kind": "food",
      "credit": "Tastee Rolls website"
    },
    {
      "src": "/images/restaurants/gallery/tastee-rolls-3.jpg",
      "alt": "Loaded rice bowl with grilled chicken, steak, shrimp and peppers under melted cheese and fresh herbs",
      "kind": "food",
      "credit": "Tastee Rolls website"
    },
    {
      "src": "/images/restaurants/gallery/tastee-rolls-4.jpg",
      "alt": "Stacked egg rolls sliced to show their filling on a silver tray as sauce pours from a cup",
      "kind": "food",
      "credit": "Tastee Rolls website"
    },
    {
      "src": "/images/restaurants/gallery/tastee-rolls-5.jpg",
      "alt": "Cheesy steak egg roll split in half on a black plate with orange dipping sauce",
      "kind": "food",
      "credit": "Tastee Rolls website"
    },
    {
      "src": "/images/restaurants/gallery/tastee-rolls-6.jpg",
      "alt": "Egg roll halves oozing melted cheese and vegetables on a black plate with a cup of honey mustard",
      "kind": "food",
      "credit": "Tastee Rolls website"
    }
  ]
};
