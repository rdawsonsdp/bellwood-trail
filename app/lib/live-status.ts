import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Restaurant } from "@/content/restaurants";
import { openState, type OpenState } from "./hours";
import { fetchSite, phoneHref } from "./site-data";

/**
 * The cards as visitors see them: the stored stop, overlaid with whatever its
 * own site publishes right now.
 *
 * For stops marked builtByGci the hours, phone and address come live from the
 * site's JSON-LD (fetch-cached ten minutes in site-data.ts). Anything the site
 * doesn't publish, or a site that is down, falls back to the stored value, so
 * a restaurant site going down never takes a card off the trail. Everything
 * else on the card — name, photo, tagline, tags — is edited in /admin.
 */

export interface StopStatus extends OpenState { source: "live" | "static" }
export type Stop = Restaurant & { status: StopStatus; imageSrc: string | null };

// A seed photo may be .jpg, .png or .webp depending on what its site served,
// and is stored without the extension. Resolve the real file once on the
// server rather than guessing. Photos saved from /admin carry a full URL.
export function resolveImage(image: string): string | null {
  if (/^https?:\/\//.test(image) || /\.\w{3,4}$/.test(image)) return image;
  for (const ext of ["jpg", "png", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", `${image}.${ext}`))) return `${image}.${ext}`;
  }
  return null;
}

async function resolveStop(r: Restaurant): Promise<Stop> {
  const live = r.builtByGci ? await fetchSite(r.site, r.address) : null;
  const phone = live?.phone ?? r.phone;
  const schedule = live?.schedule ?? r.schedule;
  return {
    ...r,
    phone,
    phoneHref: live?.phone ? phoneHref(live.phone) : r.phoneHref,
    address: live?.address ?? r.address,
    schedule,
    status: { ...openState(schedule), source: live?.schedule ? "live" : "static" },
    imageSrc: r.image ? resolveImage(r.image) : null,
  };
}

export async function resolveStops(restaurants: Restaurant[]): Promise<Stop[]> {
  return Promise.all(restaurants.filter((r) => !r.hidden).map(resolveStop));
}
