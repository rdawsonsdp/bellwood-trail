import "server-only";
import type { DayHours } from "@/content/restaurants";

/**
 * Reads what a restaurant's own home page publishes about itself.
 *
 * Sites built on the GCI template emit schema.org Restaurant JSON-LD — hours,
 * phone, address — and that block is what drives their own open/closed chip
 * and their Google listing, so it is the freshest source there is. Some list
 * several locations (Tropic Island has three, Uncle John's two); the node
 * whose street number matches the stop's own address wins, else the first.
 *
 * The public page reads through the fetch cache (ten minutes, tag SITE_TAG);
 * the admin reads fresh. Any failure returns ok:false with a plain-English
 * reason, and callers fall back to the stored values.
 */

export const SITE_TAG = "site-data";

export interface SiteImage { src: string; alt: string }
export interface SiteSnapshot {
  ok: boolean;
  /** Why the fetch failed, in words an editor can act on. */
  error?: string;
  schedule?: DayHours[];
  phone?: string;
  address?: string;
  /** Photos on the home page, in page order — for the admin's photo picker. */
  images: SiteImage[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + (m || 0); };

type LdNode = Record<string, unknown> & {
  openingHoursSpecification?: { dayOfWeek?: string | string[]; opens?: string; closes?: string }[];
  telephone?: string;
  address?: string | { streetAddress?: string; addressLocality?: string; addressRegion?: string; postalCode?: string };
};

function ldNodes(html: string): LdNode[] {
  const out: LdNode[] = [];
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data: unknown;
    try { data = JSON.parse(m[1]); } catch { continue; }
    const list = Array.isArray(data) ? data : ((data as { "@graph"?: unknown[] })?.["@graph"] ?? [data]);
    for (const n of list as LdNode[]) if (n && (n.openingHoursSpecification || n.telephone || n.address)) out.push(n);
  }
  return out;
}

const streetOf = (a: LdNode["address"]) => (typeof a === "string" ? a : a?.streetAddress ?? "");
const streetNumber = (s: string) => s.trim().match(/^\d+/)?.[0];

function pickNode(nodes: LdNode[], storedAddress: string): LdNode | undefined {
  const want = streetNumber(storedAddress);
  return (want && nodes.find((n) => streetNumber(streetOf(n.address)) === want))
    || nodes.find((n) => Array.isArray(n.openingHoursSpecification))
    || nodes[0];
}

function scheduleOf(n: LdNode): DayHours[] | undefined {
  const spec = n.openingHoursSpecification;
  if (!Array.isArray(spec) || spec.length === 0) return undefined;
  const sched: DayHours[] = [null, null, null, null, null, null, null];
  for (const s of spec) {
    if (!s.opens || !s.closes) continue;
    for (const d of Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [s.dayOfWeek ?? ""]) {
      const i = DAYS.indexOf(String(d).replace(/^.*\//, "")); if (i < 0) continue;
      const o = toMin(s.opens), c = toMin(s.closes);
      // closes <= opens = spans midnight (Harold's 11:00 → 01:00).
      sched[i] = [o, c <= o ? c + 1440 : c];
    }
  }
  return sched;
}

/** "+1-773-488-9533" → "(773) 488-9533". */
export function formatPhone(raw: string): string | undefined {
  const d = raw.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : undefined;
}
/** "(773) 488-9533" → "tel:+17734889533"; "" when there is no usable number. */
export function phoneHref(phone: string): string {
  const d = phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `tel:+1${d}` : "";
}

function addressOf(a: LdNode["address"]): string | undefined {
  if (!a) return undefined;
  if (typeof a === "string") return a.trim() || undefined;
  const region = [a.addressRegion, a.postalCode].filter(Boolean).join(" ");
  return [a.streetAddress, a.addressLocality, region].filter(Boolean).join(", ") || undefined;
}

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** Every photo on the page, absolute, deduped. og:image / JSON-LD images often
 *  name the business's future domain, so those are re-pointed at the page's own host. */
function imagesOf(html: string, pageUrl: string): SiteImage[] {
  const origin = new URL(pageUrl).origin;
  const seen = new Set<string>(); const out: SiteImage[] = [];
  const add = (raw: string, alt: string, rehost = false) => {
    let src = decode(raw.trim());
    if (!src || src.startsWith("data:")) return;
    const opt = src.match(/\/_next\/image\?url=([^&]+)/); // next/image — take the original
    if (opt) src = decodeURIComponent(opt[1]);
    let u: URL; try { u = new URL(src, pageUrl); } catch { return; }
    if (rehost) u = new URL(u.pathname + u.search, origin);
    if (!/^https?:$/.test(u.protocol) || /\.(svg|ico)$/i.test(u.pathname)) return;
    const key = u.href.replace(/[?&]dpl=[^&]+/, "");
    if (seen.has(key)) return;
    seen.add(key); out.push({ src: key, alt: decode(alt) });
  };
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1]; if (!src) continue;
    add(src, tag.match(/\salt="([^"]*)"/)?.[1] ?? "");
  }
  const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1];
  if (og) add(og, "Link-preview image", true);
  for (const n of ldNodes(html)) {
    const img = n.image; const first = Array.isArray(img) ? img[0] : img;
    if (typeof first === "string") add(first, "Image listed in the site's structured data", true);
  }
  return out.slice(0, 48);
}

function describe(e: unknown): string {
  const code = (e as { cause?: { code?: string } })?.cause?.code ?? (e as { name?: string })?.name;
  switch (code) {
    case "CERT_HAS_EXPIRED": return "The site's SSL certificate has expired — visitors see a security warning.";
    case "ERR_TLS_CERT_ALTNAME_INVALID": case "DEPTH_ZERO_SELF_SIGNED_CERT": case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
      return "The site's SSL certificate isn't valid — visitors see a security warning.";
    case "ENOTFOUND": return "That domain doesn't exist or isn't pointed anywhere yet.";
    case "ECONNREFUSED": case "ECONNRESET": return "The site refused the connection.";
    case "TimeoutError": case "AbortError": return "The site took more than 8 seconds to answer.";
    default: return "Couldn't reach the site.";
  }
}

export async function fetchSite(site: string, storedAddress: string, opts: { fresh?: boolean } = {}): Promise<SiteSnapshot> {
  try {
    const res = await fetch(site, {
      ...(opts.fresh ? { cache: "no-store" as const } : { next: { revalidate: 600, tags: [SITE_TAG] } }),
      headers: { "User-Agent": "ChathamCulinaryPath/1.0 (+https://www.gci2016.org/)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, error: `The site answered with an error (HTTP ${res.status}).`, images: [] };
    const html = await res.text();
    const node = pickNode(ldNodes(html), storedAddress);
    return {
      ok: true,
      schedule: node && scheduleOf(node),
      phone: node?.telephone ? formatPhone(node.telephone) : undefined,
      address: node && addressOf(node.address),
      images: opts.fresh ? imagesOf(html, res.url || site) : [],
    };
  } catch (e) {
    return { ok: false, error: describe(e), images: [] };
  }
}
