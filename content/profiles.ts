/* ===== Restaurant profiles =====
 * What each restaurant says about itself, summarised from its own website or
 * official pages, plus links to those pages. Shown in the detail sheet.
 * Like galleries.ts, kept apart from the seed so /admin saves don't drop it.
 * Generated from docs/site-content/<slug>.json by scripts/build-galleries.cjs. */

export interface RestaurantProfile {
  about: string;
  links: { label: string; url: string }[];
}

export const PROFILES: Record<string, RestaurantProfile> = {
  "ariston": {
    "about": "A late-night Mannheim Road drive-in known for gyros with its house gyro sauce, rib tips and Greek chicken. Ariston says it pairs fresh, locally sourced ingredients with classic recipes and encourages ordering direct from its own site for pickup.",
    "links": [
      {
        "label": "Website",
        "url": "https://aristongyros.com/"
      },
      {
        "label": "Order online",
        "url": "https://www.onlinemenuorder.com/AristonRestaurant"
      }
    ]
  },
  "captain-bs": {
    "about": "",
    "links": [
      {
        "label": "Website",
        "url": "http://www.captainbshrimp.com"
      }
    ]
  },
  "first-chop-suey": {
    "about": "First Chop Suey is a neighborhood Chinese carryout on Mannheim Road that says it focuses on freshly prepared Asian cuisine made with quality ingredients. The menu covers American-Chinese favorites, from chop suey, lo mein and fried rice to orange chicken and crab rangoon, with online ordering for pickup and delivery.",
    "links": [
      {
        "label": "Website",
        "url": "https://www.chopsueyno1.com"
      },
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/firstchopsueybellwood/"
      },
      {
        "label": "Order online",
        "url": "https://www.ubereats.com/store/first-chop-suey-bellwood/57ZXansPUJCKRDz_F84WJw"
      }
    ]
  },
  "gioacchinos": {
    "about": "A family Italian restaurant and bar on St. Charles Road since 1977, cooking Calabrese-style Southern Italian food from scratch. Known for its panzarotti (billed as Chicago's original pizza puff), thin-crust and pan pizza, and classics like baked mostaccioli and chicken vesuvio. Dine in, carry out or delivery.",
    "links": [
      {
        "label": "Website",
        "url": "https://gioacchinosristorante.pizza"
      },
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/GioacchinosPizza"
      },
      {
        "label": "Instagram",
        "url": "https://www.instagram.com/gioacchinos_pizza/"
      }
    ]
  },
  "jj-fish": {
    "about": "The Bellwood JJ Fish & Chicken on Mannheim Road is a carryout counter for Chicago-style fried fish and chicken: wings, legs and thighs, tenders, catfish, perch and shrimp dinners with fries and bread, plus family-size fish and party-wing trays and Southern desserts.",
    "links": [
      {
        "label": "Order online",
        "url": "https://order.online/store/jj-fish-chicken-bellwood-179329"
      }
    ]
  },
  "joes-hideaway": {
    "about": "A neighborhood bar at 2601 St. Charles Road run by owner Joe, who invites everyone to come in and have a good time. It has a TouchTunes jukebox, darts, a claw machine, video gaming and poker machines, an ATM and packaged liquor to go, and hosts parties.",
    "links": [
      {
        "label": "Website",
        "url": "https://joeeads74.wixsite.com/mysite"
      },
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/HideawayLounge2601/"
      }
    ]
  },
  "lezza": {
    "about": "A family dessert maker whose spumoni recipe came from Naples to Chicago's Little Italy with Salvatore Lezza in 1905, now run by the third and fourth generations. The Bellwood plant on St. Charles Road makes cannoli, spumoni, cakes, cookies, gelato and Italian ice by hand for restaurants and stores.",
    "links": [
      {
        "label": "Website",
        "url": "https://lezza.com"
      },
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/LezzaSpumoni/"
      },
      {
        "label": "Instagram",
        "url": "https://www.instagram.com/lezzabakery/"
      }
    ]
  },
  "mi-jerez": {
    "about": "A dine-in and takeout Mexican taqueria at 5003 St. Charles Road serving tacos, tortas, burritos and plates, plus soups and seafood like caldo de pescado and shrimp cocktail. Menudo and pozole are served as a weekend special.",
    "links": [
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/p/Taqueria-mi-jerez-100069048782749/"
      }
    ]
  },
  "mickeys": {
    "about": "Ann 'Annie' Sangiacomo opened Mickey's in 1959, turning a Mannheim Road ice-cream stand into a Chicago hot dog stand with her husband Mickey. Still family-run into a fourth generation, it makes every order fresh in front of you — no chairs, no tables — and is a 2006 Vienna Beef Hall of Fame inductee.",
    "links": [
      {
        "label": "Website",
        "url": "https://mickeysdrivein.com/"
      },
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/mickeysdrivein/"
      },
      {
        "label": "Instagram",
        "url": "https://www.instagram.com/mickeysdrivein"
      }
    ]
  },
  "montego-bay": {
    "about": "",
    "links": [
      {
        "label": "Order online",
        "url": "https://montegobay.netwaiter.com/bellwood/about/"
      }
    ]
  },
  "mr-submarine": {
    "about": "Mr. Submarine calls itself Chicago's original submarine franchise, building subs since 1975 from fresh-sliced vegetables, meats and cheese on fresh-baked bread. The Bellwood store at Mannheim and Butterfield has a drive-thru, offers delivery, and stays open late every night.",
    "links": [
      {
        "label": "Website",
        "url": "https://mrsubmarine.com/bellwood/"
      }
    ]
  },
  "nicks": {
    "about": "The Original Nick's Pizza & Beef started on Bellwood Avenue and is now run by Jasper and family on Mannheim Road, still in Bellwood. The logo says est. 1972; the family promises traditional flavors and quality ingredients, from pizza and Italian beef to smash burgers and homemade Italian ice.",
    "links": [
      {
        "label": "Website",
        "url": "https://www.nickspizzabeef.com/"
      }
    ]
  },
  "sharks": {
    "about": "The Bellwood location of the Shark's Fish & Chicken chain, offering catfish, tilapia, perch, smelt and shrimp dinners, chicken wings and tenders, and family-size mixed-fish meals for pickup and delivery.",
    "links": [
      {
        "label": "Order online",
        "url": "https://www.ubereats.com/store/sharks-fish-%26-chicken-st-charles-rd/8I2-greITyS0mMaVURFE6Q"
      },
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/p/Sharks-Fish-Chicken-Bellwood-100088381518717/"
      }
    ]
  },
  "stacys": {
    "about": "A Mannheim Road steak-and-cocktails house that says it opened in 1986 and is now marking 40 years. Stacy's built its name on premium cuts, broiled seafood and hand-made drinks, with every dinner starting with its baked onion soup in a crock.",
    "links": [
      {
        "label": "Website",
        "url": "https://www.stacyscafe.com/"
      }
    ]
  },
  "taco-patio": {
    "about": "A family-owned Mexican kitchen that has fed Chicagoland since the 1970s, Taco Patio prides itself on fresh food, generous portions and friendly service. It runs two stores, Lockport and Bellwood, and also caters taco and fajita bars for parties and fundraisers.",
    "links": [
      {
        "label": "Website",
        "url": "https://tacopatio.com"
      },
      {
        "label": "Facebook",
        "url": "https://www.facebook.com/tacopatiolockport/"
      },
      {
        "label": "Instagram",
        "url": "https://www.instagram.com/tacopatio/"
      }
    ]
  },
  "tastee-rolls": {
    "about": "Tastee Rolls began in Bellwood and Chicago with a simple idea: stuff classic American comfort flavors into a crunchy, made-to-order egg roll. The menu runs from jerk chicken and Italian beef rolls to footlong egg rolls, loaded rice bowls and dessert rolls, plus catering for local gatherings.",
    "links": [
      {
        "label": "Website",
        "url": "https://www.tasteerolls.com/locations/bellwood"
      },
      {
        "label": "Order online",
        "url": "https://www.tasteerolls.com/popmenu-order"
      }
    ]
  }
};
