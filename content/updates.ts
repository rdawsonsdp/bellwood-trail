/* ===== Updates =====
 * A dated feed. Adding an update is adding an entry — newest first. Dates are
 * ISO so they sort and format without ambiguity. */
export interface Update {
  date: string;
  title: string;
  body: string;
  href?: string;
  tag: "New on the path" | "Event" | "FoodLab" | "Announcement";
}

export const UPDATES: Update[] = [
  { date: "2026-09-09", tag: "New on the path", title: "Three more stops join the Culinary Path",
    body: "Brown Sugar Bakery, Justice of the Pies and Oooh Wee! IT IS join the trail — caramel cake on 75th, pie in Avalon Park, and a Southern breakfast bar on Cottage Grove." },
  { date: "2026-09-09", tag: "Announcement", title: "Eight Greater Chatham kitchens get new websites",
    body: "Haire's, HerBachi, Harold's #24, Tropic Island, Dat Donut, Just Jerk Cafe, Soul Veg City and Uncle John's each launched a new site this week — with live hours, full menus and one-tap ordering." },
  { date: "2026-09-01", tag: "FoodLab", title: "FoodLab Chicago has now supported 100+ food businesses",
    body: "GCI's food-business program keeps growing. If you run a kitchen on the South Side, the door is open.", href: "https://www.gci2016.org/" },
];
