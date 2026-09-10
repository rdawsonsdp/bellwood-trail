import "server-only";
import { RESTAURANTS, type DayHours, type Restaurant } from "@/content/restaurants";
import { openState, type OpenState } from "./hours";

/**
 * Live open/closed for every stop on the path.
 *
 * Sites built on the GCI template all emit a schema.org
 * openingHoursSpecification, and that block is what drives their own
 * open/closed chips and their Google listings — so it is the freshest
 * possible source. We fetch each site at request time (ISR-cached for ten
 * minutes so ten kitchens are not hit on every page view), parse the hours
 * out of the JSON-LD, and compute the state here. If a fetch fails or the
 * block is missing, the stop falls back to the schedule in content/, so a
 * restaurant site being down never takes a card off the trail.
 */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + (m || 0); };

function scheduleFromJsonLd(html: string): DayHours[] | null {
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  for (const raw of blocks) {
    let data: unknown;
    try { data = JSON.parse(raw); } catch { continue; }
    const nodes = (Array.isArray(data) ? data : [data]) as Record<string, unknown>[];
    for (const n of nodes) {
      const spec = n?.openingHoursSpecification as { dayOfWeek?: string | string[]; opens?: string; closes?: string }[] | undefined;
      if (!Array.isArray(spec) || spec.length === 0) continue;
      const sched: DayHours[] = [null, null, null, null, null, null, null];
      for (const s of spec) {
        if (!s.opens || !s.closes) continue;
        const days = (Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [s.dayOfWeek ?? ""]).map((d) => String(d).replace(/^.*\//, ""));
        for (const d of days) {
          const i = DAYS.indexOf(d); if (i < 0) continue;
          const o = toMin(s.opens), c0 = toMin(s.closes);
          // closes < opens = spans midnight (Harold's 11:00 → 01:00).
          sched[i] = [o, c0 <= o ? c0 + 1440 : c0];
        }
      }
      return sched;
    }
  }
  return null;
}

export interface StopStatus extends OpenState { source: "live" | "static" }

export async function statusFor(r: Restaurant): Promise<StopStatus> {
  if (r.builtByGci) {
    try {
      const res = await fetch(r.site, { next: { revalidate: 600 }, headers: { "User-Agent": "ChathamCulinaryPath/1.0" } });
      if (res.ok) {
        const sched = scheduleFromJsonLd(await res.text());
        if (sched) return { ...openState(sched), source: "live" };
      }
    } catch { /* fall through to the static schedule */ }
  }
  return { ...openState(r.schedule), source: "static" };
}

export async function allStatuses(): Promise<Record<string, StopStatus>> {
  const entries = await Promise.all(RESTAURANTS.map(async (r) => [r.slug, await statusFor(r)] as const));
  return Object.fromEntries(entries);
}
