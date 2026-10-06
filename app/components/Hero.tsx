"use client";
import { DEFAULT_HERO, type HeroContent } from "@/content/hero";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CORRIDORS, type Restaurant } from "@/content/restaurants";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Clock, Heart, MapPin, Search, Store } from "./icons";
import { BellwoodPromotion } from "./DineVip";

export function Hero({ hero = DEFAULT_HERO }: { hero?: HeroContent }) {
  const { filters, updateFilters } = useDiscovery();
  const video = useRef<HTMLVideoElement>(null);
  const [desktopMotion, setDesktopMotion] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 701px) and (prefers-reduced-motion: no-preference)");
    const sync = () => { setDesktopMotion(media.matches); setVideoVisible(false); setPaused(false); setEnded(false); setVideoFailed(false); };
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
  const [query, setQuery] = useState(filters.q);
  const [area, setArea] = useState<Restaurant["corridor"] | "">(filters.area);
  useEffect(() => { setQuery(filters.q); setArea(filters.area); }, [filters.q, filters.area]);
  return <>
    <section className="discovery-hero trail-hero" aria-labelledby="hero-heading">
      <div className={`trail-hero-scene${videoVisible ? " has-desktop-video" : ""}${videoFailed ? " video-failed" : ""}`}>
        <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="100vw" className="trail-hero-photo" />
        {desktopMotion && <video ref={video} className="trail-hero-video" src="/videos/dine-bellwood-flyin.mp4" autoPlay muted playsInline preload="auto" poster="/images/brand/dine-bellwood-video-poster.jpg" aria-hidden="true" onPlaying={() => { setVideoVisible(true); setPaused(false); setEnded(false); }} onPause={() => setPaused(true)} onEnded={() => { setEnded(true); setPaused(true); }} onError={() => { setVideoVisible(false); setVideoFailed(true); }} />}
        {videoVisible && !ended && <button type="button" className="hero-video-toggle" onClick={toggleVideo} aria-label={paused ? "Resume hero video" : "Pause hero video"}>{paused ? "Resume video" : "Pause video"}</button>}
        <div className="trail-hero-title"><h1 id="hero-heading" tabIndex={-1}>Dine Bellwood</h1></div>
        {hero.image === DEFAULT_HERO.image && <a className="hero-photo-credit" href="https://www.designbridgeltd.com/projects/bellwood-gateway" target="_blank" rel="noopener noreferrer">Bellwood Gateway · DESIGNBRIDGE · Photo: Angie McMonigal</a>}
      </div>
      <BellwoodPromotion />
      <form id="discover-search" className="discovery-search" role="search" onSubmit={e => { e.preventDefault(); updateFilters({ ...EMPTY_FILTERS, q: query, area }, true); }}>
        <label className="search-segment query-segment"><Search /><span><strong>What sounds good?</strong><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="A dish, a cuisine, a kitchen" maxLength={200} aria-label="Search a dish, cuisine, or kitchen" /></span></label>
        <label className="search-segment area-segment"><MapPin /><span><strong>Where on the path?</strong><select value={area} onChange={e => setArea(e.target.value as typeof area)} aria-label="Search area"><option value="">All of Bellwood</option>{Object.entries(CORRIDORS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></span></label>
        <button className="primary-button search-submit" type="submit"><Search />Find a kitchen</button>
      </form>
    </section>
    <div className="site-container discovery-reassurance">
      <div><Store /><p><strong>Local kitchens, one village.</strong><span>Discover the flavors of Bellwood.</span></p></div>
      <div><Clock /><p><strong>Know before you go.</strong><span>Opening hours right on each kitchen.</span></p></div>
      <div><Heart /><p><strong>Make the path your own.</strong><span>Save the spots you want to try.</span></p></div>
    </div>
  </>;
}
