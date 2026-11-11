"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Stop } from "@/app/lib/live-status";
import { DAY_SHORT, formatRange } from "@/app/lib/hours";
import { hasPublishedMenu, menuSections, sourceNote } from "@/app/lib/menu";
import { useDiscovery } from "./DiscoveryContext";
import { DiscoveryDialog } from "./DiscoveryDialog";
import { DirectionsLink } from "./DirectionsLink";
import { MenuRows } from "./MenuRows";
import { PhotoGallery } from "./PhotoGallery";
import { RestaurantReviews } from "./RestaurantReviews";
import { Heart, MapPin, Phone } from "./icons";

type OpenSheet = (slug: string, dish?: string) => void;
const SheetContext = createContext<OpenSheet | null>(null);
/** Opens a kitchen's sheet, optionally at one dish. Null outside the provider (the map page). */
export const useKitchenSheet = () => useContext(SheetContext);

const withKitchen = (slug: string | null) => {
  const params = new URLSearchParams(window.location.search);
  if (slug) params.set("kitchen", slug); else params.delete("kitchen");
  return `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
};

/** Holds which kitchen is open and renders its sheet: photos, the whole menu,
 *  hours, directions and reviews. The open kitchen is kept in the address bar
 *  (?kitchen=slug) so a menu can be shared. */
export function KitchenSheetProvider({ stops, children }: { stops: Stop[]; children: ReactNode }) {
  const [target, setTarget] = useState<{ slug: string; dish?: string } | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const { saved, toggleSaved } = useDiscovery();
  const stop = target ? stops.find(s => s.slug === target.slug) ?? null : null;

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("kitchen");
    if (slug) setTarget({ slug });
  }, []);
  const open: OpenSheet = (slug, dish) => { setTarget({ slug, dish }); window.history.replaceState(null, "", withKitchen(slug)); };
  const close = () => { setTarget(null); window.history.replaceState(null, "", withKitchen(null)); };

  // Arriving from a dish search lands on that dish, not the top of the sheet.
  useEffect(() => {
    if (!target?.dish) return;
    const frame = requestAnimationFrame(() => {
      const row = [...body.current?.querySelectorAll<HTMLElement>("[data-dish]") ?? []].find(el => el.dataset.dish === target.dish);
      row?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const sections = stop ? menuSections(stop) : [];
  const published = !!stop && hasPublishedMenu(stop);
  return <SheetContext.Provider value={open}>
    {children}
    <DiscoveryDialog title={stop?.name ?? "Kitchen details"} open={!!stop} onClose={close} className="kitchen-sheet">
      {stop && <div className="kitchen-detail" ref={body}>
        <PhotoGallery name={stop.name} photos={stop.gallery} cover={stop.imageSrc} coverAlt={stop.imageAlt || `${stop.name}: ${stop.signature[0] ?? "in Bellwood"}`} />
        <div className="detail-body">
          <div className="detail-status">
            <p className={`kitchen-open ${stop.status.open ? "is-open" : ""}`}><span className={`status-dot ${stop.status.open ? "is-open" : ""}`} aria-hidden="true" />{stop.status.headline.replace("Now open till", "Open until")}</p>
            <button type="button" className="filter-button" aria-pressed={saved.includes(stop.slug)} onClick={() => toggleSaved(stop.slug, stop.name)}><Heart filled={saved.includes(stop.slug)} />{saved.includes(stop.slug) ? "Saved" : "Save"}</button>
          </div>
          <p>{stop.tagline}</p>
          <div className="detail-facts">{stop.cuisine.map(c => <span key={c}>{c}</span>)}{stop.since && <span>Since {stop.since}</span>}{stop.dineIn !== undefined && <span>{stop.dineIn ? "Dine in" : "Carryout only"}</span>}</div>

          <section className="sheet-menu" aria-labelledby="sheet-menu-title">
            <h3 id="sheet-menu-title">{published ? "Menu" : "Known for"}</h3>
            {sections.length > 2 && <div className="sheet-menu-jump" role="group" aria-label="Jump to a menu section">
              {sections.map((s, i) => <button key={s.name} type="button" onClick={() => body.current?.querySelector(`[data-section="${i}"]`)?.scrollIntoView({ block: "start" })}>{s.name}</button>)}
            </div>}
            {sections.map((s, i) => <div key={s.name} className="sheet-menu-section" data-section={i}>
              {published && <h4>{s.name}</h4>}
              <MenuRows items={s.items} descriptions focus={target?.dish} />
            </div>)}
            {published && stop.menu
              ? <p className="sheet-menu-source">{sourceNote(stop.menu)} This is a selection, and prices change, so confirm with the kitchen before you order. <a href={stop.menu.source.url} target="_blank" rel="noopener noreferrer">See the full menu<span className="sr-only"> at {stop.menu.source.label} (opens in a new tab)</span></a></p>
              : stop.featured?.comingSoon ? <p className="sheet-menu-source">{stop.featured.note ?? "Opening soon."} The menu and prices will be added when it opens.</p>
              : <p className="sheet-menu-source">This kitchen has not published a menu online, so no prices are shown.{stop.phone && " Call to ask what they’re serving today."}</p>}
          </section>

          {stop.profile?.about && <><h3>About</h3><p>{stop.profile.about}</p></>}
          <DirectionsLink className="detail-address" name={stop.name} address={stop.address} label={`${stop.address}: drive there with Google Maps`}><MapPin />{stop.address}</DirectionsLink>
          {!stop.featured?.comingSoon && <details className="detail-hours"><summary>Opening hours <span>{stop.status.today}</span></summary><dl>{stop.schedule.map((hours, day) => <div key={day}><dt>{DAY_SHORT[day]}</dt><dd>{formatRange(hours)}</dd></div>)}</dl><p>{stop.status.source === "live" ? "Hours from the restaurant’s website." : "Listed opening hours."} All times are in Chicago.</p></details>}
          <div className="detail-actions">
            <DirectionsLink className="primary-button detail-directions" name={stop.name} address={stop.address}><MapPin />Directions</DirectionsLink>
            {stop.phoneHref && <a className="secondary-button" href={stop.phoneHref}><Phone /><span className="detail-action-label">{stop.phone}</span><span className="detail-action-short" aria-hidden="true">Call</span></a>}
            {stop.site && <a className="secondary-button" href={stop.site} target="_blank" rel="noopener noreferrer"><span className="detail-action-label">Visit restaurant website</span><span className="detail-action-short" aria-hidden="true">Website</span><span className="sr-only"> (opens in a new tab)</span></a>}
          </div>
          {!!stop.profile?.links.length && <div className="detail-links">{stop.profile.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}<span className="sr-only"> (opens in a new tab)</span></a>)}</div>}
          <RestaurantReviews key={stop.slug} slug={stop.slug} name={stop.name} address={stop.address} />
        </div>
      </div>}
    </DiscoveryDialog>
  </SheetContext.Provider>;
}
