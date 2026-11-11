import type { MenuItem, MenuSection, RestaurantMenu } from "@/content/menus";

/** What dish search needs from a stop. Kept structural so the tests can pass plain objects. */
export type MenuStop = {
  slug: string;
  name: string;
  signature: string[];
  status: { open: boolean };
  menu?: RestaurantMenu | null;
};

export type DishHit = { slug: string; kitchen: string; open: boolean; section: string; item: MenuItem };

/** Lowercase, and drop accents so "camaron" finds "Camarón". */
export const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const searchWords = (q: string) => fold(q).trim().split(/\s+/).filter(Boolean);

/** The sections a card shows. A kitchen with no published menu falls back to
 *  the dishes it is known for, which carry no prices. */
export function menuSections(stop: Pick<MenuStop, "signature" | "menu">): MenuSection[] {
  if (stop.menu?.sections.length) return stop.menu.sections;
  return stop.signature.length ? [{ name: "Known for", items: stop.signature.map(name => ({ name })) }] : [];
}

export const hasPublishedMenu = (stop: Pick<MenuStop, "menu">) => !!stop.menu?.sections.length;
export const dishCount = (stop: Pick<MenuStop, "signature" | "menu">) => menuSections(stop).reduce((n, s) => n + s.items.length, 0);

/** Every searchable word on a stop's menu, for the kitchen filter. */
export const menuText = (stop: Pick<MenuStop, "signature" | "menu">) =>
  menuSections(stop).flatMap(s => [s.name, ...s.items.flatMap(i => [i.name, i.description ?? ""])]).join(" ");

/** Dishes on one stop's menu matching every word. A word may match the dish,
 *  its description, or its section ("tacos" finds the Steak under Tacos). */
export function matchDishes(stop: Pick<MenuStop, "signature" | "menu">, words: string[]): { section: string; item: MenuItem }[] {
  if (!words.length) return [];
  const hits: { section: string; item: MenuItem; rank: number }[] = [];
  for (const section of menuSections(stop)) for (const item of section.items) {
    const name = fold(item.name), rest = fold(`${item.description ?? ""} ${section.name}`);
    if (!words.every(w => name.includes(w) || rest.includes(w))) continue;
    hits.push({ section: section.name, item, rank: words.every(w => name.includes(w)) ? 0 : 1 });
  }
  return hits.sort((a, b) => a.rank - b.rank).map(({ section, item }) => ({ section, item }));
}

/** Dish search across the whole village: dishes named for the query first,
 *  then open kitchens before closed ones, spread so one long menu cannot fill
 *  the list on its own. */
export function searchDishes(stops: MenuStop[], q: string, limit = 8): { hits: DishHit[]; kitchens: number; total: number } {
  const words = searchWords(q);
  if (!words.length) return { hits: [], kitchens: 0, total: 0 };
  const perStop = stops.map(stop => ({ stop, dishes: matchDishes(stop, words) })).filter(x => x.dishes.length)
    .sort((a, b) => Number(b.stop.status.open) - Number(a.stop.status.open));
  const hits: DishHit[] = [];
  for (let round = 0; hits.length < limit && perStop.some(x => x.dishes[round]); round++) {
    for (const { stop, dishes } of perStop) {
      if (dishes[round] && hits.length < limit) hits.push({ slug: stop.slug, kitchen: stop.name, open: stop.status.open, ...dishes[round] });
    }
  }
  return { hits, kitchens: perStop.length, total: perStop.reduce((n, x) => n + x.dishes.length, 0) };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "2026-11-10" -> "November 2026". */
export function checkedLabel(iso: string) {
  const [year, month] = iso.split("-").map(Number);
  return MONTHS[month - 1] ? `${MONTHS[month - 1]} ${year}` : iso;
}

/** One honest sentence about where a menu came from. */
export function sourceNote(menu: RestaurantMenu) {
  const when = checkedLabel(menu.checked);
  if (menu.sourceKind === "delivery-marketplace") return `Menu and prices from ${menu.source.label}, checked ${when}. Delivery prices are often higher than at the counter.`;
  if (menu.sourceKind === "directory") return `Menu from ${menu.source.label}, checked ${when}. It may be out of date.`;
  return `Menu from ${menu.source.label}, checked ${when}.`;
}
