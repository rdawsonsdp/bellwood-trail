"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Stop } from "@/app/lib/live-status";
import { fitMap, hasCoordinates, MAX_ZOOM, MIN_ZOOM, project, zoomAt, type MapView } from "@/app/lib/map";
import { useDiscovery } from "./DiscoveryContext";
import { Close, Heart, MapPin } from "./icons";
import { MobileNavigation } from "./MobileNavigation";

type LocatedStop = Stop & { lat: number; lng: number };
type Size = { width: number; height: number };
const tileTemplate = process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function StreetMap({ stops, active, interactive = false, onSelect }: { stops: LocatedStop[]; active?: string; interactive?: boolean; onSelect?: (stop: LocatedStop) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [view, setView] = useState<MapView>({ ...project(41.75, -87.615), zoom: 13 });
  const viewRef = useRef(view); viewRef.current = view;
  const [failed, setFailed] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const animation = useRef(0);
  useEffect(() => {
    const element = ref.current;
    if (!element || !interactive) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault(); cancelAnimationFrame(animation.current);
      const bounds = element.getBoundingClientRect();
      setView(v => zoomAt(v, v.zoom - Math.max(-1, Math.min(1, event.deltaY / 250)), { x: event.clientX - bounds.left - bounds.width / 2, y: event.clientY - bounds.top - bounds.height / 2 }));
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [interactive]);
  const pointsKey = stops.map(s => `${s.slug}:${s.lat}:${s.lng}`).join("|");
  const stopsRef = useRef(stops); stopsRef.current = stops;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
      setView(fitMap(stopsRef.current.map(s => project(s.lat, s.lng)), width, height));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!size.width) return;
    const chosen = stopsRef.current.find(s => s.slug === active);
    const target = chosen ? { ...project(chosen.lat, chosen.lng), zoom: 17 } : fitMap(stopsRef.current.map(s => project(s.lat, s.lng)), size.width, size.height);
    cancelAnimationFrame(animation.current);
    if (!interactive || matchMedia("(prefers-reduced-motion: reduce)").matches) { setView(target); return; }
    const start = performance.now(), from = viewRef.current;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 420), eased = 1 - (1 - t) ** 3;
      setView({ x: from.x + (target.x - from.x) * eased, y: from.y + (target.y - from.y) * eased, zoom: from.zoom + (target.zoom - from.zoom) * eased });
      if (t < 1) animation.current = requestAnimationFrame(tick);
    };
    animation.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation.current);
  }, [active, pointsKey, size.width, size.height, interactive]);
  const changeZoom = (delta: number) => { cancelAnimationFrame(animation.current); setView(v => zoomAt(v, v.zoom + delta)); };
  const reset = () => { cancelAnimationFrame(animation.current); setView(fitMap(stops.map(s => project(s.lat, s.lng)), size.width, size.height)); };
  const scale = 256 * 2 ** view.zoom;
  const z = Math.floor(view.zoom), tileSize = 256 * 2 ** (view.zoom - z);
  const left = view.x * scale - size.width / 2, top = view.y * scale - size.height / 2;
  const tiles = [];
  for (let x = Math.max(0, Math.floor(left / tileSize)); x <= Math.min(2 ** z - 1, Math.floor((left + size.width) / tileSize)) && size.width; x++) {
    for (let y = Math.max(0, Math.floor(top / tileSize)); y <= Math.min(2 ** z - 1, Math.floor((top + size.height) / tileSize)); y++) {
      tiles.push(<img key={`${z}/${x}/${y}`} src={tileTemplate.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y))} alt="" draggable={false} referrerPolicy="strict-origin-when-cross-origin" onError={() => setFailed(true)} style={{ left: x * tileSize - left, top: y * tileSize - top, width: tileSize + .5, height: tileSize + .5 }} />);
    }
  }
  // Group nearby pins so densely packed kitchens remain individually reachable.
  const groups: { x: number; y: number; stops: LocatedStop[] }[] = [];
  for (const stop of [...stops].sort((a, b) => Number(b.slug === active) - Number(a.slug === active))) {
    const p = project(stop.lat, stop.lng), x = p.x * scale - left, y = p.y * scale - top;
    if (x < -44 || y < -44 || x > size.width + 44 || y > size.height + 44) continue;
    const group = groups.find(g => Math.hypot(g.x - x, g.y - y) < 48);
    if (group) group.stops.push(stop); else groups.push({ x, y, stops: [stop] });
  }
  return <div className={`street-map ${interactive ? "is-interactive" : ""}`} ref={ref}>
    <div className="map-gesture" tabIndex={interactive ? 0 : undefined} role={interactive ? "group" : undefined} aria-label={interactive ? "Restaurant map. Arrow keys pan, plus and minus zoom. Use the restaurant list to choose a kitchen." : undefined}
      onKeyDown={e => {
        if (!interactive) return;
        const pans: Record<string, [number, number]> = { ArrowLeft: [-80, 0], ArrowRight: [80, 0], ArrowUp: [0, -80], ArrowDown: [0, 80] };
        if (pans[e.key]) { e.preventDefault(); cancelAnimationFrame(animation.current); const [dx, dy] = pans[e.key]; setView(v => ({ ...v, x: v.x + dx / scale, y: v.y + dy / scale })); }
        if (["+", "=", "-"].includes(e.key)) { e.preventDefault(); changeZoom(e.key === "-" ? -1 : 1); }
      }}
      onPointerDown={e => { if (!interactive) return; cancelAnimationFrame(animation.current); e.currentTarget.setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); }}
      onPointerMove={e => {
        const previous = pointers.current.get(e.pointerId);
        if (!previous) return;
        const other = [...pointers.current.entries()].find(([id]) => id !== e.pointerId)?.[1];
        const dx = e.clientX - previous.x, dy = e.clientY - previous.y;
        if (other) {
          const before = Math.hypot(previous.x - other.x, previous.y - other.y), after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
          const bounds = ref.current!.getBoundingClientRect();
          if (before > 5 && after > 5) setView(v => {
            const next = zoomAt(v, v.zoom + Math.log2(after / before), { x: (previous.x + other.x) / 2 - bounds.left - size.width / 2, y: (previous.y + other.y) / 2 - bounds.top - size.height / 2 });
            return { ...next, x: next.x - dx / 2 / (256 * 2 ** next.zoom), y: next.y - dy / 2 / (256 * 2 ** next.zoom) };
          });
        } else setView(v => ({ ...v, x: v.x - dx / (256 * 2 ** v.zoom), y: v.y - dy / (256 * 2 ** v.zoom) }));
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }}
      onPointerUp={e => pointers.current.delete(e.pointerId)} onPointerCancel={e => pointers.current.delete(e.pointerId)} onLostPointerCapture={e => pointers.current.delete(e.pointerId)}>
      <div className="map-tiles" aria-hidden="true">{tiles}</div>
    </div>
    {groups.map(group => {
      const selected = group.stops.some(s => s.slug === active), single = group.stops.length === 1;
      const label = single ? group.stops[0].name : `${group.stops.length} kitchens: ${group.stops.map(s => s.name).join(", ")}`;
      return <button key={group.stops.map(s => s.slug).join("-")} type="button" className={`map-pin ${selected ? "is-selected" : ""} ${single ? "" : "is-cluster"}`} style={{ left: group.x, top: group.y }} disabled={!interactive} aria-label={label} aria-pressed={selected} title={label}
        onClick={() => {
          if (single || selected || view.zoom >= 18) onSelect?.(group.stops[(group.stops.findIndex(s => s.slug === active) + 1) % group.stops.length]);
          else { cancelAnimationFrame(animation.current); const p = project(group.stops[0].lat, group.stops[0].lng); setView({ ...p, zoom: Math.min(MAX_ZOOM, view.zoom + 2) }); }
        }}>{single ? <MapPin /> : group.stops.length}<span className="map-pin-label">{selected ? group.stops.find(s => s.slug === active)?.name : single ? group.stops[0].name : `${group.stops.length} kitchens`}</span></button>;
    })}
    {interactive && <div className="map-controls"><button type="button" aria-label="Zoom in" disabled={view.zoom >= MAX_ZOOM} onClick={() => changeZoom(1)}>+</button><button type="button" aria-label="Zoom out" disabled={view.zoom <= MIN_ZOOM} onClick={() => changeZoom(-1)}>−</button><button type="button" className="map-reset" onClick={reset}>Show all</button></div>}
    {failed && <p className="map-error" role="status">Street tiles couldn’t load. You can still choose any kitchen from the list.</p>}
    <a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
  </div>;
}

