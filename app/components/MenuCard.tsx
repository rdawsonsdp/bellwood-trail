"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CORRIDORS } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { checkedLabel, dishCount, hasPublishedMenu, matchDishes, menuSections, searchWords } from "@/app/lib/menu";
import { CardGoogleReview } from "./CardGoogleReview";
import { useDiscovery } from "./DiscoveryContext";
import { DirectionsLink } from "./DirectionsLink";
import { useKitchenSheet } from "./KitchenSheet";
import { MenuRows } from "./MenuRows";
import { Camera, Heart, MapPin } from "./icons";

const ROWS = 5;

/** One kitchen, shown as its menu: section tabs and priced dishes on the card
 *  itself. While a search is active, the dishes that match come first. */
export function MenuCard({ stop, query }: { stop: Stop; query: string }) {
  const openSheet = useKitchenSheet();
  const { saved, toggleSaved } = useDiscovery();
  const isSaved = saved.includes(stop.slug);
  const words = searchWords(query);
  const matches = useMemo(() => matchDishes(stop, searchWords(query)).map(hit => hit.item), [stop, query]);
  const published = hasPublishedMenu(stop);
  const tabs = useMemo(() => {
    const sections = menuSections(stop).map(s => ({ key: s.name, label: s.name, items: s.items }));
    return matches.length ? [{ key: "\u0000matches", label: `Matching “${query.trim()}”`, items: matches }, ...sections] : sections;
  }, [stop, matches, query]);
  // The chosen tab is remembered per search, so a new search starts on its matches.
  const [choice, setChoice] = useState({ query, key: "" });
  // Open on the first section with enough dishes to read as a menu.
  const current = tabs.find(t => choice.query === query && t.key === choice.key) ?? (matches.length ? tabs[0] : tabs.find(t => t.items.length >= 3) ?? tabs[0]);
  const details = () => openSheet?.(stop.slug);
  const more = current ? current.items.length - ROWS : 0;
  const photos = stop.gallery.length + (stop.imageSrc && !stop.gallery.some(p => p.src === stop.imageSrc) ? 1 : 0);

  return <article className={`menu-card ${stop.featured ? "is-featured" : ""}`} data-kitchen={stop.slug}>
    <div className="menu-card-photo">
      <button type="button" className="menu-card-photo-button" onClick={details} aria-label={`See photos and details for ${stop.name}`}>
        {stop.imageSrc ? <Image src={stop.imageSrc} alt={stop.imageAlt || `${stop.name}: ${stop.signature[0] ?? stop.cuisine[0] ?? "a Bellwood kitchen"}`} fill sizes="(max-width: 760px) 100vw, (max-width: 1150px) 50vw, 420px" /> : <span className="menu-card-nophoto">{stop.name}</span>}
      </button>
      <button type="button" className={`menu-card-save ${isSaved ? "is-saved" : ""}`} aria-label={`${isSaved ? "Remove" : "Save"} ${stop.name}`} aria-pressed={isSaved} onClick={() => toggleSaved(stop.slug, stop.name)}><Heart filled={isSaved} /></button>
      <span className="menu-card-tags">{stop.featured && <span className="is-featured-tag">Featured</span>}<span>{CORRIDORS[stop.corridor].label}</span>{stop.since && <span className="is-since">Since {stop.since}</span>}</span>
      {photos > 1 && <span className="menu-card-photos"><Camera />{photos}<span className="sr-only"> photos</span></span>}
    </div>
    <div className="menu-card-head">
      <h3><button type="button" onClick={details}>{stop.name}</button></h3>
      <p className={`kitchen-open ${stop.status.open ? "is-open" : ""}`}><span className={`status-dot ${stop.status.open ? "is-open" : ""}`} aria-hidden="true" />{stop.status.headline.replace("Now open till", "Open until")}</p>
      <p className="menu-card-kind">{stop.cuisine.slice(0, 2).join(", ")}{stop.dineIn === true ? ", dine in" : stop.dineIn === false ? ", carryout" : ""}</p>
      <CardGoogleReview slug={stop.slug} name={stop.name} address={stop.address} compact />
    </div>
    {current && <div className="menu-card-menu">
      {tabs.length > 1 ? <div className="menu-tabs" role="group" aria-label={`${stop.name} menu sections`}>
        {tabs.map(tab => <button key={tab.key} type="button" aria-pressed={tab === current} onClick={() => setChoice({ query, key: tab.key })}>{tab.label}</button>)}
      </div> : <p className="menu-tabs-single">{current.label}</p>}
      {/* A match found in a description shows that description, so the reason is visible. */}
      <MenuRows items={current.items.slice(0, ROWS)} words={words} descriptions={current.key.startsWith("\u0000")} />
      {more > 0 && <button type="button" className="menu-card-more" onClick={details}>{more} more in {current.key.startsWith("\u0000") ? "the matches" : current.label}</button>}
    </div>}
    <div className="menu-card-foot">
      {published && stop.menu
        ? <p className="menu-card-source">From <a href={stop.menu.source.url} target="_blank" rel="noopener noreferrer">{stop.menu.source.label}<span className="sr-only"> (opens in a new tab)</span></a>, checked {checkedLabel(stop.menu.checked)}. Prices change.</p>
        : stop.featured?.comingSoon ? <p className="menu-card-source">{stop.featured.note ?? "Opening soon."} The menu will be added when it opens.</p>
        : <p className="menu-card-source">This kitchen has not published a menu online.{stop.phone ? <> Call <a href={stop.phoneHref}>{stop.phone}</a> to ask what they’re serving.</> : " Stop in to see what they’re serving."}</p>}
      <div className="menu-card-actions">
        <button type="button" className="primary-button" onClick={details}>{published ? `See all ${dishCount(stop)} dishes` : "See kitchen details"}</button>
        <DirectionsLink className="secondary-button" name={stop.name} address={stop.address}><MapPin />Directions</DirectionsLink>
      </div>
    </div>
  </article>;
}
