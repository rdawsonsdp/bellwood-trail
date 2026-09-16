"use client";
import { DEFAULT_HERO, type HeroContent } from "@/content/hero";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CORRIDORS, SITE, type Restaurant } from "@/content/restaurants";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Clock, Heart, MapPin, Search, Store } from "./icons";

export function Hero({ hero = DEFAULT_HERO }: { hero?: HeroContent }) {
  const { filters, updateFilters } = useDiscovery();
  const [query, setQuery] = useState(filters.q);
  const [area, setArea] = useState<Restaurant["corridor"] | "">(filters.area);
  useEffect(() => { setQuery(filters.q); setArea(filters.area); }, [filters.q, filters.area]);
  return <>
    <section className="discovery-hero trail-hero" aria-labelledby="hero-heading">
      <div className="trail-hero-scene">
        <Image src={hero.image} alt="" fill sizes="100vw" className="trail-hero-backdrop" aria-hidden="true" />
        <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="100vw" className="trail-hero-photo" />
        <div className="trail-hero-shade" />
        <Image src="/images/brand/gci-logo.png" alt="Greater Chatham Initiative" width={400} height={311} priority className="trail-hero-logo" />
      </div>
      <div className="site-container trail-hero-title"><h1 id="hero-heading" tabIndex={-1}>{SITE.name}</h1></div>
      <form id="discover-search" className="discovery-search" role="search" onSubmit={e => { e.preventDefault(); updateFilters({ ...EMPTY_FILTERS, q: query, area }, true); }}>
        <label className="search-segment query-segment"><Search /><span><strong>What sounds good?</strong><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="A dish, a cuisine, a kitchen" maxLength={200} aria-label="Search a dish, cuisine, or kitchen" /></span></label>
        <label className="search-segment area-segment"><MapPin /><span><strong>Where on the path?</strong><select value={area} onChange={e => setArea(e.target.value as typeof area)} aria-label="Search area"><option value="">All of Greater Chatham</option>{Object.entries(CORRIDORS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></span></label>
        <button className="primary-button search-submit" type="submit"><Search />Find a kitchen</button>
      </form>
    </section>
    <div className="site-container discovery-reassurance">
      <div><Store /><p><strong>Local knowledge. Real flavor.</strong><span>Curated by Greater Chatham Initiative.</span></p></div>
      <div><Clock /><p><strong>Know before you go.</strong><span>Opening hours right on each kitchen.</span></p></div>
      <div><Heart /><p><strong>Make the path your own.</strong><span>Save the spots you want to try.</span></p></div>
    </div>
  </>;
}