export function RestaurantMap({ stops }: { stops: Stop[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [selected, setSelected] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const { saved, toggleSaved } = useDiscovery();
  const located = stops.filter(hasCoordinates);
  const matches = stops.filter(s => (!openOnly || s.status.open) && `${s.name} ${s.cuisine.join(" ")} ${s.signature.join(" ")} ${s.address}`.toLowerCase().includes(query.trim().toLowerCase()));
  const mapped = matches.filter(hasCoordinates);
  const active = matches.find(s => s.slug === selected);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const old = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { dialog.current?.close(); document.body.style.overflow = old; previousFocus?.focus({ preventScroll: true }); };
  }, [open]);
  return <>
    <section className="map-intro site-container" aria-labelledby="map-intro-title">
      <div className="map-intro-copy"><p className="map-location"><MapPin />Bellwood, Illinois</p><h2 id="map-intro-title">Find your next great meal.</h2><p>From St. Charles Road to Butterfield. Explore the kitchens, see what’s nearby, and pick your next stop.</p><button ref={opener} className="primary-button" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}><MapPin />Explore the map</button><span>{located.length} kitchens on the map</span></div>
      <div className="map-preview"><StreetMap stops={located} /><button className="map-preview-open" type="button" aria-label="Open interactive restaurant map" aria-haspopup="dialog" onClick={() => setOpen(true)}><span>Tap to explore the neighborhood ↗</span></button></div>
    </section>
    <dialog className="restaurant-map-dialog" ref={dialog} aria-labelledby="map-dialog-title" onCancel={e => { e.preventDefault(); setOpen(false); }} onKeyDown={e => {
      if (e.key !== "Tab") return;
      const items = [...e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex="0"]')].filter(element => element.getClientRects().length > 0);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }}>
      {open && <><header className="map-dialog-header"><div><h2 id="map-dialog-title" className="sr-only">Restaurant map</h2><p>Every stop in the village</p></div><button autoFocus className="icon-button" aria-label="Close map" onClick={() => setOpen(false)}><Close /></button></header>
        <div className="map-filter-bar"><label><span className="sr-only">Search restaurants on the map</span><input type="search" placeholder="Try rib tips, vegan, or a kitchen…" value={query} onChange={e => { setQuery(e.target.value); setSelected(undefined); }} /></label><button className="filter-button" aria-pressed={openOnly} onClick={() => { setOpenOnly(!openOnly); setSelected(undefined); }}>Open now</button></div>
        <div className="map-explorer-body"><div className="map-canvas"><StreetMap stops={mapped} active={active?.slug} interactive onSelect={s => { setSelected(s.slug); dialog.current?.querySelector(".map-kitchens")?.scrollTo({ top: 0, behavior: "instant" }); }} /><p className="map-instructions">Drag to explore. Pinch or use + / − to zoom.</p></div>
          <aside className="map-kitchens" aria-label="Restaurants on the map">
            {active && <article className="map-detail" aria-label={active.name}>
              <div className="map-detail-heading"><p>Selected kitchen</p><button className="icon-button" aria-label="Back to all map results" onClick={() => setSelected(undefined)}><Close /></button></div>
              {active.imageSrc && <div className="map-detail-photo"><Image src={active.imageSrc} alt={active.imageAlt || active.name} fill sizes="(max-width: 700px) 100vw, 350px" /></div>}
              <h3>{active.name}</h3><p>{active.cuisine.join(" · ")}</p><p className="map-hours">{active.status.headline.replace("Now open till", "Open until")} · {active.status.today}</p><p>{active.address}</p><p>{active.tagline}</p>
              {!hasCoordinates(active) && <p>Map location isn’t available yet. Use directions to find this kitchen.</p>}
              <div className="map-detail-actions"><a className="primary-button" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(active.address)}`} target="_blank" rel="noopener noreferrer">Get directions<span className="sr-only"> (opens a new tab)</span></a>{active.site && <a className="filter-button" href={active.site} target="_blank" rel="noopener noreferrer">Visit website<span className="sr-only"> (opens a new tab)</span></a>}{active.phoneHref && <a className="filter-button" href={active.phoneHref}>Call</a>}<button className="filter-button" aria-pressed={saved.includes(active.slug)} onClick={() => toggleSaved(active.slug, active.name)}><Heart filled={saved.includes(active.slug)} />{saved.includes(active.slug) ? "Saved" : "Save kitchen"}</button></div>
            </article>}
            <div className="map-results-heading"><h3>{matches.length} {matches.length === 1 ? "kitchen" : "kitchens"} to explore</h3><p role="status">{active ? `${active.name} selected. Details above.` : "Select a kitchen to take a closer look."}</p></div>
            {!matches.length && <div className="map-empty"><p>No kitchens match that search.</p><button className="filter-button" onClick={() => { setQuery(""); setOpenOnly(false); }}>Clear filters</button></div>}
            <div className="map-results">{matches.map(stop => <button key={stop.slug} type="button" className="map-result" aria-pressed={stop.slug === active?.slug} onClick={() => { setSelected(stop.slug); dialog.current?.querySelector(".map-kitchens")?.scrollTo({ top: 0, behavior: "instant" }); }}>
              {stop.imageSrc ? <Image src={stop.imageSrc} alt="" width={64} height={64} /> : <MapPin />}<span><strong>{stop.name}</strong><span>{stop.address.split(",")[0]}</span><small>{stop.status.headline.replace("Now open till", "Open until")}{!hasCoordinates(stop) ? " · Not mapped yet" : ""}</small></span><MapPin /></button>)}</div>
          </aside>
        </div><MobileNavigation mapActive onMap={() => {}} onNavigate={() => setOpen(false)} /></>}
    </dialog>
    <MobileNavigation onMap={() => setOpen(true)} />
  </>;
}
