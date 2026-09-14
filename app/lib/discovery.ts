import { CORRIDORS, FOOD_CATEGORIES, type Meal, type Restaurant } from "@/content/restaurants";
import type { Stop } from "./live-status";

export type DiscoveryFilters = {
  q: string;
  area: Restaurant["corridor"] | "";
  foods: string[];
  meal: Meal | "";
  dining: "" | "dine-in" | "carryout";
  open: boolean;
  saved: boolean;
  sort: "path" | "name" | "open";
};
export const EMPTY_FILTERS: DiscoveryFilters = { q: "", area: "", foods: [], meal: "", dining: "", open: false, saved: false, sort: "path" };
const KEYS = ["q", "area", "food", "meal", "dining", "open", "saved", "sort"];

export function readFilters(params: URLSearchParams): DiscoveryFilters {
  const area = params.get("area") ?? "";
  const meal = params.get("meal") ?? "";
  const dining = params.get("dining") ?? "";
  const sort = params.get("sort") ?? "";
  return {
    q: (params.get("q") ?? "").slice(0, 200),
    area: Object.hasOwn(CORRIDORS, area) ? area as DiscoveryFilters["area"] : "",
    foods: [...new Set((params.get("food") ?? "").split(","))].filter(k => FOOD_CATEGORIES.some(c => c.key === k)),
    meal: ["breakfast", "lunch", "dinner"].includes(meal) ? meal as Meal : "",
    dining: dining === "dine-in" || dining === "carryout" ? dining : "",
    open: params.get("open") === "1",
    saved: params.get("saved") === "1",
    sort: sort === "name" || sort === "open" ? sort : "path",
  };
}

export function writeFilters(filters: DiscoveryFilters, current = new URLSearchParams()) {
  const params = new URLSearchParams(current);
  KEYS.forEach(key => params.delete(key));
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.area) params.set("area", filters.area);
  if (filters.foods.length) params.set("food", filters.foods.join(","));
  if (filters.meal) params.set("meal", filters.meal);
  if (filters.dining) params.set("dining", filters.dining);
  if (filters.open) params.set("open", "1");
  if (filters.saved) params.set("saved", "1");
  if (filters.sort !== "path") params.set("sort", filters.sort);
  return params;
}

export function inCategory(stop: Restaurant, key: string) {
  return FOOD_CATEGORIES.find(c => c.key === key)?.cuisines.some(c => stop.cuisine.includes(c)) ?? false;
}

export function filterStops(stops: Stop[], filters: DiscoveryFilters, saved: string[]) {
  const words = filters.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = stops.filter(s => {
    if (filters.open && !s.status.open) return false;
    if (filters.saved && !saved.includes(s.slug)) return false;
    if (filters.area && s.corridor !== filters.area) return false;
    if (filters.foods.length && !filters.foods.some(food => inCategory(s, food))) return false;
    if (filters.meal && !s.meals.includes(filters.meal)) return false;
    if (filters.dining && s.dineIn !== (filters.dining === "dine-in")) return false;
    const text = [s.name, s.tagline, s.address, s.neighborhood, CORRIDORS[s.corridor]?.label, ...s.cuisine, ...s.signature].join(" ").toLowerCase();
    return words.every(word => text.includes(word));
  });
  if (filters.sort === "name") matches.sort((a, b) => a.name.localeCompare(b.name));
  if (filters.sort === "open") matches.sort((a, b) => Number(b.status.open) - Number(a.status.open) || a.name.localeCompare(b.name));
  return matches;
}
