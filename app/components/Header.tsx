"use client";
import Image from "next/image";
import { SITE } from "@/content/restaurants";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Heart } from "./icons";

const NAV = [
  { label: "Menus", href: "/#path" },
  { label: "Map", href: "/#restaurant-map" },
  { label: "Since 1905", href: "/#since" },
];

/** On phones the bottom bar carries navigation, so the header is the wordmark alone. */
export function Header() {
  const { saved, updateFilters } = useDiscovery();
  const showSaved = () => { if (window.location.pathname !== "/") { window.location.assign("/?saved=1#path"); return; } updateFilters({ ...EMPTY_FILTERS, saved: true }, true); };
  return <header className="site-header">
    <div className="site-container site-header-inner">
      <a href="/" aria-label={`${SITE.name} home`} className="site-brand">
        <Image src="/images/brand/bellwood-logo.png" alt="" width={400} height={170} priority />
        <span><strong>{SITE.name}</strong><span>Village of Bellwood, Illinois</span></span>
      </a>
      <nav className="site-nav" aria-label="Main navigation">{NAV.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}<a href={SITE.orgUrl} target="_blank" rel="noopener noreferrer">Village website<span className="sr-only"> (opens in a new tab)</span></a></nav>
      <button type="button" className="site-saved" onClick={showSaved} aria-label={`Saved kitchens, ${saved.length}`}><Heart filled={saved.length > 0} /><span>Saved</span>{saved.length > 0 && <span className="rail-count">{saved.length}</span>}</button>
    </div>
  </header>;
}
