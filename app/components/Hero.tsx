"use client";
import Image from "next/image";
import { Italianno, Jost } from "next/font/google";
import { useEffect, useState } from "react";
import { CORRIDORS, type Restaurant } from "@/content/restaurants";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Clock, Heart, MapPin, Search, Store } from "./icons";

// Visual matches for the GCI logo's light geometric capitals and flowing script.
// The supplied raster wordmark does not identify its original typefaces.
const logoSans = Jost({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-logo-sans", display: "swap" });
const logoScript = Italianno({ subsets: ["latin"], weight: "400", variable: "--font-logo-script", display: "swap" });

export function Hero({ count }: { count: number }) {
  const { filters, updateFilters } = useDiscovery();
  const [query, setQuery] = useState(filters.q);
  const [area, setArea] = useState<Restaurant["corridor"] | "">(filters.area);
  useEffect(() => { setQuery(filters.q); setArea(filters.area); }, [filters.q, filters.area]);
  return <>
    <section className="discovery-hero site-container" aria-labelledby="hero-heading">
      <div className="hero-scene">
        <Image src="/images/brand/hero-brown-sugar-storefront.jpg" alt="Brown Sugar Bakery's red and gold awnings on 75th Street in Greater Chatham" fill priority sizes="(min-width: 1328px) 1280px, 100vw" className="hero-photo" />
        <div className="hero-shade" />
        <div className={`hero-copy ${logoSans.variable} ${logoScript.variable}`}><p><MapPin />Chicago’s South Side</p><h1 id="hero-heading"><span className="hero-logo-line">Good food.</span><span className="hero-logo-script">Great neighborhood.</span></h1><span>Find your next favorite among {count} local kitchens.<br className="desktop-break" /> Come for a bite. Stay for the stories.</span></div>
        <span className="hero-photo-credit">On the path: 75th Street</span>
      </div>
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
