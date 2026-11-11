"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/galleries";
import { Chevron } from "./icons";

type Filter = "all" | GalleryPhoto["kind"];
const LABELS: Record<Filter, string> = { all: "All", food: "Food", atmosphere: "Atmosphere" };

/** Swipeable food and dining-room photos for one restaurant. Falls back to the
 *  card photo alone when the stop has no gallery yet. */
export function PhotoGallery({ name, photos, cover, coverAlt }: { name: string; photos: GalleryPhoto[]; cover: string | null; coverAlt: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const all: GalleryPhoto[] = cover && !photos.some(p => p.src === cover) ? [{ src: cover, alt: coverAlt, kind: "food" }, ...photos] : photos;
  if (!all.length) return null;
  const shown = filter === "all" ? all : all.filter(p => p.kind === filter);
  const filters = (["all", "food", "atmosphere"] as Filter[]).filter(f => f === "all" || all.some(p => p.kind === f));

  const go = (to: number) => {
    const el = track.current; if (!el) return;
    const next = Math.max(0, Math.min(shown.length - 1, to));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };
  const choose = (f: Filter) => { setFilter(f); setIndex(0); track.current?.scrollTo({ left: 0 }); };

  return <div className="photo-gallery" aria-roledescription="carousel" aria-label={`Photos of ${name}`}>
    <div className="photo-gallery-track" ref={track} tabIndex={0} onScroll={e => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
      onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); } }}>
      {shown.map((p, i) => <figure key={p.src} className="photo-gallery-slide" aria-roledescription="slide" aria-label={`${i + 1} of ${shown.length}`}>
        <Image src={p.src} alt={p.alt} fill sizes="(max-width: 700px) 100vw, 600px" priority={i === 0} />
        {p.credit && <figcaption>Photo: {p.credit.split(/[;(]/)[0].trim()}</figcaption>}
      </figure>)}
    </div>
    {shown.length > 1 && <>
      <button type="button" className="photo-gallery-nav prev" aria-label="Previous photo" disabled={index === 0} onClick={() => go(index - 1)}><Chevron /></button>
      <button type="button" className="photo-gallery-nav next" aria-label="Next photo" disabled={index >= shown.length - 1} onClick={() => go(index + 1)}><Chevron /></button>
      <span className="photo-gallery-count" aria-live="polite">{index + 1} / {shown.length}</span>
    </>}
    {filters.length > 2 && <div className="photo-gallery-filters" role="group" aria-label="Show photos of">
      {filters.map(f => <button key={f} type="button" aria-pressed={filter === f} onClick={() => choose(f)}>{LABELS[f]}</button>)}
    </div>}
  </div>;
}
