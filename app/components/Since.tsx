"use client";
import { CORRIDORS } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { useKitchenSheet } from "./KitchenSheet";

/** The kitchens that publish a founding year, oldest first. A timeline because
 *  it is one: the years come straight from each stop's `since`. */
export function Since({ stops }: { stops: Stop[] }) {
  const openSheet = useKitchenSheet();
  const dated = stops.filter(s => /^\d{4}$/.test(s.since ?? "")).sort((a, b) => Number(a.since) - Number(b.since));
  if (dated.length < 3) return null;
  return <section id="since" className="since" aria-labelledby="since-heading">
    <div className="site-container">
      <h2 id="since-heading" className="sign-heading">Bellwood has been cooking since {dated[0].since}</h2>
      <p className="since-lede">These {dated.length} kitchens have fed the neighborhood for decades. Pick a year to read the menu.</p>
      <ol className="since-line">{dated.map(stop => <li key={stop.slug}>
        <button type="button" onClick={() => openSheet?.(stop.slug)}>
          <span className="since-year">{stop.since}</span>
          <span className="since-name">{stop.name}</span>
          <span className="since-road">{CORRIDORS[stop.corridor].label}</span>
        </button>
      </li>)}</ol>
    </div>
  </section>;
}
