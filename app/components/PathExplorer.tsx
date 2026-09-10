"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CORRIDORS, type Restaurant } from "@/content/restaurants";
import type { StopStatus } from "@/app/lib/live-status";
import { Arrow, MapPin, Phone, Search } from "./icons";

export type Stop = Restaurant & { status: StopStatus; imageSrc: string | null };

/**
 * The trail itself. Search is instant and client-side — thirteen kitchens do not
 * need a search service — across name, cuisine, signature dishes and
 * neighborhood. Results keep their corridor grouping so the "path" reads as a
 * path even when filtered; an "open now" toggle answers the question a tourist
 * standing on 79th Street actually has.
 */
export function PathExplorer({ stops }: { stops: Stop[] }) {
  const [q, setQ] = useState("");
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return stops.filter((s) => {
      if (openOnly && !s.status.open) return false;
      if (!t) return true;
      const hay = [s.name, s.tagline, s.neighborhood, ...s.cuisine, ...s.signature].join(" ").toLowerCase();
      return t.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [stops, q, openOnly]);

  const byCorridor = (Object.keys(CORRIDORS) as Restaurant["corridor"][])
    .map((c) => ({ key: c, ...CORRIDORS[c], stops: filtered.filter((s) => s.corridor === c) }))
    .filter((g) => g.stops.length > 0);

  const openCount = stops.filter((s) => s.status.open).length;

  return (
    <section id="path" className="scroll-mt-28 bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-ink">The Culinary Path</p>
            <h2 className="font-display mt-2 text-h1 text-crimson">{stops.length} kitchens. <span className="text-orange">{openCount} open right now.</span></h2>
          </div>
        </div>

        {/* search + open-now */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search the path</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-gray" />
            <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search a dish, a cuisine, a kitchen — jerk, pie, vegan, wings…"
              className="w-full rounded-pill border border-line bg-cream py-3.5 pl-12 pr-4 text-body text-ink placeholder:text-warm-gray focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40" />
          </label>
          <button onClick={() => setOpenOnly((v) => !v)} aria-pressed={openOnly}
            className={`rounded-pill border px-5 py-3.5 text-small font-bold transition-colors ${openOnly ? "border-open bg-open text-paper" : "border-line bg-paper text-ink hover:border-open hover:text-open"}`}>
            <span aria-hidden className={`mr-2 inline-block h-2 w-2 rounded-full ${openOnly ? "bg-paper" : "bg-open"}`} />Open now
          </button>
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 rounded-2xl border border-line bg-cream p-8 text-center text-warm-gray">Nothing on the path matches “{q}”{openOnly ? " that's open right now" : ""}. Try a cuisine — jerk, barbecue, vegan, bakery.</p>
        )}

        <div className="mt-10 space-y-14">
          {byCorridor.map((g) => (
            <div key={g.key}>
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-3 w-3 shrink-0 rounded-full bg-orange ring-4 ring-orange/20" />
                <h3 className="font-head text-h2 text-ink">{g.label}</h3>
              </div>
              <p className="ml-7 mt-1 max-w-2xl text-warm-gray">{g.blurb}</p>
              <div className="ml-[5px] mt-6 border-l-2 border-dashed border-gold/60 pl-8">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {g.stops.map((s) => <StopCard key={s.slug} stop={s} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StopCard({ stop: s }: { stop: Stop }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-soft transition-shadow hover:shadow-card">
      <a href={s.site} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/3] bg-cream">
        {s.imageSrc ? (
          <Image src={s.imageSrc} alt={`${s.name} — ${s.signature[0]}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-gold/30 to-orange/20" />
        )}
        <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold backdrop-blur ${s.status.open ? "bg-open text-paper" : "bg-ink/80 text-paper"}`}>
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${s.status.open ? "bg-paper" : "bg-orange"}`} />
          {s.status.open ? `Open · ${s.status.short}` : s.status.short}
        </span>
        {s.since && <span className="absolute right-3 top-3 rounded-pill bg-paper/90 px-2.5 py-1 text-xs font-bold text-gold-ink">Since {s.since}</span>}
      </a>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap gap-1.5">
          {s.cuisine.map((c) => <span key={c} className="rounded-pill bg-cream px-2.5 py-0.5 text-xs font-semibold text-gold-ink">{c}</span>)}
        </div>
        <h4 className="font-head text-h4 leading-tight text-ink">{s.name}</h4>
        <p className="text-small text-warm-gray">{s.tagline}</p>
        <p className="mt-1 flex items-start gap-1.5 text-xs text-warm-gray"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-ink" />{s.address}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <a href={s.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-small font-bold text-crimson transition-colors hover:text-orange-ink">Visit <Arrow className="h-4 w-4" /></a>
          {s.phoneHref && <a href={s.phoneHref} aria-label={`Call ${s.name}`} className="inline-flex items-center gap-1.5 text-small font-semibold text-warm-gray hover:text-ink"><Phone className="h-3.5 w-3.5 text-orange-ink" />{s.phone}</a>}
        </div>
      </div>
    </article>
  );
}
