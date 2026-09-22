"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { SITE } from "@/content/restaurants";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Close, Heart, Menu } from "./icons";

const NAV = [{ label: "Explore kitchens", href: "#path" }];
export function Header() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const { saved, updateFilters } = useDiscovery();
  const showSaved = () => { setOpen(false); updateFilters({ ...EMPTY_FILTERS, saved: true }, true); };
  return <header className="discovery-header" onKeyDown={e => { if (e.key === "Escape") { setOpen(false); menu.current?.focus(); } }}>
    <div className="site-container header-inner">
      <a href="/" aria-label={`${SITE.name} — home`} className="brand-link">
        <Image src="/images/brand/bellwood-logo.png" alt="" width={400} height={170} priority className="brand-mark" />
        <span className="brand-type"><strong>{SITE.name}</strong><span>Village of Bellwood</span></span>
      </a>
      <nav className="desktop-navigation" aria-label="Main navigation">{NAV.map(n => <a key={n.href} href={n.href} onClick={e => { if (n.href === "#path") { e.preventDefault(); updateFilters(EMPTY_FILTERS, true); } }}>{n.label}</a>)}</nav>
      <div className="header-actions">
        <button className="saved-navigation" onClick={showSaved} aria-label={`Saved kitchens, ${saved.length}`}><Heart /><span>Saved</span>{saved.length > 0 && <span className="saved-count">{saved.length}</span>}</button>
        <button className="icon-button navigation-toggle" ref={menu} onClick={() => setOpen(v => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <Close /> : <Menu />}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">{NAV.map(n => <a key={n.href} href={n.href} onClick={e => { setOpen(false); if (n.href === "#path") { e.preventDefault(); updateFilters(EMPTY_FILTERS, true); } }}>{n.label}</a>)}<a href={SITE.orgUrl} target="_blank" rel="noopener noreferrer">Village of Bellwood website</a></nav>}
  </header>;
}
