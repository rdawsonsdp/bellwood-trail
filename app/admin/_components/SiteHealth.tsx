import { fetchSite } from "@/app/lib/site-data";

/** One line per stop on the dashboard: is its site up, and are the card's details coming from it live? */
export async function SiteHealth({ site, address, live }: { site: string; address: string; live: boolean }) {
  const s = await fetchSite(site, address, { fresh: true });
  if (!s.ok) return <span className="font-semibold text-crimson">⚠ {s.error}</span>;
  if (!live) return <span className="text-warm-gray">Site up · card uses stored details</span>;
  const got = [s.schedule && "hours", s.phone && "phone", s.address && "address"].filter(Boolean);
  return got.length
    ? <span className="text-open">● Live: {got.join(", ")}</span>
    : <span className="font-semibold text-orange-ink">Site up, but it publishes no hours, phone or address — card uses stored details</span>;
}
