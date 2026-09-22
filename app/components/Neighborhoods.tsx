"use client";
import Image from "next/image";
import { CORRIDORS, type Restaurant } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Arrow } from "./icons";
export function Neighborhoods({ stops }: { stops: Stop[] }) {
  const { updateFilters } = useDiscovery();
  return <section id="neighborhoods" className="site-container neighborhoods-section" aria-labelledby="neighborhoods-heading">
    <div className="neighborhood-story"><Image src="/images/brand/bellwood-trail-hero.jpg" alt="The Bellwood Culinary Path mark — the village’s four restaurant corridors drawn in blue and gold" fill sizes="(min-width: 900px) 480px, 100vw" /><div><p>More than a meal</p><h2 id="neighborhoods-heading">Four streets.<br />Twenty kitchens.</h2><span>Longtime favorites. New neighbors.<br />Pick a corridor and make an afternoon of it.</span></div></div>
    <div className="neighborhood-choices">{Object.entries(CORRIDORS).map(([key, c]) => {
      const count = stops.filter(s => s.corridor === key).length;
      if (!count) return null;
      return <button key={key} onClick={() => updateFilters({ ...EMPTY_FILTERS, area: key as Restaurant["corridor"] }, true)}><div><h3>{c.label}</h3><p>{c.blurb}</p><span>{count} {count === 1 ? "kitchen" : "kitchens"} to discover</span></div><Arrow /></button>;
    })}</div>
  </section>;
}
