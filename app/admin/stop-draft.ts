import { CORRIDORS, type DayHours, type Meal, type Restaurant } from "@/content/restaurants";

/* The stop editor's working copy, shared by the form (client) and the save
 * action (server). Lists are comma-separated text and hours are "HH:MM"
 * strings so every field maps straight onto an input. */

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MEAL_OPTIONS: Meal[] = ["breakfast", "lunch", "dinner"];
export const CORRIDOR_KEYS = Object.keys(CORRIDORS) as Restaurant["corridor"][];

export interface HoursRow { closed: boolean; open: string; close: string }

export interface StopDraft {
  name: string; tagline: string; site: string; builtByGci: boolean;
  address: string; phone: string; neighborhood: string; corridor: Restaurant["corridor"]; since: string;
  cuisine: string; signature: string;
  dineIn: "yes" | "no" | "unknown"; meals: Meal[];
  hours: HoursRow[];
  image: string; imageAlt: string; hidden: boolean;
}

const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function rowsFromSchedule(s: DayHours[]): HoursRow[] {
  return DAY_NAMES.map((_, i) => (s[i] ? { closed: false, open: hhmm(s[i]![0]), close: hhmm(s[i]![1]) } : { closed: true, open: "11:00", close: "20:00" }));
}

/** Rows back to minutes. A close at or before the open runs past midnight. */
export function scheduleFromRows(rows: HoursRow[]): DayHours[] {
  const toMin = (t: string) => { const m = /^(\d{1,2}):(\d{2})$/.exec(t); if (!m) throw new Error(`"${t}" isn't a time.`); return +m[1] * 60 + +m[2]; };
  return rows.map((r) => {
    if (r.closed) return null;
    const o = toMin(r.open), c = toMin(r.close);
    return [o, c <= o ? c + 1440 : c] as const;
  });
}

export function toDraft(r?: Restaurant): StopDraft {
  return {
    name: r?.name ?? "", tagline: r?.tagline ?? "", site: r?.site ?? "", builtByGci: r?.builtByGci ?? false,
    address: r?.address ?? "", phone: r?.phone ?? "", neighborhood: r?.neighborhood ?? "Chatham",
    corridor: r?.corridor ?? "75th", since: r?.since ?? "",
    cuisine: (r?.cuisine ?? []).join(", "), signature: (r?.signature ?? []).join(", "),
    dineIn: r?.dineIn === undefined ? "unknown" : r.dineIn ? "yes" : "no", meals: r?.meals ?? [],
    hours: rowsFromSchedule(r?.schedule ?? [null, null, null, null, null, null, null]),
    image: r?.image ?? "", imageAlt: r?.imageAlt ?? "", hidden: r?.hidden ?? false,
  };
}

export const splitList = (s: string) => s.split(",").map((t) => t.trim()).filter(Boolean);
export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 48);
