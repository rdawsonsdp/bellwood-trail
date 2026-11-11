"use client";
import { useMemo, useState } from "react";
import { CORRIDORS, FOOD_CATEGORIES, type Meal } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { EMPTY_FILTERS, filterStops, inCategory, type DiscoveryFilters } from "@/app/lib/discovery";
import { MEAL_LABELS } from "@/app/lib/meal-time";
import { useDiscovery } from "./DiscoveryContext";
import { DiscoveryDialog } from "./DiscoveryDialog";
import { MenuCard } from "./MenuCard";
import { Close, Heart, Search, Sliders } from "./icons";

const MEALS: Meal[] = ["breakfast", "lunch", "dinner"];

/** Every kitchen as a menu card, under one rail of filters that stays in reach while you scroll. */
export function PathExplorer({ stops }: { stops: Stop[] }) {
  const { filters, updateFilters, resetFilters, saved, message, moment } = useDiscovery();
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<DiscoveryFilters>(filters);
  const filtered = useMemo(() => filterStops(stops, filters, saved), [stops, filters, saved]);
  const categories = FOOD_CATEGORIES.filter(c => stops.some(s => inCategory(s, c.key)));
  const dialogCount = Number(!!filters.area) + Number(!!filters.dining);
  const active: { label: string; patch: Partial<DiscoveryFilters> }[] = [
    ...(filters.q ? [{ label: `“${filters.q}”`, patch: { q: "" } }] : []),
    ...(filters.area ? [{ label: CORRIDORS[filters.area].label, patch: { area: "" as const } }] : []),
    ...filters.foods.map(food => ({ label: FOOD_CATEGORIES.find(c => c.key === food)?.label ?? food, patch: { foods: filters.foods.filter(c => c !== food) } })),
    ...(filters.meal ? [{ label: MEAL_LABELS[filters.meal], patch: { meal: "" as const } }] : []),
    ...(filters.dining ? [{ label: filters.dining === "dine-in" ? "Dine in" : "Carryout only", patch: { dining: "" as const } }] : []),
    ...(filters.open ? [{ label: "Open now", patch: { open: false } }] : []),
    ...(filters.saved ? [{ label: "Saved kitchens", patch: { saved: false } }] : []),
  ];
  const openDialog = () => { setDraft({ ...filters, foods: [...filters.foods] }); setFilterOpen(true); };

  return <section id="path" className="kitchens" aria-labelledby="path-heading">
    <div className="site-container">
      <div className="kitchens-head">
        <h2 id="path-heading" className="sign-heading" tabIndex={-1}>{filters.saved ? "Your saved kitchens" : "Find your next favorite"}</h2>
        <p>{filters.saved ? "The kitchens you saved, with their menus." : `${stops.length} locally owned Bellwood restaurants. See what each one serves, then get directions.`}</p>
      </div>
      <div className="rail">
        <label className="rail-search"><Search /><span className="sr-only">Search dishes or kitchens</span><input id="kitchen-search" type="search" enterKeyHint="search" onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); }} value={filters.q} onChange={e => updateFilters({ q: e.target.value }, false, true)} maxLength={200} placeholder="Search dishes or kitchens" /></label>
        <div className="rail-chips" role="group" aria-label="Filter kitchens">
          <button type="button" aria-pressed={filters.open} onClick={() => updateFilters({ open: !filters.open })}><span className="status-dot is-open" aria-hidden="true" />Open now</button>
          <button type="button" aria-pressed={filters.saved} onClick={() => updateFilters({ saved: !filters.saved })}><Heart filled={filters.saved} />Saved{saved.length > 0 && <span className="rail-count">{saved.length}</span>}</button>
          <span className="rail-gap" aria-hidden="true" />
          {MEALS.map(meal => <button key={meal} type="button" aria-pressed={filters.meal === meal} onClick={() => updateFilters({ meal: filters.meal === meal ? "" : meal })}>{MEAL_LABELS[meal]}{moment?.meal === meal && <span className="rail-now">{moment.lateNight ? "Late" : "Now"}</span>}</button>)}
          <span className="rail-gap" aria-hidden="true" />
          {categories.map(c => <button key={c.key} type="button" aria-pressed={filters.foods.includes(c.key)} onClick={() => updateFilters({ foods: filters.foods.includes(c.key) ? filters.foods.filter(k => k !== c.key) : [...filters.foods, c.key] })}>{c.label}</button>)}
        </div>
        <button type="button" className="rail-more" aria-haspopup="dialog" onClick={openDialog}><Sliders />Street and dining{dialogCount > 0 && <span className="rail-count">{dialogCount}</span>}</button>
      </div>
      <div className="kitchens-summary">
        <p role="status" aria-live="polite">{filtered.length === stops.length ? `All ${stops.length} kitchens` : `${filtered.length} of ${stops.length} kitchens`}</p>
        {active.length > 0 && <div className="kitchens-active" aria-label="Active filters">{active.map(item => <button key={item.label} type="button" onClick={() => updateFilters(item.patch)} aria-label={`Remove ${item.label} filter`}>{item.label}<Close /></button>)}<button type="button" className="kitchens-clear" onClick={resetFilters}>Clear all</button></div>}
        <label className="kitchens-sort">Sort by<select aria-label="Sort kitchens" value={filters.sort} onChange={e => updateFilters({ sort: e.target.value as DiscoveryFilters["sort"] })}><option value="path">Street by street</option><option value="name">Name, A to Z</option><option value="open">Open first</option></select></label>
      </div>
      {filtered.length ? <div className="menu-grid">{filtered.map(stop => <MenuCard key={stop.slug} stop={stop} query={filters.q} />)}</div>
        : <div className="kitchens-empty">{filters.saved && !saved.length ? <><Heart /><h3>No saved kitchens yet</h3><p>Tap the heart on any kitchen to keep its menu here.</p></> : <><Search /><h3>No kitchen matches those filters</h3><p>Try another dish, or remove a filter.</p></>}<button type="button" className="primary-button" onClick={resetFilters}>Show all kitchens</button></div>}
      <p className="kitchens-note">Hours are shown in Chicago time. Menus are a selection read from each kitchen’s own published menu where one exists, with the source and date on every card. Prices change, so confirm with the kitchen before you order.</p>
    </div>
    <div className={`save-notice ${message ? "visible" : ""}`} role="status" aria-live="polite">{message && <><Heart filled />{message}</>}</div>
    <DiscoveryDialog title="Street and dining" open={filterOpen} onClose={() => setFilterOpen(false)}>
      <div className="filter-dialog-fields">
        <label className="dialog-field">Street<select aria-label="Street" value={draft.area} onChange={e => setDraft(d => ({ ...d, area: e.target.value as DiscoveryFilters["area"] }))}><option value="">All of Bellwood</option>{Object.entries(CORRIDORS).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}</select></label>
        <label className="dialog-field">Dining<select aria-label="Dining" value={draft.dining} onChange={e => setDraft(d => ({ ...d, dining: e.target.value as DiscoveryFilters["dining"] }))}><option value="">Dine in or carryout</option><option value="dine-in">Dine in</option><option value="carryout">Carryout only</option></select></label>
      </div>
      <div className="dialog-actions"><button type="button" className="text-button" onClick={() => setDraft(d => ({ ...d, area: "", dining: "" }))}>Reset</button><button type="button" className="primary-button" onClick={() => { updateFilters(draft); setFilterOpen(false); }}>Show {filterStops(stops, draft, saved).length} kitchens</button></div>
    </DiscoveryDialog>
  </section>;
}
