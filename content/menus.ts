/* ===== Restaurant menus =====
 * A representative menu for each stop, shown on its card and in its detail
 * sheet, and searched dish by dish from the board at the top of the site.
 * Like galleries.ts, kept apart from the seed so /admin saves don't drop it.
 *
 * Nothing here is invented. Every menu was read from the page named in its
 * `source`, on the date in `checked`, and prices are copied exactly as that
 * page published them. A stop with no menu anyone could verify has no entry:
 * its card shows the dishes it is known for, without prices.
 *
 * Generated from docs/menus/<slug>.json by scripts/build-menus.cjs. Each JSON
 * file carries reviewer notes on what could not be confirmed. */

export interface MenuItem {
  name: string;
  description?: string;
  /** Exactly as published: "$9.99", or "$12.00 – $24.00" for a size range. */
  price?: string;
}
export interface MenuSection { name: string; items: MenuItem[] }
export interface RestaurantMenu {
  source: { label: string; url: string };
  /** Delivery-marketplace prices are usually above counter prices; the site says so. */
  sourceKind: "own-site" | "first-party-ordering" | "delivery-marketplace" | "directory";
  /** ISO date the source was read. */
  checked: string;
  sections: MenuSection[];
}

export const MENUS: Record<string, RestaurantMenu> = {
  "ariston": {
    "source": {
      "label": "Ariston’s online ordering page",
      "url": "https://www.onlinemenuorder.com/AristonRestaurant"
    },
    "sourceKind": "first-party-ordering",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Hungry Men's Menu",
        "items": [
          {
            "name": "#01 Football Gyro",
            "price": "$18.69"
          },
          {
            "name": "#02 Belly Buster Triple Cheeseburger",
            "price": "$17.59"
          },
          {
            "name": "#03 Big Italian Beef",
            "price": "$16.49"
          },
          {
            "name": "#04 Big Mannheim Steak Philly",
            "price": "$17.59"
          },
          {
            "name": "#05 Big Mannheim Chicken Philly",
            "price": "$17.59"
          },
          {
            "name": "#06 Ariston's Famous Chicken Wings (10)",
            "price": "$18.69"
          },
          {
            "name": "#07 1Lb. BBQ Rib Tips",
            "price": "$16.49"
          },
          {
            "name": "#08 Double Chopped Steak",
            "price": "$17.59"
          }
        ]
      },
      {
        "name": "Meal Deals",
        "items": [
          {
            "name": "#01 1/2 Lb Cheese Burger",
            "description": "Ketchup, mustard, lettuce, tomato and onion",
            "price": "$13.19"
          },
          {
            "name": "#02 Gyro Sandwich",
            "description": "On pita with gyro sauce, onions and tomatoes",
            "price": "$13.19"
          },
          {
            "name": "#03 Italian Beef",
            "description": "On French bread",
            "price": "$13.19"
          },
          {
            "name": "#04 Vienna Polish Sausage",
            "price": "$9.89"
          },
          {
            "name": "#05 Super Taco",
            "description": "On a pita with cheddar, lettuce, tomato and hot sauce",
            "price": "$10.99"
          },
          {
            "name": "#06 Hoagie Steak",
            "price": "$13.19"
          },
          {
            "name": "#07 2 Hot Dogs",
            "description": "Mustard, onion, relish, tomatoes, sport peppers, pickles, celery salt",
            "price": "$10.99"
          },
          {
            "name": "#08 Chopped Steak",
            "price": "$13.19"
          }
        ]
      },
      {
        "name": "Greek Specialties",
        "items": [
          {
            "name": "Gyro Sandwich",
            "description": "On pita with gyro sauce, onions and tomatoes",
            "price": "$9.34"
          },
          {
            "name": "Gyro Dinner",
            "description": "Seasoned gyro meat, onions and tomatoes on pita, with fries and Greek salad",
            "price": "$15.39"
          },
          {
            "name": "Football Gyro Sandwich",
            "description": "On pita with gyro sauce, onions and tomatoes",
            "price": "$15.39"
          },
          {
            "name": "Chicken Gyro Dinner",
            "description": "Chicken gyro, lettuce, tomatoes, honey mustard on pita; fries and Greek salad",
            "price": "$15.39"
          },
          {
            "name": "Chicken Gyro Sandwich",
            "description": "On pita with lettuce, tomatoes and honey mustard",
            "price": "$9.34"
          },
          {
            "name": "Football Chicken Gyro Sandwich",
            "description": "On pita with lettuce, tomatoes and honey mustard",
            "price": "$15.39"
          },
          {
            "name": "Chicken Kabob Dinner",
            "description": "On pita with lettuce, tomatoes and gyro sauce; fries and Greek salad",
            "price": "$15.39"
          },
          {
            "name": "Chicken Kabob Sandwich",
            "description": "On a pita with lettuce, tomatoes and gyro sauce",
            "price": "$8.79"
          }
        ]
      },
      {
        "name": "Famous Ribs & Combos",
        "items": [
          {
            "name": "Full Slab BBQ Baby Back Ribs",
            "description": "With side salad or coleslaw, fries and garlic bread",
            "price": "$21.99"
          },
          {
            "name": "Half Slab BBQ Baby Back Ribs",
            "description": "With side salad or coleslaw, fries and garlic bread",
            "price": "$15.39"
          },
          {
            "name": "Small BBQ Rib Tips",
            "description": "10 oz rib tips with fries and garlic bread",
            "price": "$12.09"
          },
          {
            "name": "Large BBQ Rib Tips",
            "description": "16 oz rib tips with fries and garlic bread",
            "price": "$13.74"
          },
          {
            "name": "Rib Tips & Gyros",
            "description": "1/2 lb rib tips with slices of gyro, served with fries",
            "price": "$13.74"
          },
          {
            "name": "Rib Tips & Hot Links",
            "description": "1/2 lb rib tips and hot links, with fries and garlic bread",
            "price": "$13.19"
          },
          {
            "name": "Rib Tips & Chicken Wings",
            "description": "1/2 lb rib tips and 3 chicken wings, with fries and garlic bread",
            "price": "$13.19"
          },
          {
            "name": "Link Dinner (4)",
            "description": "Hot or BBQ links with fries and garlic bread",
            "price": "$13.19"
          }
        ]
      },
      {
        "name": "Italian Sandwiches",
        "items": [
          {
            "name": "Italian Beef Sandwich",
            "description": "On French bread",
            "price": "$8.24"
          },
          {
            "name": "Italian Sausage Sandwich",
            "description": "On French bread",
            "price": "$6.59"
          },
          {
            "name": "Double Sausage Sandwich",
            "description": "On French bread",
            "price": "$9.34"
          },
          {
            "name": "Combo Beef & Sausage Sandwich",
            "description": "On French bread",
            "price": "$9.34"
          },
          {
            "name": "BBQ Beef Sandwich",
            "description": "On French bread",
            "price": "$8.79"
          },
          {
            "name": "Meatball Sandwich",
            "description": "Marinara sauce and parmesan on French bread",
            "price": "$8.24"
          },
          {
            "name": "Italian Breaded Steak",
            "description": "Marinara sauce and mozzarella on French bread",
            "price": "$9.34"
          }
        ]
      },
      {
        "name": "Ariston's Wings",
        "items": [
          {
            "name": "3 pc Chicken Wings",
            "description": "With fries and garlic bread",
            "price": "$7.69"
          },
          {
            "name": "5 pc Chicken Wings",
            "description": "With fries and garlic bread",
            "price": "$10.99"
          },
          {
            "name": "7 pc Chicken Wings",
            "description": "With fries and garlic bread",
            "price": "$14.29"
          },
          {
            "name": "8 pc Buffalo Wings (Spicy)",
            "description": "With fries and garlic bread",
            "price": "$14.29"
          }
        ]
      }
    ]
  },
  "first-chop-suey": {
    "source": {
      "label": "First Chop Suey’s website",
      "url": "https://www.chopsueyno1.com/menus"
    },
    "sourceKind": "own-site",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Appetizers",
        "items": [
          {
            "name": "Egg Roll(2)",
            "price": "$6.70"
          },
          {
            "name": "Vegetable Egg Roll(2)",
            "price": "$6.70"
          },
          {
            "name": "Vegetable Spring Roll (2)",
            "price": "$6.70"
          },
          {
            "name": "Teriyaki Chicken (4 pcs)",
            "price": "$10.50"
          },
          {
            "name": "Crab Rangoon (5 pcs)",
            "price": "$9.50"
          },
          {
            "name": "Chicken Wing (6 pcs)",
            "price": "$10.50"
          },
          {
            "name": "Fried Shrimp (8 pcs)",
            "price": "$12.80"
          },
          {
            "name": "Bar-B-Q Pork",
            "price": "$11.20"
          }
        ]
      },
      {
        "name": "Soup",
        "items": [
          {
            "name": "Hot & Sour Soup",
            "description": "Hot and spicy.",
            "price": "$5.75 – $8.25"
          },
          {
            "name": "Egg Drop Soup",
            "price": "$5.75 – $8.25"
          },
          {
            "name": "Chicken Noodle Soup",
            "price": "$5.75 – $8.25"
          },
          {
            "name": "Chicken Rice Soup",
            "price": "$5.75 – $8.25"
          },
          {
            "name": "Vegetable Soup",
            "price": "$5.75 – $8.25"
          },
          {
            "name": "Wonton Soup",
            "price": "$6.25 – $8.95"
          }
        ]
      },
      {
        "name": "Chicken",
        "items": [
          {
            "name": "Orange Chicken",
            "description": "Hot and spicy.",
            "price": "$11.70 – $23.45"
          },
          {
            "name": "General Tso's Chicken",
            "description": "Hot and spicy.",
            "price": "$11.70 – $23.45"
          },
          {
            "name": "Sesame Chicken",
            "price": "$11.70 – $23.45"
          },
          {
            "name": "Kung Pao Chicken",
            "description": "Hot and spicy.",
            "price": "$11.30 – $23.45"
          },
          {
            "name": "Szechwan Chicken",
            "description": "Hot and spicy.",
            "price": "$11.30 – $23.45"
          },
          {
            "name": "Pepper Chicken",
            "price": "$11.30 – $23.45"
          },
          {
            "name": "Chicken with Broccoli",
            "price": "$11.30 – $23.45"
          },
          {
            "name": "Chicken w. Mixed Veg",
            "price": "$11.30 – $23.45"
          }
        ]
      },
      {
        "name": "Beef",
        "items": [
          {
            "name": "Beef with Broccoli",
            "price": "$12.15 – $17.70"
          },
          {
            "name": "Tomato Pepper Steak",
            "price": "$12.15 – $17.70"
          },
          {
            "name": "Pepper Steak",
            "price": "$12.15 – $17.70"
          },
          {
            "name": "Beef w. Mixed Vegetables",
            "price": "$12.15 – $17.70"
          },
          {
            "name": "Kung Pao Beef",
            "description": "Hot and spicy.",
            "price": "$12.15 – $17.70"
          },
          {
            "name": "Hunan Beef",
            "description": "Hot and spicy.",
            "price": "$12.15 – $17.70"
          },
          {
            "name": "Szechwan Beef",
            "price": "$12.15 – $17.70"
          },
          {
            "name": "Mongolian Beef",
            "description": "Hot and spicy.",
            "price": "$12.45 – $18.20"
          }
        ]
      },
      {
        "name": "Seafood",
        "items": [
          {
            "name": "Shrimp with Broccoli",
            "price": "$13.20 – $18.50"
          },
          {
            "name": "Shrimp w. Mixed Vegetables",
            "price": "$13.20 – $18.50"
          },
          {
            "name": "Shrimp Lobster Sauce",
            "price": "$13.20 – $18.50"
          },
          {
            "name": "Kung Pao Shrimp",
            "description": "Hot and spicy.",
            "price": "$13.20 – $18.50"
          },
          {
            "name": "Szechwan Shrimp",
            "description": "Hot and spicy.",
            "price": "$13.20 – $18.50"
          },
          {
            "name": "Shrimp Chop Suey",
            "price": "$13.20 – $18.50"
          }
        ]
      },
      {
        "name": "Fried Rice",
        "items": [
          {
            "name": "Combination Fried Rice",
            "description": "Shrimp, chicken and beef.",
            "price": "$10.90 – $24.45"
          },
          {
            "name": "Shrimp Fried Rice",
            "price": "$10.30 – $23.45"
          },
          {
            "name": "Jumbo Shrimp Fried Rice",
            "price": "$11.30 – $24.45"
          },
          {
            "name": "Beef Fried Rice",
            "price": "$10.00 – $23.45"
          },
          {
            "name": "Chicken Fried Rice",
            "price": "$9.70 – $23.05"
          },
          {
            "name": "B.B.Q. Pork Fried Rice",
            "price": "$9.70 – $23.05"
          },
          {
            "name": "Egg Fried Rice",
            "price": "$8.70 – $21.05"
          },
          {
            "name": "Hawaii Fried Rice",
            "description": "Chicken and pineapple.",
            "price": "$9.80 – $15.45"
          }
        ]
      }
    ]
  },
  "gioacchinos": {
    "source": {
      "label": "Gioacchino’s website",
      "url": "https://gioacchinosristorante.pizza/thin-crust"
    },
    "sourceKind": "own-site",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Thin Crust Pizza",
        "items": [
          {
            "name": "Cheese",
            "description": "Five sizes: Small 10\", Medium 12\", Large 14\", Family 16\", Party 18\".",
            "price": "$12.20 – $28.20"
          },
          {
            "name": "Cheese & Toppings",
            "description": "Same five sizes; toppings include sausage, mushroom, spinach, pepperoni, Italian beef.",
            "price": "$13.80 – $35.30"
          }
        ]
      },
      {
        "name": "Stuffed Pizza",
        "items": [
          {
            "name": "Cheese",
            "description": "Small, Medium, Large or Family.",
            "price": "$22.60 – $35.30"
          },
          {
            "name": "Cheese Spinach or Sausage",
            "description": "Small, Medium, Large or Family.",
            "price": "$23.70 – $39.70"
          }
        ]
      },
      {
        "name": "Pan Pizza",
        "items": [
          {
            "name": "Cheese",
            "description": "Small, Medium, Large or Family.",
            "price": "$17.00 – $30.40"
          },
          {
            "name": "Cheese Spinach or Sausage",
            "description": "Small, Medium, Large or Family.",
            "price": "$21.00 – $35.30"
          },
          {
            "name": "Fiesta",
            "description": "Cheese, sausage and mushrooms. Small, Medium, Large or Family.",
            "price": "$26.50 – $42.50"
          }
        ]
      },
      {
        "name": "Panzarotti",
        "items": [
          {
            "name": "Cheese",
            "description": "Made to order, fried or baked (45 minute wait). Small or Large.",
            "price": "$13.80 – $16.00"
          },
          {
            "name": "Ricotta",
            "description": "Made to order, fried or baked (45 minute wait). Small or Large.",
            "price": "$13.80 – $16.00"
          },
          {
            "name": "Sausage",
            "description": "Made to order, fried or baked (45 minute wait). Small or Large.",
            "price": "$13.80 – $16.00"
          }
        ]
      },
      {
        "name": "Pastas",
        "items": [
          {
            "name": "Spaghetti or Mostaccioli",
            "description": "Served with bread, salad and cheese.",
            "price": "$11.00"
          },
          {
            "name": "Baked Mostaccioli",
            "description": "Served with bread, salad and cheese.",
            "price": "$16.50"
          },
          {
            "name": "Our Special Lasagna",
            "description": "Served with bread, salad and cheese.",
            "price": "$18.70"
          },
          {
            "name": "Homemade Meat or Cheese Ravioli",
            "description": "Served with bread, salad and cheese.",
            "price": "$18.70"
          },
          {
            "name": "Baked Gnocchi",
            "description": "Served with bread, salad and cheese.",
            "price": "$18.20"
          },
          {
            "name": "Eggplant Parmigiana",
            "description": "Served with bread, salad and cheese.",
            "price": "$15.80"
          },
          {
            "name": "Fettuccini Alfredo",
            "description": "Served with bread, salad and cheese.",
            "price": "$18.70"
          },
          {
            "name": "Linguini with Clams",
            "description": "Served with bread, salad and cheese.",
            "price": "$18.70"
          }
        ]
      },
      {
        "name": "Special Dinners",
        "items": [
          {
            "name": "BBQ Chicken Dinner",
            "description": "Served with bread, salad and cheese.",
            "price": "$15.40"
          },
          {
            "name": "Chicken Dinner",
            "description": "Served with bread, salad and cheese.",
            "price": "$12.00"
          },
          {
            "name": "Perch Dinner",
            "description": "Served with bread, salad and cheese.",
            "price": "$12.00"
          },
          {
            "name": "Fried Shrimp Dinner",
            "description": "Served with bread, salad and cheese.",
            "price": "$16.50"
          },
          {
            "name": "Half Slab Ribs",
            "description": "Served with bread, salad and cheese.",
            "price": "$19.90"
          },
          {
            "name": "Full Slab Ribs",
            "description": "Served with bread, salad and cheese.",
            "price": "$26.50"
          },
          {
            "name": "Rib Tip Dinner",
            "description": "Small or Large. Served with bread, salad and cheese.",
            "price": "$18.20 – $22.00"
          }
        ]
      }
    ]
  },
  "jj-fish": {
    "source": {
      "label": "JJ Fish & Chicken’s online ordering page",
      "url": "https://order.online/store/jj-fish-chicken-bellwood-179329"
    },
    "sourceKind": "first-party-ordering",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Chicken Wings",
        "items": [
          {
            "name": "Wings (3)",
            "description": "With fries.",
            "price": "$7.75"
          },
          {
            "name": "Wings (4)",
            "description": "With fries.",
            "price": "$8.99"
          },
          {
            "name": "Wings (6)",
            "price": "$12.99"
          },
          {
            "name": "Wings (10)",
            "price": "$22.49"
          },
          {
            "name": "Wings (20)",
            "price": "$38.99"
          },
          {
            "name": "Wings (30)",
            "price": "$58.99"
          },
          {
            "name": "Wings (40)",
            "price": "$75.99"
          },
          {
            "name": "Wings (50)",
            "price": "$97.99"
          }
        ]
      },
      {
        "name": "Fish for the Family",
        "items": [
          {
            "name": "Tilapia Fish Fillet (21pc)",
            "price": "$64.99"
          },
          {
            "name": "Ocean Perch (12pc)",
            "price": "$29.88"
          },
          {
            "name": "Ocean Perch (21pc)",
            "price": "$49.99"
          },
          {
            "name": "Mixed (12pc)",
            "price": "$29.88"
          },
          {
            "name": "Mixed (21pc)",
            "price": "$49.99"
          },
          {
            "name": "Fillet Cut (30pc)",
            "price": "$49.99"
          },
          {
            "name": "Fillet Cut (16pc)",
            "price": "$25.99"
          }
        ]
      },
      {
        "name": "Fish Combo",
        "items": [
          {
            "name": "Fish Combo",
            "description": "Choice of two: catfish, perch, jack, buffalo or shrimp.",
            "price": "$15.49"
          }
        ]
      },
      {
        "name": "Legs & Thighs",
        "items": [
          {
            "name": "Legs & Thighs (4pc)",
            "price": "$7.99"
          },
          {
            "name": "Legs & Thighs (10pc)",
            "price": "$12.99"
          },
          {
            "name": "Legs & Thighs (16pc)",
            "price": "$24.99"
          },
          {
            "name": "Legs & Thighs (24pc)",
            "price": "$29.99"
          },
          {
            "name": "Legs & Thighs (50pc)",
            "price": "$59.99"
          }
        ]
      },
      {
        "name": "Menu",
        "items": [
          {
            "name": "1. Chicken Tender (2pc)",
            "price": "$6.79"
          },
          {
            "name": "2. Legs & Thighs (2pc)",
            "price": "$6.79"
          },
          {
            "name": "3. Tender & Nuggets (4pc)",
            "price": "$6.79"
          },
          {
            "name": "4. 2 Pc Wings & 4 Pc Nuggets",
            "price": "$6.79"
          },
          {
            "name": "5. Filet & Shrimp",
            "price": "$11.99"
          },
          {
            "name": "6. Gizzards & Wings",
            "price": "$10.79"
          },
          {
            "name": "7. Tender & Perch",
            "price": "$12.49"
          },
          {
            "name": "8. Nuggets & Wings",
            "price": "$10.79"
          }
        ]
      },
      {
        "name": "Side Orders",
        "items": [
          {
            "name": "Hush Puppies",
            "price": "$3.99"
          },
          {
            "name": "Large French Fries",
            "price": "$2.99"
          },
          {
            "name": "Box French Fries",
            "price": "$5.49"
          },
          {
            "name": "Onion Rings",
            "description": "12 pieces.",
            "price": "$3.99"
          },
          {
            "name": "Mushroom",
            "price": "$3.99"
          },
          {
            "name": "Pizza Puff",
            "description": "With fries.",
            "price": "$5.49"
          },
          {
            "name": "Cheese Sticks",
            "description": "With fries.",
            "price": "$5.49"
          }
        ]
      }
    ]
  },
  "mi-jerez": {
    "source": {
      "label": "a photo of its printed takeout menu",
      "url": "https://cdn10.localdatacdn.com/il/bellwood/5579089/original/ObB8dfA0uf.jpeg"
    },
    "sourceKind": "directory",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Tortas",
        "items": [
          {
            "name": "Steak",
            "description": "Served with lettuce, tomato, cheese, cream, avocado and beans.",
            "price": "$6.99"
          },
          {
            "name": "Chicken",
            "description": "Served with lettuce, tomato, cheese, cream, avocado and beans.",
            "price": "$6.99"
          },
          {
            "name": "Marinated Pork",
            "description": "Served with lettuce, tomato, cheese, cream, avocado and beans.",
            "price": "$6.99"
          },
          {
            "name": "Ham",
            "description": "Served with lettuce, tomato, cheese, cream, avocado and beans.",
            "price": "$6.99"
          },
          {
            "name": "Mex Sausage",
            "description": "Served with lettuce, tomato, cheese, cream, avocado and beans.",
            "price": "$6.99"
          },
          {
            "name": "Dried Thin Steak",
            "description": "Served with lettuce, tomato, cheese, cream, avocado and beans.",
            "price": "$7.50"
          },
          {
            "name": "Pork Loin",
            "description": "Served with lettuce, tomato, cheese, cream, avocado and beans.",
            "price": "$7.50"
          },
          {
            "name": "Especial con papas y soda de lata",
            "description": "Includes fries and a can of pop.",
            "price": "$8.99"
          }
        ]
      },
      {
        "name": "Burritos",
        "items": [
          {
            "name": "Burrito",
            "description": "Steak, chicken, al pastor (marinated pork) or vegetarian, with lettuce, tomato, cheese, cream.",
            "price": "$7.50"
          },
          {
            "name": "Especial con papas y soda de lata",
            "description": "Includes fries and a can of pop.",
            "price": "$9.99"
          },
          {
            "name": "Con arroz, frijoles y soda de lata",
            "description": "With rice, beans and a can of pop.",
            "price": "$9.99"
          }
        ]
      },
      {
        "name": "Caldos / Soups",
        "items": [
          {
            "name": "Res / Beef",
            "price": "$10.99"
          },
          {
            "name": "Camaron / Shrimp",
            "price": "$11.99"
          },
          {
            "name": "Pescado / Fish",
            "price": "$11.99"
          },
          {
            "name": "Coctel de Camaron / Shrimp Cocktail",
            "price": "$11.99"
          },
          {
            "name": "Carne en su Jugo / Beef in Its Own Juice",
            "price": "$11.99"
          }
        ]
      },
      {
        "name": "Especial Fin de Semana",
        "items": [
          {
            "name": "Menudo y Pozole",
            "description": "Weekend special. Plate $9.99, half gallon 12.99, gallon $20.99.",
            "price": "$9.99 – $20.99"
          }
        ]
      },
      {
        "name": "Sides / Extras",
        "items": [
          {
            "name": "Arroz / Rice",
            "price": "$2.99"
          },
          {
            "name": "Frijoles / Beans",
            "price": "$2.99"
          },
          {
            "name": "Papas Fritas / Fries",
            "price": "$2.99"
          },
          {
            "name": "Quesadilla a Mano",
            "price": "$7.50"
          }
        ]
      },
      {
        "name": "Bebidas / Drinks",
        "items": [
          {
            "name": "Soda Can / Soda de Lata",
            "price": "$1.25"
          },
          {
            "name": "Bottled Soda Jarritos / Refresco de Botella",
            "price": "$2.50"
          },
          {
            "name": "Coca Cola Mexicana / Mexican Coca Cola",
            "price": "$2.75"
          },
          {
            "name": "Aguas Frescas",
            "description": "Horchata, jamaica or tamarindo. Medium or large.",
            "price": "$2.49 – $3.99"
          },
          {
            "name": "Licuados / Milkshakes",
            "description": "Strawberry, banana or chocolate. Medium or large.",
            "price": "$2.49 – $3.99"
          }
        ]
      }
    ]
  },
  "mickeys": {
    "source": {
      "label": "Mickey’s Drive-In’s website",
      "url": "https://mickeysdrivein.com/menu/"
    },
    "sourceKind": "own-site",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Menu",
        "items": [
          {
            "name": "“The Special”",
            "description": "Two Vienna hot dogs, both with fries.",
            "price": "$8.05"
          },
          {
            "name": "Hot Dog",
            "description": "“Chicago Style” hot dog. With fries $4.47.",
            "price": "$3.37"
          },
          {
            "name": "Double Dog",
            "description": "With fries $6.74.",
            "price": "$5.64"
          },
          {
            "name": "Italian Beef",
            "description": "With hot and sweet peppers; cheese and peppers extra. With fries $10.78.",
            "price": "$8.79"
          },
          {
            "name": "Italian Sausage",
            "description": "With mozzarella and hot peppers; cheese and peppers extra. With fries $8.88.",
            "price": "$6.89"
          },
          {
            "name": "Italian Combination",
            "description": "With fries $11.68.",
            "price": "$9.69"
          },
          {
            "name": "Italian Meatball",
            "description": "Meatball sandwich with hot and sweet peppers. With fries $10.48.",
            "price": "$8.49"
          },
          {
            "name": "Jumbo Polish",
            "description": "With fries $9.49.",
            "price": "$8.39"
          }
        ]
      },
      {
        "name": "Mini 4″ Sandwiches",
        "items": [
          {
            "name": "Italian Beef",
            "description": "With fries $7.88.",
            "price": "$5.89"
          },
          {
            "name": "Italian Sausage",
            "description": "With fries $6.98.",
            "price": "$4.99"
          },
          {
            "name": "Combination",
            "description": "With fries $8.77.",
            "price": "$6.78"
          },
          {
            "name": "Meatball",
            "description": "With fries $7.58.",
            "price": "$5.59"
          }
        ]
      },
      {
        "name": "Chili, Tamale & Fries",
        "items": [
          {
            "name": "Chili",
            "description": "Small or large.",
            "price": "$4.64 – $5.99"
          },
          {
            "name": "Tamale",
            "price": "$2.99"
          },
          {
            "name": "Fries",
            "description": "Regular or large.",
            "price": "$2.69 – $3.99"
          },
          {
            "name": "Chili Cheese Fries",
            "price": "$7.49"
          }
        ]
      },
      {
        "name": "Drinks",
        "items": [
          {
            "name": "Drinks",
            "description": "Regular or large; carbonated and non-carbonated flavors.",
            "price": "$2.62 – $3.19"
          },
          {
            "name": "Shakes",
            "description": "Chocolate, vanilla or strawberry.",
            "price": "$4.84"
          },
          {
            "name": "Italian Ice",
            "description": "Lemon or strawberry; small or large.",
            "price": "$3.09 – $4.99"
          },
          {
            "name": "Root Beer Float",
            "price": "$4.84"
          }
        ]
      }
    ]
  },
  "mr-submarine": {
    "source": {
      "label": "Mr. Submarine’s Bellwood menu",
      "url": "https://mrsubmarine.com/wp-content/uploads/2020/09/2018-Bellwood-Menu.pdf"
    },
    "sourceKind": "own-site",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Cold Subs",
        "items": [
          {
            "name": "Super Mr. Sub",
            "description": "Ham, salami and spice ham"
          },
          {
            "name": "Mr. Sub",
            "description": "Ham, salami and spice ham"
          },
          {
            "name": "Ham",
            "description": "96% fat free"
          },
          {
            "name": "Salami"
          },
          {
            "name": "Turkey Breast",
            "description": "99% fat free, with mayo"
          },
          {
            "name": "Veggie & Cheese"
          },
          {
            "name": "Tuna",
            "description": "No cheese, no sauce"
          },
          {
            "name": "Seafood with Crab",
            "description": "No cheese, no sauce"
          }
        ]
      },
      {
        "name": "Hot Subs",
        "items": [
          {
            "name": "Roast Beef"
          },
          {
            "name": "Corned Beef",
            "description": "With mustard"
          },
          {
            "name": "Combo",
            "description": "With mustard"
          },
          {
            "name": "Chicken",
            "description": "With mayo; no cheese, no sauce"
          },
          {
            "name": "Steak Burger",
            "description": "With mustard; no sauce"
          },
          {
            "name": "Gyro",
            "description": "With gyro sauce; no cheese"
          },
          {
            "name": "B.B.Q",
            "description": "BBQ sauce only"
          },
          {
            "name": "Fish Sub",
            "description": "Cod with tartar sauce; no cheese"
          }
        ]
      },
      {
        "name": "Specialty Sandwiches",
        "items": [
          {
            "name": "Gyro Pita",
            "description": "With fries"
          },
          {
            "name": "Gyro Plate",
            "description": "With fries"
          },
          {
            "name": "Hot Dog",
            "description": "With fries"
          },
          {
            "name": "Polish Sausage",
            "description": "With fries"
          },
          {
            "name": "Italian Beef",
            "description": "With fries"
          },
          {
            "name": "Italian Beef & Sausage",
            "description": "With fries"
          },
          {
            "name": "Italian Sausage",
            "description": "With fries"
          },
          {
            "name": "Philly Steak",
            "description": "With fries"
          }
        ]
      },
      {
        "name": "Specials",
        "items": [
          {
            "name": "Philly Steak",
            "description": "With fries and a 16 oz drink"
          },
          {
            "name": "Polish Sausage",
            "description": "With fries and a 16 oz drink"
          },
          {
            "name": "Pizza Puff & 2 Wings",
            "description": "With fries and a 16 oz drink"
          },
          {
            "name": "1/4 lb Cheeseburger",
            "description": "With fries and a 16 oz drink"
          },
          {
            "name": "Buy 3 King Subs",
            "description": "Get one free"
          }
        ]
      },
      {
        "name": "Salads",
        "items": [
          {
            "name": "Chicken Breast Salad"
          },
          {
            "name": "Julienne Salad",
            "description": "Ham, salami, turkey and cheese"
          },
          {
            "name": "Turkey Breast Salad",
            "description": "With cheese"
          },
          {
            "name": "Ham Salad",
            "description": "With cheese"
          },
          {
            "name": "Tuna Salad"
          },
          {
            "name": "Seafood Salad"
          },
          {
            "name": "Plain Salad"
          }
        ]
      },
      {
        "name": "Sides & Desserts",
        "items": [
          {
            "name": "Loaded Fries"
          },
          {
            "name": "Fries"
          },
          {
            "name": "Pizza Puffs w/Fries"
          },
          {
            "name": "Onion Rings"
          },
          {
            "name": "Cheese Sticks"
          },
          {
            "name": "Jalapeño Poppers"
          },
          {
            "name": "Cake or Cheesecake"
          },
          {
            "name": "Banana Pudding"
          }
        ]
      }
    ]
  },
  "nicks": {
    "source": {
      "label": "Nick’s Pizza & Beef’s menu",
      "url": "https://c9fc192b-f139-4ae6-a386-351df4b2ea00.usrfiles.com/ugd/c9fc19_60d9cfeb5e544bf2ad41639654846881.pdf"
    },
    "sourceKind": "own-site",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Our Famous Pizza",
        "items": [
          {
            "name": "Cheese",
            "description": "Six sizes from 12\" to 18x26 Stadium",
            "price": "$13.00 – $32.00"
          },
          {
            "name": "One Ingredient",
            "description": "Six sizes from 12\" to 18x26 Stadium",
            "price": "$14.25 – $34.75"
          },
          {
            "name": "Each Extra Ingredient",
            "description": "Per added ingredient, by pizza size",
            "price": "$2.00 – $3.00"
          }
        ]
      },
      {
        "name": "Our Specialty Pizza",
        "items": [
          {
            "name": "Nicks Special",
            "description": "Sausage, mushroom, green pepper and onion",
            "price": "$20.50 – $43.75"
          },
          {
            "name": "Sicilian",
            "description": "Sliced tomatoes, fresh garlic, basil and Romano cheese",
            "price": "$20.50 – $43.75"
          },
          {
            "name": "Vegetarian",
            "description": "Mushrooms, green pepper, onion and spinach",
            "price": "$20.50 – $43.75"
          },
          {
            "name": "Meat Lovers",
            "description": "Sausage, pepperoni and ground beef",
            "price": "$20.50 – $43.75"
          },
          {
            "name": "Hawaiian",
            "description": "Ham, pineapple and BBQ sauce",
            "price": "$20.50 – $43.75"
          },
          {
            "name": "Italian Beef",
            "description": "Italian beef, hot peppers and fresh garlic",
            "price": "$20.50 – $43.75"
          },
          {
            "name": "Gyro",
            "description": "Gyro, onions, tomatoes and tzatziki sauce",
            "price": "$20.50 – $43.75"
          },
          {
            "name": "B.L.T",
            "description": "Bacon, lettuce, tomatoes and mayo",
            "price": "$20.50 – $43.75"
          }
        ]
      },
      {
        "name": "Sandwiches",
        "items": [
          {
            "name": "Italian Beef",
            "price": "$9.95"
          },
          {
            "name": "Cheesy Italian Beef",
            "price": "$10.95"
          },
          {
            "name": "Combo - Italian Beef & Sausage",
            "price": "$10.50"
          },
          {
            "name": "Gyro",
            "price": "$7.95"
          },
          {
            "name": "Gyro & Italian Beef",
            "price": "$10.50"
          },
          {
            "name": "Gyro Platter for 2",
            "price": "$14.95"
          },
          {
            "name": "Italian Meatball",
            "price": "$6.95"
          },
          {
            "name": "Maxwell Street Polish",
            "price": "$6.95"
          }
        ]
      },
      {
        "name": "Smash Burgers",
        "items": [
          {
            "name": "Single",
            "price": "$4.95"
          },
          {
            "name": "Double",
            "price": "$5.95"
          },
          {
            "name": "Triple",
            "price": "$6.95"
          },
          {
            "name": "Single W/Cheese",
            "price": "$5.45"
          },
          {
            "name": "Double W/Cheese",
            "price": "$6.95"
          },
          {
            "name": "Tripple W/Cheese",
            "price": "$7.95"
          }
        ]
      },
      {
        "name": "Bar-B-Q RibTips",
        "items": [
          {
            "name": "Small",
            "description": "Includes fries and garlic bread",
            "price": "$8.95"
          },
          {
            "name": "Large",
            "description": "Includes fries and garlic bread",
            "price": "$12.95"
          }
        ]
      },
      {
        "name": "Wings & Shrimp",
        "items": [
          {
            "name": "5 Piece Wings",
            "price": "$9.50"
          },
          {
            "name": "10 Piece Wings",
            "price": "$12.50"
          },
          {
            "name": "5 Piece Chicken Tender",
            "price": "$9.50"
          },
          {
            "name": "8 Piece Chicken Tender",
            "price": "$12.50"
          },
          {
            "name": "21 Piece Shrimp Basket",
            "price": "$7.99"
          },
          {
            "name": "6 Piece Jumbo Shrimp",
            "price": "$10.99"
          }
        ]
      }
    ]
  },
  "sharks": {
    "source": {
      "label": "its Uber Eats page",
      "url": "https://www.ubereats.com/store/sharks-fish-%26-chicken-st-charles-rd/8I2-greITyS0mMaVURFE6Q"
    },
    "sourceKind": "delivery-marketplace",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Featured items",
        "items": [
          {
            "name": "Fish Fillets Dinner",
            "price": "$11.29"
          },
          {
            "name": "Wings with Fries",
            "price": "$8.49"
          },
          {
            "name": "Chicken Combo Mix (3 pcs) (Legs & Thighs)",
            "price": "$7.99"
          },
          {
            "name": "Smelt",
            "price": "$11.69"
          },
          {
            "name": "Tilapia Fillets Dinner",
            "price": "$11.29"
          }
        ]
      },
      {
        "name": "Family Meals",
        "items": [
          {
            "name": "Catfish Fillet and Tilapia Fillet",
            "price": "$19.99"
          },
          {
            "name": "Mixed Fish (10 pcs)",
            "price": "$32.99"
          },
          {
            "name": "Half Pan Catfish Nuggets",
            "price": "$48.99"
          },
          {
            "name": "Mixed Fish (21 pcs)",
            "price": "$59.99"
          },
          {
            "name": "Mixed Fish (15 pcs)",
            "price": "$46.99"
          },
          {
            "name": "Mixed Fish (35 pcs)",
            "price": "$92.99"
          },
          {
            "name": "Mixed Fish (50 pcs)",
            "price": "$122.99"
          },
          {
            "name": "Full Pan Catfish Nuggets",
            "price": "$89.99"
          }
        ]
      },
      {
        "name": "Shrimp Dinners",
        "items": [
          {
            "name": "Shrimp Dinners",
            "description": "Served with a side",
            "price": "$13.99"
          },
          {
            "name": "Jumbo Shrimp Dinners",
            "description": "Served with a side",
            "price": "$13.99"
          }
        ]
      },
      {
        "name": "Fish Dinners",
        "items": [
          {
            "name": "Fish Fillets Dinner",
            "description": "Served with a side",
            "price": "$11.29"
          },
          {
            "name": "Tilapia Fillets Dinner",
            "description": "Served with a side",
            "price": "$11.29"
          },
          {
            "name": "Smelt",
            "description": "Served with a side",
            "price": "$11.69"
          }
        ]
      }
    ]
  },
  "stacys": {
    "source": {
      "label": "Stacy’s Cafe’s website",
      "url": "https://www.stacyscafe.com/menu/"
    },
    "sourceKind": "own-site",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Appetizers",
        "items": [
          {
            "name": "Batter Fried or Sautéed Mushrooms",
            "price": "$10.95"
          },
          {
            "name": "Jumbo Shrimp Cocktail",
            "description": "With the house tangy cocktail sauce",
            "price": "$15.95"
          },
          {
            "name": "Shrimp Diablo",
            "description": "Baked in a spicy tomato basil sauce",
            "price": "$16.95"
          },
          {
            "name": "Coconut Shrimp",
            "description": "With sweet & sour sauce",
            "price": "$16.95"
          },
          {
            "name": "Grilled Shrimp on a Skewer",
            "description": "Char-broiled and basted with butter",
            "price": "$16.95"
          },
          {
            "name": "Bar-B-Que Baby Back Ribs",
            "description": "Individual riblets",
            "price": "$15.95"
          },
          {
            "name": "Baked Shrimp DeJonghe",
            "description": "In garlic butter, topped with breadcrumbs",
            "price": "$16.95"
          },
          {
            "name": "Baked Onion Soup",
            "description": "With seasoned croutons and imported cheese",
            "price": "$6.95"
          }
        ]
      },
      {
        "name": "Charbroiled and Hand Carved Sandwiches",
        "items": [
          {
            "name": "Our Famous Stacy Burger",
            "description": "1/2 lb prime ground sirloin on a fresh-baked bun, hand-cut fries and coleslaw",
            "price": "$12.50"
          },
          {
            "name": "Slim Plate",
            "description": "The burger served open faced with cottage cheese and fruit",
            "price": "$15.95"
          },
          {
            "name": "French Dip",
            "description": "Sliced prime roast beef on a French roll with au jus",
            "price": "$14.95"
          },
          {
            "name": "Hot Beef",
            "description": "Open faced with gravy and mashed potatoes",
            "price": "$14.95"
          },
          {
            "name": "Barbecue Beef",
            "description": "With the house special sauce",
            "price": "$14.95"
          },
          {
            "name": "Chicken Breast Sandwich",
            "description": "Char-grilled or barbecued",
            "price": "$14.95"
          },
          {
            "name": "Steak & Cheese",
            "description": "Ribeye with melted cheese, mushrooms and onions on garlic bread",
            "price": "$18.95"
          },
          {
            "name": "Prime Filet Steak Sandwich",
            "description": "Served open faced",
            "price": "$26.95"
          }
        ]
      },
      {
        "name": "Entrees",
        "items": [
          {
            "name": "Prime Top Sirloin Butt Steak",
            "description": "A house favorite, known for its flavor",
            "price": "$34.95"
          },
          {
            "name": "Prime Filet Mignon",
            "price": "$38.95"
          },
          {
            "name": "Ladies Prime New York Sirloin Steak 12 oz.",
            "price": "$32.95"
          },
          {
            "name": "Pepper Corn Steak",
            "description": "Made with the butt steak",
            "price": "$37.95"
          },
          {
            "name": "Grecian Steak",
            "description": "Made with filet mignon",
            "price": "$38.95"
          },
          {
            "name": "Pork Chops",
            "description": "Broiled, Grecian or barbecue",
            "price": "$29.95"
          },
          {
            "name": "Barbecue Canadian Baby Back Ribs",
            "description": "With the house special sauce",
            "price": "$30.95"
          },
          {
            "name": "Shrimp DeJonghe",
            "description": "In garlic butter with a fresh crumb topping",
            "price": "$30.95"
          }
        ]
      },
      {
        "name": "Stacy’s Specials",
        "items": [
          {
            "name": "Prime Rib Queen Cut",
            "description": "Friday and Saturday only",
            "price": "$38.95"
          },
          {
            "name": "Prime Rib King Cut",
            "description": "Friday and Saturday only",
            "price": "$41.95"
          },
          {
            "name": "T-Bone Steak",
            "description": "With mushrooms",
            "price": "$40.95"
          },
          {
            "name": "20 oz. Bone-In Ribeye",
            "price": "$51.95"
          },
          {
            "name": "24 oz. Porterhouse",
            "description": "With mushrooms",
            "price": "$51.95"
          },
          {
            "name": "Surf & Turf",
            "description": "6 oz. filet mignon and 6 oz. lobster tail",
            "price": "$60.45"
          },
          {
            "name": "Twin Lobster Tails",
            "description": "6 oz. tails",
            "price": "$65.55"
          },
          {
            "name": "6 oz. Butt Steak & Skewer of Shrimp",
            "price": "$38.95"
          }
        ]
      },
      {
        "name": "Beverages",
        "items": [
          {
            "name": "Coffee, Tea or Iced Tea",
            "price": "$3.00"
          },
          {
            "name": "Milk",
            "price": "$4.00"
          },
          {
            "name": "Soft Drinks",
            "price": "$3.00"
          }
        ]
      }
    ]
  },
  "taco-patio": {
    "source": {
      "label": "Taco Patio’s online ordering page",
      "url": "https://tacopatio.hrpos.heartland.us/menu"
    },
    "sourceKind": "first-party-ordering",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Tacos",
        "items": [
          {
            "name": "Steak Taco",
            "description": "Double soft corn tortilla with cheese, lettuce and tomatoes",
            "price": "$3.79"
          },
          {
            "name": "Chicken Taco",
            "description": "Double soft corn tortilla with cheese, lettuce and tomatoes",
            "price": "$3.79"
          },
          {
            "name": "Ground Beef Taco",
            "description": "Double soft corn tortilla with cheese, lettuce and tomatoes",
            "price": "$3.79"
          },
          {
            "name": "Pork Taco",
            "description": "Double soft corn tortilla with cheese, lettuce and tomatoes",
            "price": "$3.79"
          },
          {
            "name": "Shrimp Taco",
            "description": "Double soft corn tortilla with cheese, lettuce and homemade shrimp sauce",
            "price": "$4.39"
          },
          {
            "name": "Fish Taco",
            "description": "Double soft corn tortilla with cheese, cabbage and chipotle mayonnaise",
            "price": "$4.39"
          }
        ]
      },
      {
        "name": "Burritos",
        "items": [
          {
            "name": "Steak Burrito",
            "description": "Served with beans, cheese, lettuce and tomatoes",
            "price": "$9.59"
          },
          {
            "name": "Chicken Burrito",
            "description": "Served with beans, cheese, lettuce and tomatoes",
            "price": "$9.59"
          },
          {
            "name": "Ground Beef Burrito",
            "description": "Served with beans, cheese, lettuce and tomatoes",
            "price": "$9.59"
          },
          {
            "name": "Pork Burrito",
            "description": "Served with beans, cheese, lettuce and tomatoes",
            "price": "$9.59"
          },
          {
            "name": "Chorizo Burrito",
            "description": "Served with beans, cheese, lettuce and tomatoes",
            "price": "$9.69"
          },
          {
            "name": "Burrito Bowl",
            "description": "Served with rice, beans, cheese, lettuce and tomatoes",
            "price": "$9.89"
          },
          {
            "name": "El Gigante Burrito with Extra Meat",
            "description": "Served with beans, cheese, lettuce and tomatoes",
            "price": "$11.69"
          },
          {
            "name": "Burrito Suizo",
            "description": "Beans, cheese, lettuce and tomatoes, topped with melted cheese",
            "price": "$10.59"
          }
        ]
      },
      {
        "name": "Meal Deals",
        "items": [
          {
            "name": "Meal Deal #1 (Two Tacos)",
            "description": "With rice, beans and a regular drink; fries can replace rice and beans",
            "price": "$11.09"
          },
          {
            "name": "Meal Deal #2 (1 Taco Of Your Choice And 1 Tamale)",
            "description": "With rice, beans and a regular drink; fries can replace rice and beans",
            "price": "$11.09"
          },
          {
            "name": "Meal Deal #3 (1 Taco Of Your Choice And 1 Quesadilla)",
            "description": "With rice, beans and a regular drink; fries can replace rice and beans",
            "price": "$11.09"
          }
        ]
      },
      {
        "name": "Dinners",
        "items": [
          {
            "name": "A Burrito Served Suizo Style",
            "description": "Served with rice, beans, and chips with guacamole",
            "price": "$13.99"
          },
          {
            "name": "B 3 Tacos",
            "price": "$13.89"
          },
          {
            "name": "C Fajita Dinner",
            "description": "Served with rice, beans, and chips with guacamole. Price shown is for steak",
            "price": "$13.39"
          },
          {
            "name": "D 3 Enchiladas",
            "description": "Served with rice, beans, and chips with guacamole. Price shown is for steak",
            "price": "$12.39"
          },
          {
            "name": "E Combo 2 Tacos and 1 Stuffed Pepper",
            "description": "Served with rice, beans, and chips with guacamole",
            "price": "$13.89"
          },
          {
            "name": "F 1 Taco, 1 Quesadilla, and 1 Tamale",
            "description": "Served with rice, beans, and chips with guacamole",
            "price": "$13.89"
          },
          {
            "name": "G Quesadilla Dinner",
            "description": "Served with rice, beans, and chips with guacamole. Price shown is for cheese",
            "price": "$13.99"
          }
        ]
      },
      {
        "name": "Tortas",
        "items": [
          {
            "name": "Steak Torta",
            "description": "Served with cheese, lettuce, tomatoes, sour cream and guacamole",
            "price": "$8.99"
          },
          {
            "name": "Milanesa Torta",
            "description": "Served with cheese, lettuce, tomatoes, sour cream and guacamole",
            "price": "$8.99"
          },
          {
            "name": "Chicken Torta",
            "description": "Served with cheese, lettuce, tomatoes, sour cream and guacamole",
            "price": "$8.99"
          },
          {
            "name": "Pork Torta",
            "description": "Served with cheese, lettuce, tomatoes, sour cream and guacamole",
            "price": "$8.99"
          }
        ]
      },
      {
        "name": "A la Carte",
        "items": [
          {
            "name": "Nacho Chips",
            "description": "With cheese or salsa, chili and cheese, or guacamole. Price shown is for cheese",
            "price": "$4.89"
          },
          {
            "name": "Nacho Supreme",
            "description": "Cheese, beans, tomatoes, green onions, olives, sour cream, guacamole. Veggie price shown",
            "price": "$8.75"
          },
          {
            "name": "Taco Salad",
            "description": "Crispy flour shell with beans, lettuce, cheese, tomatoes, onions, olives, sour cream",
            "price": "$10.09"
          },
          {
            "name": "Steak Fajita",
            "description": "Flour tortilla with cheese, grilled onions, grilled peppers and tomatoes",
            "price": "$5.65"
          },
          {
            "name": "Steak Tostada",
            "description": "Served with beans, cheese, lettuce and tomatoes",
            "price": "$4.89"
          },
          {
            "name": "Steak Super Taco",
            "description": "Served with cheese, lettuce and tomatoes",
            "price": "$6.29"
          },
          {
            "name": "Steak Chimichanga",
            "description": "Fried flour tortilla with beans and cheese; lettuce, tomatoes, sour cream, guacamole",
            "price": "$10.59"
          },
          {
            "name": "Three Taquitos (Steak)",
            "description": "Served with cheese, lettuce, tomatoes, sour cream and guacamole",
            "price": "$9.99"
          }
        ]
      }
    ]
  },
  "tastee-rolls": {
    "source": {
      "label": "Tastee Rolls’ website",
      "url": "https://www.tasteerolls.com/popmenu-order/bellwood/menus/menu-synced"
    },
    "sourceKind": "own-site",
    "checked": "2026-11-10",
    "sections": [
      {
        "name": "Egg Rolls",
        "items": [
          {
            "name": "Jerk Chicken Egg Roll",
            "description": "Chicken breast marinated in spicy jerk sauce, rolled with cabbage and cheese",
            "price": "$4.68"
          },
          {
            "name": "Italian Beef Egg Roll",
            "description": "Thin-sliced roast beef in au jus with giardiniera and cheese",
            "price": "$5.20"
          },
          {
            "name": "Garlic Parmesan Chicken Egg Roll",
            "description": "Chicken breast marinated in garlic parmesan sauce, with cheese",
            "price": "$4.68"
          },
          {
            "name": "Philly Steak Egg Roll",
            "price": "$5.20"
          },
          {
            "name": "Obama Egg Roll",
            "description": "Jerk chicken and jerk steak with cheese, lettuce and spicy giardiniera",
            "price": "$8.84"
          },
          {
            "name": "Soul Food Roll",
            "price": "$8.84"
          },
          {
            "name": "Salmon Egg Roll",
            "price": "$10.40"
          },
          {
            "name": "Peach Cobbler Egg Roll",
            "price": "$6.24"
          }
        ]
      },
      {
        "name": "Foot Long 12 Inch Egg Rolls",
        "items": [
          {
            "name": "12 inch Jerk Chicken Egg Roll",
            "description": "Chicken breast marinated in spicy jerk sauce, rolled with cabbage and cheese",
            "price": "$9.36"
          },
          {
            "name": "12 inch BBQ Chicken Egg Roll",
            "description": "Chopped fried chicken breast tossed in BBQ sauce, with cheese",
            "price": "$9.36"
          },
          {
            "name": "12 inch Italian Beef Egg Roll",
            "description": "Thin-sliced roast beef in au jus with giardiniera and cheese",
            "price": "$10.40"
          },
          {
            "name": "12 inch Philly Cheese Steak Egg Roll",
            "description": "Marinated steak with bell pepper, onion and cheese",
            "price": "$10.40"
          },
          {
            "name": "12 inch Obama",
            "description": "Jerk chicken and jerk steak with cheese, lettuce and spicy giardiniera",
            "price": "$12.48"
          },
          {
            "name": "12 inch Soul Roll",
            "price": "$12.48"
          },
          {
            "name": "Twisted Ft Long",
            "price": "$13.52"
          }
        ]
      },
      {
        "name": "Rice Bowls",
        "items": [
          {
            "name": "Grill Chicken Rice Bowl",
            "description": "Seasoned yellow rice with bell pepper, onion and grilled chicken, topped with cheese",
            "price": "$14.04"
          },
          {
            "name": "Jerk Chicken Rice Bowl",
            "description": "Seasoned yellow rice with bell pepper, onion and jerk chicken, topped with cheese",
            "price": "$14.04"
          },
          {
            "name": "Steak Rice Bowl",
            "description": "Seasoned yellow rice with bell pepper, onion and steak, topped with cheese",
            "price": "$15.60"
          },
          {
            "name": "Shrimp Rice Bowl",
            "description": "Seasoned yellow rice with bell pepper, onion and sauteed shrimp, topped with cheese",
            "price": "$15.60"
          },
          {
            "name": "Gyro Rice Bowl",
            "price": "$16.64"
          },
          {
            "name": "Veggie Rice Bowl",
            "description": "Seasoned yellow rice with bell pepper, onion and fresh vegetables",
            "price": "$13.00"
          },
          {
            "name": "Two (2) Meat Rice Bowl",
            "description": "Seasoned yellow rice with bell pepper, onion and cheese, with a choice of meats",
            "price": "$18.20"
          },
          {
            "name": "Three (3) Meat Rice Bowl",
            "description": "Seasoned yellow rice with bell pepper, onion and cheese, with a choice of meats",
            "price": "$20.28"
          }
        ]
      },
      {
        "name": "Chicken Wings",
        "items": [
          {
            "name": "5 Wings with Hand cut Fries",
            "price": "$10.40"
          },
          {
            "name": "10 Wings with Hand cut Fries",
            "price": "$20.80"
          },
          {
            "name": "15 Wings with Hand cut Fries",
            "price": "$23.92"
          },
          {
            "name": "20 Wings with Hand cut Fries",
            "price": "$41.60"
          },
          {
            "name": "35 Wings with Hand cut Fries",
            "price": "$62.40"
          },
          {
            "name": "50 Wings with Hand cut Fries",
            "price": "$78.00"
          }
        ]
      },
      {
        "name": "Tacos",
        "items": [
          {
            "name": "Jerk Chicken Taco",
            "description": "Spicy jerk chicken with cheese, lettuce and tomato in a corn tortilla shell",
            "price": "$4.16"
          },
          {
            "name": "Jerk Steak Taco",
            "description": "Jerk steak with cheese, lettuce, onion and sour cream in a corn tortilla shell",
            "price": "$4.16"
          },
          {
            "name": "Jerk Shrimp Taco",
            "description": "Jerk shrimp with cheese, lettuce, onion and sour cream in a corn tortilla",
            "price": "$4.16"
          },
          {
            "name": "Ground Beef Taco",
            "description": "Seasoned ground beef with cheese, lettuce and tomato in a corn tortilla",
            "price": "$4.16"
          },
          {
            "name": "Grilled Chicken Taco",
            "description": "Seasoned grilled chicken with cheese, lettuce and tomato in a corn tortilla",
            "price": "$4.16"
          },
          {
            "name": "Grilled Steak Taco",
            "description": "Seasoned grilled steak with cheese, lettuce and tomato in a corn tortilla",
            "price": "$4.16"
          }
        ]
      },
      {
        "name": "Fries",
        "items": [
          {
            "name": "Regular Fry Small (SM)",
            "description": "Hand-cut fries, fried fresh",
            "price": "$3.64"
          },
          {
            "name": "Regular Fry Large (LG)",
            "description": "Hand-cut fries, fried fresh",
            "price": "$5.72"
          },
          {
            "name": "Cheese Fry Small (SM)",
            "price": "$6.24"
          },
          {
            "name": "Jerk Chicken Fries Small (SM)",
            "description": "Hand-cut fries covered with jerk chicken and cheese",
            "price": "$7.28"
          },
          {
            "name": "Jerk Steak Fries Small (SM)",
            "price": "$8.32"
          },
          {
            "name": "Gyro Fries Small (SM)",
            "price": "$8.32"
          },
          {
            "name": "Italian Beef Fries Small (SM)",
            "price": "$8.32"
          }
        ]
      }
    ]
  }
};
