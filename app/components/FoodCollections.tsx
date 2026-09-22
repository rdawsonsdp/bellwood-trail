"use client";
import Image from "next/image";
import { useRef } from "react";
import type { Stop } from "@/app/lib/live-status";
import { EMPTY_FILTERS, inCategory } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Chevron } from "./icons";

/* `photo` names the stop whose card photo fronts the collection. None of the
 * Bellwood stops have been photographed yet, so every tile falls back to its
 * label on a plain ground until one is; the intended stop is named so the
 * tile picks the photo up the moment it lands in /admin. */
const COLLECTIONS = [
  { key: "southern", label: "Southern & soul", photo: "varis" },
  { key: "caribbean", label: "A taste of the islands", photo: "montego-bay" },
  { key: "italian", label: "Italian & pizza", photo: "gioacchinos" },
  { key: "mexican", label: "Tacos & tortas", photo: "taco-patio" },
  { key: "seafood", label: "Fish & seafood", photo: "sharks" },
  { key: "greek-bbq", label: "Gyros & ribs", photo: "ariston" },
  { key: "sandwiches", label: "Beef & sandwiches", photo: "mickeys" },
  { key: "sweets", label: "Something sweet", photo: "lezza" },
];
export function FoodCollections({ stops }: { stops: Stop[] }) {
  const { updateFilters } = useDiscovery();
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * .75, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return <section className="site-container collections-section" aria-labelledby="collections-heading">
    <div className="section-heading"><div><h2 id="collections-heading">Follow your craving.</h2><p>There’s a whole lot of flavor around the corner.</p></div><div className="rail-controls"><button className="icon-button" aria-label="Previous food collections" onClick={() => move(-1)}><Chevron className="rotate-180" /></button><button className="icon-button" aria-label="Next food collections" onClick={() => move(1)}><Chevron /></button></div></div>
    <div className="collection-rail" ref={rail}>
      {COLLECTIONS.map(c => {
        const members = stops.filter(s => inCategory(s, c.key));
        const photo = members.find(s => s.slug === c.photo && s.imageSrc) ?? members.find(s => s.imageSrc);
        if (!members.length) return null;
        return <button className="collection-card" key={c.key} onClick={() => updateFilters({ ...EMPTY_FILTERS, foods: [c.key] }, true)}>
          <span className="collection-photo">{photo?.imageSrc && <Image src={photo.imageSrc} alt={photo.imageAlt ?? `${photo.name}, on the Culinary Path`} fill sizes="(min-width: 1024px) 200px, 180px" />}</span>
          <strong>{c.label}</strong><span>{members.length} {members.length === 1 ? "kitchen" : "kitchens"}</span>
        </button>;
      })}
    </div>
  </section>;
}
