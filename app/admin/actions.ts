"use server";
import { DEFAULT_HERO } from "@/content/hero";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { CORRIDORS, type Restaurant } from "@/content/restaurants";
import { UPDATE_TAGS, type Update } from "@/content/updates";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/app/lib/admin-auth";
import { CONTENT_TAG, ConflictError, IMAGE_TYPES, MAX_IMAGE_BYTES, readContent, saveImage, writeContent, type SiteContent } from "@/app/lib/content-store";
import { SITE_TAG, fetchSite, formatPhone, phoneHref } from "@/app/lib/site-data";
import { coordinatesFromDraft, MEAL_OPTIONS, scheduleFromRows, slugify, splitList, type StopDraft } from "./stop-draft";

export interface FormState { error?: string }

/* ---------- session ---------- */

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!passwordMatches(String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    return { error: "That password isn't right." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/* ---------- shared ---------- */

const httpUrl = (s: string) => { try { const u = new URL(s); return /^https?:$/.test(u.protocol) ? u.href.replace(/\/$/, "") : null; } catch { return null; } };
const fail = (e: unknown): FormState => ({ error: e instanceof Error ? e.message : "Something went wrong saving that." });

/** Read, apply `change`, write back against the version the editor loaded. */
async function mutate(version: string, change: (c: SiteContent) => SiteContent): Promise<void> {
  const current = await readContent();
  if (current.version !== version) throw new ConflictError();
  await writeContent(change(current), current.version);
  updateTag(CONTENT_TAG);
}

/* ---------- stops ---------- */

/** What the restaurant's site publishes right now — for the editor's "Check the site" panel. */
export async function loadSite(site: string, address: string) {
  await requireAdmin();
  const url = httpUrl(site);
  if (!url) return { ok: false, error: "Enter the site's full address, starting with https://", images: [] };
  return fetchSite(url, address, { fresh: true });
}

async function photoFrom(form: FormData, slug: string): Promise<string | null> {
  const file = form.get("photo");
  if (file instanceof File && file.size > 0) return saveImage(file, slug);
  const from = httpUrl(String(form.get("copyFrom") ?? ""));
  if (!from) return null;
  const res = await fetch(from, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  const type = (res.headers.get("content-type") ?? "").split(";")[0];
  if (!res.ok || !IMAGE_TYPES.includes(type)) throw new Error("Couldn't copy that photo from the site. Try another, or upload it.");
  if (Number(res.headers.get("content-length") ?? 0) > MAX_IMAGE_BYTES) throw new Error("That photo is over 4 MB. Upload a smaller copy instead.");
  return saveImage(new Blob([await res.arrayBuffer()], { type }), slug);
}

export async function saveStop(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  let savedName = "";
  try {
    const d = JSON.parse(String(form.get("data"))) as StopDraft;
    const originalSlug = String(form.get("originalSlug") ?? "");
    const version = String(form.get("version") ?? "");

    const name = d.name.trim();
    if (!name) return { error: "Give the stop a name." };
    // A stop with no website is normal here: most Bellwood kitchens have
    // none yet. An entered address still has to be a real http(s) one.
    const typedSite = d.site.trim();
    const site = typedSite ? httpUrl(typedSite) : "";
    if (site === null) return { error: "The website needs to be a full address, starting with https://" };
    if (!(d.corridor in CORRIDORS)) return { error: "Pick which corridor the stop is on." };
    const phone = d.phone.trim() ? formatPhone(d.phone) : "";
    if (phone === undefined) return { error: "The phone number should be a 10-digit US number, like (773) 555-0100." };
    const schedule = scheduleFromRows(d.hours);

    const current = await readContent();
    const existing = current.restaurants.find((r) => r.slug === originalSlug);
    if (originalSlug && !existing) return { error: "That stop no longer exists — someone may have deleted it. Go back to the list." };
    let slug = existing?.slug ?? slugify(name);
    if (!slug) return { error: "Give the stop a name with at least one letter or number." };
    // "new" is taken by the /admin/stops/new route.
    if (!existing) { let n = 2; const base = slug; while (slug === "new" || current.restaurants.some((r) => r.slug === slug)) slug = `${base}-${n++}`; }

    // No photo is also normal: the card falls back to the stop's name plate
    // rather than borrow a picture of somewhere else.
    const image = (await photoFrom(form, slug)) ?? d.image.trim();

    const stop: Restaurant = {
      ...existing,
      slug, name, site, phone, phoneHref: phone ? phoneHref(phone) : "",
      tagline: d.tagline.trim(), liveDetails: d.liveDetails,
      address: d.address.trim(), neighborhood: d.neighborhood.trim(), corridor: d.corridor,
      since: d.since.trim() || undefined,
      cuisine: splitList(d.cuisine), signature: splitList(d.signature),
      dineIn: d.dineIn === "unknown" ? undefined : d.dineIn === "yes",
      meals: MEAL_OPTIONS.filter((m) => d.meals.includes(m)),
      schedule, image, imageAlt: d.imageAlt.trim() || undefined, hidden: d.hidden || undefined,
      ...coordinatesFromDraft(d.lat ?? "", d.lng ?? ""),
    };
    await mutate(version, (c) => ({
      ...c,
      restaurants: existing ? c.restaurants.map((r) => (r.slug === slug ? stop : r)) : [...c.restaurants, stop],
    }));
    savedName = name;
  } catch (e) {
    return fail(e);
  }
  redirect(`/admin?saved=${encodeURIComponent(savedName)}`);
}

export async function locateStop(address: string): Promise<{ lat: number; lng: number; matchedAddress: string } | { error: string }> {
  await requireAdmin();
  if (!address.trim() || address.length > 300) return { error: "Enter the complete street address first." };
  try {
    const params = new URLSearchParams({ address: address.trim(), benchmark: "Public_AR_Current", format: "json" });
    const response = await fetch(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Map lookup unavailable.");
    const data = await response.json();
    const matches = data.result?.addressMatches;
    if (!Array.isArray(matches) || matches.length !== 1) return { error: "No unique location found. Check the street address, city and ZIP, or enter coordinates below." };
    const match = matches[0];
    const point = coordinatesFromDraft(String(match.coordinates?.y), String(match.coordinates?.x));
    return { lat: point.lat!, lng: point.lng!, matchedAddress: String(match.matchedAddress) };
  } catch { return { error: "Map lookup is unavailable right now. Try again or enter the coordinates below." }; }
}

/** Deletes can't show a form error, so a conflict comes back as a notice on the list. */
async function mutateOrNotice(version: string, change: (c: SiteContent) => SiteContent): Promise<void> {
  try { await mutate(version, change); } catch (e) { if (e instanceof ConflictError) redirect("/admin?conflict=1"); throw e; }
}

export async function deleteStop(form: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(form.get("slug"));
  await mutateOrNotice(String(form.get("version")), (c) => ({ ...c, restaurants: c.restaurants.filter((r) => r.slug !== slug) }));
  redirect("/admin?deleted=1");
}

/** Drop the ten-minute cache of every restaurant site so the cards re-read them on the next visit. */
export async function refreshSites(): Promise<void> {
  await requireAdmin();
  updateTag(SITE_TAG);
  redirect("/admin?refreshed=1");
}

/* ---------- updates feed ---------- */

export async function saveUpdate(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = String(form.get("id") ?? "");
    const title = String(form.get("title") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    const date = String(form.get("date") ?? "");
    const tag = String(form.get("tag")) as Update["tag"];
    const rawHref = String(form.get("href") ?? "").trim();
    const href = rawHref ? httpUrl(rawHref) : undefined;
    if (!title) return { error: "Give the update a headline." };
    if (!body) return { error: "Write a sentence or two for the update." };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Pick a date." };
    if (!UPDATE_TAGS.includes(tag)) return { error: "Pick a label." };
    if (href === null) return { error: "The link needs to be a full address, starting with https://" };

    const version = String(form.get("version") ?? "");
    await mutate(version, (c) => {
      const update: Update = { id: id || `${date}-${slugify(title) || "update"}-${Date.now().toString(36)}`, date, title, body, tag, href };
      return { ...c, updates: id ? c.updates.map((u) => (u.id === id ? update : u)) : [update, ...c.updates] };
    });
  } catch (e) {
    return fail(e);
  }
  redirect("/admin?saved=update#updates");
}

export async function deleteUpdate(form: FormData): Promise<void> {
  await requireAdmin();
  const id = String(form.get("id"));
  await mutateOrNotice(String(form.get("version")), (c) => ({ ...c, updates: c.updates.filter((u) => u.id !== id) }));
  redirect("/admin?deleted=1#updates");
}

/* ---------- homepage hero ---------- */
export async function saveHero(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const version = String(form.get("version") ?? "");
    const current = await readContent();
    if (current.version !== version) throw new ConflictError();
    const imageAlt = String(form.get("imageAlt") ?? "").trim();
    if (!imageAlt || imageAlt.length > 250) return { error: "Describe the hero image in 1 to 250 characters." };
    const file = form.get("photo");
    const image = file instanceof File && file.size > 0
      ? await saveImage(file, "homepage-hero")
      : (current.hero ?? DEFAULT_HERO).image;
    await mutate(version, content => ({ ...content, hero: { image, imageAlt } }));
  } catch (error) { return fail(error); }
  redirect("/admin/hero?saved=1");
}
