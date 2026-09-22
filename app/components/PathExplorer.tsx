"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CORRIDORS, FOOD_CATEGORIES } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { DAY_SHORT, formatRange } from "@/app/lib/hours";
import { EMPTY_FILTERS, filterStops, inCategory, type DiscoveryFilters } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { DiscoveryDialog } from "./DiscoveryDialog";
import { StopCard } from "./StopCard";
import { RestaurantReviews } from "./RestaurantReviews";
import { Close, Heart, MapPin, Phone, Search, Sliders } from "./icons";

export function PathExplorer({ stops }: { stops: Stop[] }) {
  const { filters, updateFilters, resetFilters, saved, toggleSaved, message } = useDiscovery();
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<DiscoveryFilters>(filters);
  const [selected, setSelected] = useState<Stop | null>(null);
  const filtered = useMemo(() => filterStops(stops, filters, saved), [stops, filters, saved]);
  const categories = FOOD_CATEGORIES.filter(c => stops.some(s => inCategory(s, c.key)));
  const extraCount = filters.foods.length + Number(!!filters.area) + Number(!!filters.meal);
  const active: { label: string; patch: Partial<DiscoveryFilters> }[] = [
    ...(filters.q ? [{ label: `“${filters.q}”`, patch: { q: "" } }] : []),
    ...(filters.area ? [{ label: CORRIDORS[filters.area].label, patch: { area: "" as const } }] : []),
    ...filters.foods.map(food => ({ label: FOOD_CATEGORIES.find(c => c.key === food)?.label ?? food, patch: { foods: filters.foods.filter(c => c !== food) } })),
    ...(filters.meal ? [{ label: filters.meal, patch: { meal: "" as const } }] : []),
    ...(filters.dining ? [{ label: filters.dining === "dine-in" ? "Dine in" : "Carryout only", patch: { dining: "" as const } }] : []),
    ...(filters.open ? [{ label: "Open now", patch: { open: false } }] : []),
    ...(filters.saved ? [{ label: "Saved kitchens", patch: { saved: false } }] : []),
  ];
  return <section id="path" className="explorer-section" aria-labelledby="path-heading">
    <div className="site-container">
      <div className={`section-heading explorer-heading ${filters.saved ? "" : "mobile-hide-heading"}`}><div><h2 id="path-heading" tabIndex={-1}>{filters.saved ? "Your favorites." : "Find your next favorite."}</h2><p>{filters.saved ? "Your favorite places, together in one list." : "Explore the kitchens that make Bellwood taste like home."}</p></div><span className="path-count">{stops.length} local kitchens</span></div>
      <div className="explorer-toolbar">
        <label className="directory-search"><Search /><input type="search" value={filters.q} onChange={e => updateFilters({ q: e.target.value }, false, true)} maxLength={200} aria-label="Search kitchens" placeholder="Search kitchens or dishes" /></label>
        <div className="quick-filters">
          <button type="button" className={`filter-button ${filters.open ? "selected" : ""}`} aria-pressed={filters.open} onClick={() => updateFilters({ open: !filters.open })}><span className="open-dot" />Open now</button>
          <label className="dining-filter"><span className="sr-only">Dining preference</span><select aria-label="Dining preference" value={filters.dining} onChange={e => updateFilters({ dining: e.target.value as DiscoveryFilters["dining"] })}><option value="">Dining options</option><option value="dine-in">Dine in</option><option value="carryout">Carryout only</option></select></label>
          <button type="button" className={`filter-button ${extraCount ? "selected" : ""}`} onClick={() => { setDraft({ ...filters, foods: [...filters.foods] }); setFilterOpen(true); }}><Sliders />Filters{extraCount > 0 && <span className="filter-count">{extraCount}</span>}</button>
          <button type="button" className={`filter-button saved-filter ${filters.saved ? "selected" : ""}`} aria-pressed={filters.saved} onClick={() => updateFilters({ saved: !filters.saved })}><Heart filled={filters.saved} />Saved{saved.length > 0 && <span>{saved.length}</span>}</button>
        </div>
      </div>
      <div className="mobile-discovery-pills" role="group" aria-label="Quick restaurant choices">
        <button type="button" aria-pressed={!active.length} onClick={resetFilters}>All</button>
        <button type="button" aria-pressed={filters.open} onClick={() => updateFilters({ open: !filters.open })}><span className="open-dot" />Open now</button>
        <button type="button" aria-pressed={filters.dining === "dine-in"} onClick={() => updateFilters({ dining: filters.dining === "dine-in" ? "" : "dine-in" })}>Dine in</button>
        <button type="button" aria-pressed={filters.dining === "carryout"} onClick={() => updateFilters({ dining: filters.dining === "carryout" ? "" : "carryout" })}>Carryout only</button>
      </div>
      {active.length > 0 && <div className={`active-filters ${active.every(item => "open" in item.patch || "dining" in item.patch || "saved" in item.patch) ? "mobile-hide-active" : ""}`} aria-label="Active filters">{active.map(item => <button key={item.label} onClick={() => updateFilters(item.patch)} aria-label={`Remove ${item.label} filter`}>{item.label}<Close /></button>)}<button className="clear-filters" onClick={resetFilters}>Clear all</button></div>}
      <div className="results-summary"><p role="status" aria-live="polite">{filtered.length === stops.length ? `All ${stops.length} kitchens` : `${filtered.length} of ${stops.length} kitchens`}{!active.length && <span> · Explore at your own pace</span>}</p><label>Sort by<select aria-label="Sort kitchens" value={filters.sort} onChange={e => updateFilters({ sort: e.target.value as DiscoveryFilters["sort"] })}><option value="path">On the path</option><option value="name">Name: A–Z</option><option value="open">Open first</option></select></label></div>
      {filtered.length ? <div className="kitchen-grid">{filtered.map(stop => <StopCard key={stop.slug} stop={stop} onDetails={() => setSelected(stop)} />)}</div> : <div className="discovery-empty">{filters.saved && !saved.length ? <><Heart /><h3>Your next food trail starts here.</h3><p>Tap the heart on any kitchen to keep it in your list.</p></> : <><Search /><h3>No kitchens match just yet.</h3><p>Try another dish or remove a filter to see more of the path.</p></>}<button className="primary-button" onClick={resetFilters}>Explore all kitchens</button></div>}
      <p className="hours-note">Hours shown in Chicago time. Updated from restaurant websites where available; otherwise, the kitchen’s listed hours are shown.</p>
    </div>
    <div className={`save-notice ${message ? "visible" : ""}`} role="status" aria-live="polite">{message && <><Heart filled />{message}</>}</div>
    <DiscoveryDialog title="Find your kind of kitchen" open={filterOpen} onClose={() => setFilterOpen(false)}>
      <div className="filter-dialog-fields">
        <fieldset><legend>What are you craving?</legend><div className="food-filter-options">{categories.map(c => <label key={c.key}><input type="checkbox" checked={draft.foods.includes(c.key)} onChange={() => setDraft(d => ({ ...d, foods: d.foods.includes(c.key) ? d.foods.filter(k => k !== c.key) : [...d.foods, c.key] }))} /><span>{c.label}</span></label>)}</div></fieldset>
        <label className="dialog-field">Neighborhood or street<select aria-label="Neighborhood or street" value={draft.area} onChange={e => setDraft(d => ({ ...d, area: e.target.value as DiscoveryFilters["area"] }))}><option value="">All areas</option>{Object.entries(CORRIDORS).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}</select></label>
        <div className="dialog-field-pair"><label className="dialog-field">Meal<select aria-label="Meal" value={draft.meal} onChange={e => setDraft(d => ({ ...d, meal: e.target.value as DiscoveryFilters["meal"] }))}><option value="">Any time</option><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option></select></label><label className="dialog-field">Dining<select aria-label="Filter dining preference" value={draft.dining} onChange={e => setDraft(d => ({ ...d, dining: e.target.value as DiscoveryFilters["dining"] }))}><option value="">Any option</option><option value="dine-in">Dine in</option><option value="carryout">Carryout only</option></select></label></div>
        <label className="checkbox-field"><input type="checkbox" checked={draft.open} onChange={e => setDraft(d => ({ ...d, open: e.target.checked }))} />Only kitchens open now</label>
      </div>
      <div className="dialog-actions"><button className="text-button" onClick={() => setDraft({ ...EMPTY_FILTERS, q: filters.q, saved: filters.saved, sort: filters.sort })}>Reset filters</button><button className="primary-button" onClick={() => { updateFilters(draft); setFilterOpen(false); }}>Show {filterStops(stops, draft, saved).length} kitchens</button></div>
    </DiscoveryDialog>
    <DiscoveryDialog title={selected?.name ?? "Kitchen details"} open={!!selected} onClose={() => setSelected(null)}>
      {selected && <div className="kitchen-detail">
        {selected.imageSrc && <div className="detail-photo"><Image src={selected.imageSrc} alt={selected.imageAlt || `${selected.name}: ${selected.signature[0] ?? "on the Culinary Path"}`} fill sizes="600px" /></div>}
        <div className="detail-body"><div className="detail-status"><p className={`kitchen-status ${selected.status.open ? "is-open" : ""}`}><span aria-hidden />{selected.status.headline.replace("Now open till", "Open until")}</p><button className="filter-button" aria-pressed={saved.includes(selected.slug)} onClick={() => toggleSaved(selected.slug, selected.name)}><Heart filled={saved.includes(selected.slug)} />{saved.includes(selected.slug) ? "Saved" : "Save"}</button></div>
          <p>{selected.tagline}</p><div className="detail-facts">{selected.cuisine.map(c => <span key={c}>{c}</span>)}{selected.since && <span>Since {selected.since}</span>}{selected.dineIn !== undefined && <span>{selected.dineIn ? "Dine in" : "Carryout only"}</span>}</div>
          <h3>Come hungry for</h3><p>{selected.signature.join(", ")}</p>
          <a className="detail-address" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.address)}`} target="_blank" rel="noopener noreferrer"><MapPin />{selected.address}<span className="sr-only"> — open map in a new tab</span></a>
          <details className="detail-hours"><summary>Opening hours <span>{selected.status.today}</span></summary><dl>{selected.schedule.map((hours, day) => <div key={day}><dt>{DAY_SHORT[day]}</dt><dd>{formatRange(hours)}</dd></div>)}</dl><p>{selected.status.source === "live" ? "Hours from the restaurant’s website." : "Listed opening hours."} All times are in Chicago.</p></details>
          <div className="detail-actions">{selected.site && <a className="primary-button" href={selected.site} target="_blank" rel="noopener noreferrer">Visit restaurant website<span className="sr-only"> — opens in a new tab</span></a>}{selected.phoneHref && <a className="secondary-button" href={selected.phoneHref}><Phone />{selected.phone}</a>}</div>
          <RestaurantReviews key={selected.slug} slug={selected.slug} name={selected.name} address={selected.address} />
        </div>
      </div>}
    </DiscoveryDialog>
  </section>;
}
