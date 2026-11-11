"use client";
import { DEFAULT_HERO, type HeroContent } from "@/content/hero";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Stop } from "@/app/lib/live-status";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { dishCount, searchDishes, searchWords } from "@/app/lib/menu";
import { useDiscovery } from "./DiscoveryContext";
import { useKitchenSheet } from "./KitchenSheet";
import { DishName } from "./MenuRows";
import { Search } from "./icons";

// Offered as starting points; only the ones a Bellwood menu actually lists are shown.
const IDEAS = ["Italian beef", "Gyros", "Catfish", "Tacos", "Pizza", "Egg rolls", "Rib tips", "Wings", "Spumoni", "Burritos"];

/** The top of the site: Bellwood on one side, and a search across every menu
 *  in the village on the other. */
export function Board({ stops, hero = DEFAULT_HERO }: { stops: Stop[]; hero?: HeroContent }) {
  const { updateFilters, moment } = useDiscovery();
  const openSheet = useKitchenSheet();
  const [query, setQuery] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const video = useRef<HTMLVideoElement>(null);
  const [desktopMotion, setDesktopMotion] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1001px) and (prefers-reduced-motion: no-preference)");
    const sync = () => { setDesktopMotion(media.matches); setVideoVisible(false); setPaused(false); setEnded(false); };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const toggleVideo = () => {
    const player = video.current;
    if (!player) return;
    if (player.paused) { void player.play().catch(() => setPaused(true)); }
    else player.pause();
  };

  const openCount = stops.filter(s => s.status.open).length;
  const dishes = useMemo(() => stops.reduce((n, s) => n + dishCount(s), 0), [stops]);
  const ideas = useMemo(() => IDEAS.filter(idea => searchDishes(stops, idea).total > 0).slice(0, 6), [stops]);
  const words = searchWords(query);
  const found = useMemo(() => searchDishes(stops, query, 7), [stops, query]);
  const searching = query.trim().length >= 2;
  const showAll = () => { setListOpen(false); updateFilters({ ...EMPTY_FILTERS, q: query.trim() }, true); };

  return <section className="board" aria-labelledby="hero-heading">
    <div className="board-panel">
      <p className="board-greeting">{moment?.greeting ?? "Welcome to Bellwood."}</p>
      <h1 id="hero-heading" tabIndex={-1}>Discover great places to eat in Bellwood.</h1>
      <div className="board-search" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setListOpen(false); }} onKeyDown={e => { if (e.key === "Escape") { setListOpen(false); input.current?.focus(); } }}>
        <form role="search" onSubmit={e => { e.preventDefault(); showAll(); }}>
          <label htmlFor="board-query" className="sr-only">Search Bellwood restaurants for a dish</label>
          <Search />
          <input ref={input} id="board-query" type="search" value={query} maxLength={200} autoComplete="off" enterKeyHint="search" placeholder="What are you hungry for?" aria-controls="board-results"
            onChange={e => { setQuery(e.target.value); setListOpen(true); }} onFocus={() => setListOpen(true)} />
          <button type="submit">Search</button>
        </form>
        <div id="board-results" className="board-results" hidden={!(listOpen && searching)} onMouseDown={e => e.preventDefault()}>
          <p className="board-results-count" role="status">{!searching ? "" : found.total ? `${found.total} ${found.total === 1 ? "dish" : "dishes"} at ${found.kitchens} ${found.kitchens === 1 ? "kitchen" : "kitchens"}` : `No Bellwood menu lists “${query.trim()}” yet. Try another dish.`}</p>
          {found.hits.length > 0 && <ul>{found.hits.map((hit, i) => <li key={`${hit.slug}-${hit.item.name}-${i}`}>
            <button type="button" onClick={() => { setListOpen(false); openSheet?.(hit.slug, hit.item.name); }}>
              <span className="board-hit-line"><span className="menu-dish"><DishName name={hit.item.name} words={words} /></span><span className="menu-leader" aria-hidden="true" />{hit.item.price && <span className="menu-price">{hit.item.price}</span>}</span>
              <span className="board-hit-where"><span className={`status-dot ${hit.open ? "is-open" : ""}`} aria-hidden="true" />{hit.kitchen}<span className="board-hit-section">{hit.section}</span><span className="sr-only">{hit.open ? ", open now" : ", closed now"}</span></span>
            </button>
          </li>)}</ul>}
          {found.total > found.hits.length && <button type="button" className="board-results-all" onClick={showAll}>Show all {found.kitchens} kitchens that serve it</button>}
        </div>
      </div>
      {ideas.length > 0 && <div className="board-ideas" role="group" aria-label="Popular searches">
        {ideas.map(idea => <button key={idea} type="button" onClick={() => { setQuery(idea); setListOpen(true); input.current?.focus(); }}>{idea}</button>)}
      </div>}
      <p className="board-count"><span className={`status-dot ${openCount ? "is-open" : ""}`} aria-hidden="true" />{stops.length} local restaurants and {dishes} dishes to explore. {openCount === 0 ? "None are open right now." : `${openCount} ${openCount === 1 ? "is" : "are"} open right now.`}</p>
    </div>
    <div className={`board-scene${videoVisible ? " has-video" : ""}`}>
      <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="(max-width: 1000px) 100vw, 58vw" className="board-photo" />
      {desktopMotion && <video ref={video} className="board-video" src="/videos/dine-bellwood-hero.mp4" autoPlay muted playsInline preload="auto" aria-hidden="true" onPlaying={() => { setVideoVisible(true); setPaused(false); setEnded(false); }} onPause={() => setPaused(true)} onEnded={() => { setEnded(true); setPaused(true); }} onError={() => { setVideoVisible(false); setDesktopMotion(false); }} />}
      {videoVisible && !ended && <button type="button" className="board-video-toggle" onClick={toggleVideo}>{paused ? "Resume video" : "Pause video"}</button>}
      {!videoVisible && hero.image === DEFAULT_HERO.image && <a className="board-credit" href="https://www.designbridgeltd.com/projects/bellwood-gateway" target="_blank" rel="noopener noreferrer">Bellwood Gateway by DESIGNBRIDGE. Photo: Angie McMonigal</a>}
    </div>
  </section>;
}
