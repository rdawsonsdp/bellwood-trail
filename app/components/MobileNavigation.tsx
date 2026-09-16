"use client";

import { flushSync } from "react-dom";
import { EMPTY_FILTERS } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";
import { Heart, MapPin, Search } from "./icons";

export function MobileNavigation({ onMap, mapActive = false, onNavigate }: {
  onMap: () => void;
  mapActive?: boolean;
  onNavigate?: () => void;
}) {
  const { filters, saved, updateFilters } = useDiscovery();
  const destination = mapActive ? "map" : filters.saved ? "favorites" : "search";
  const navigate = (favorites: boolean) => {
    // Close the native map dialog before moving focus back to the directory.
    flushSync(() => {
      onNavigate?.();
      updateFilters(favorites ? { ...EMPTY_FILTERS, saved: true } : { saved: false }, true);
    });
    const target = document.querySelector<HTMLElement>(favorites ? "#path-heading" : ".directory-search input");
    target?.focus({ preventScroll: true });
  };
  return <nav className="mobile-bottom-navigation" aria-label="Restaurant navigation">
    <button type="button" aria-current={destination === "map" ? "page" : undefined} aria-haspopup="dialog" onClick={onMap}><span className="mobile-nav-icon"><MapPin /></span><span>Map</span></button>
    <button type="button" aria-current={destination === "search" ? "page" : undefined} onClick={() => navigate(false)}><span className="mobile-nav-icon"><Search /></span><span>Search</span></button>
    <button type="button" aria-current={destination === "favorites" ? "page" : undefined} onClick={() => navigate(true)}><span className="mobile-nav-icon"><Heart filled={destination === "favorites"} />{saved.length > 0 && <span className="mobile-favorites-count">{saved.length}</span>}</span><span>Favorites<span className="sr-only">, {saved.length} saved restaurants</span></span></button>
  </nav>;
}
