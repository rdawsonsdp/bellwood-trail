"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EMPTY_FILTERS, readFilters, writeFilters, type DiscoveryFilters } from "@/app/lib/discovery";

const SAVED_KEY = "chatham-saved-kitchens-v1";
type DiscoveryState = {
  filters: DiscoveryFilters;
  updateFilters: (patch: Partial<DiscoveryFilters>, scroll?: boolean, replace?: boolean) => void;
  resetFilters: () => void;
  saved: string[];
  toggleSaved: (slug: string, name: string) => void;
  message: string;
};
const Context = createContext<DiscoveryState | null>(null);
const parseSaved = (value: string | null): string[] => {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? [...new Set(parsed.filter((item): item is string => typeof item === "string"))].slice(0, 200) : [];
  } catch { return []; }
};

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DiscoveryFilters>(EMPTY_FILTERS);
  const [saved, setSaved] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const restore = () => setFilters(readFilters(new URLSearchParams(window.location.search)));
    restore();
    try { setSaved(parseSaved(localStorage.getItem(SAVED_KEY))); } catch { /* Saving still works for this visit. */ }
    const sync = (event: StorageEvent) => { if (event.key === SAVED_KEY || event.key === null) setSaved(parseSaved(event.newValue)); };
    window.addEventListener("popstate", restore);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("popstate", restore); window.removeEventListener("storage", sync); };
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const updateFilters = (patch: Partial<DiscoveryFilters>, scroll = false, replace = false) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    const params = writeFilters(next, new URLSearchParams(window.location.search));
    const hash = scroll ? "#path" : window.location.hash;
    const url = `${window.location.pathname}${params.size ? `?${params}` : ""}${hash}`;
    if (url !== window.location.pathname + window.location.search + window.location.hash) window.history[replace ? "replaceState" : "pushState"](null, "", url);
    if (scroll) document.getElementById("path")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const toggleSaved = (slug: string, name: string) => {
    const removing = saved.includes(slug);
    const next = removing ? saved.filter(s => s !== slug) : [...saved, slug];
    setSaved(next);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); setMessage(removing ? `${name} removed from saved kitchens.` : `${name} saved on this device.`); }
    catch { setMessage(removing ? `${name} removed.` : `${name} saved for this visit. Browser storage is unavailable.`); }
  };
  return <Context.Provider value={{ filters, updateFilters, resetFilters: () => updateFilters(EMPTY_FILTERS), saved, toggleSaved, message }}>{children}</Context.Provider>;
}

export function useDiscovery() {
  const value = useContext(Context);
  if (!value) throw new Error("DiscoveryProvider is required");
  return value;
}
