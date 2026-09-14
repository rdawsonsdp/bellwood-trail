"use client";
import Image from "next/image";
import { CORRIDORS } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { useDiscovery } from "./DiscoveryContext";
import { Heart, MapPin, Phone, Store } from "./icons";
export function StopCard({ stop, onDetails }: { stop: Stop; onDetails: () => void }) {
  const { saved, toggleSaved } = useDiscovery();
  const isSaved = saved.includes(stop.slug);
  const area = stop.corridor === "beyond" ? stop.neighborhood : CORRIDORS[stop.corridor].label;
  return <article className="kitchen-card" data-kitchen={stop.slug}>
    <div className="kitchen-photo">
      <button className="photo-detail-button" onClick={onDetails} aria-label={`View details for ${stop.name}`}>
        {stop.imageSrc ? <Image src={stop.imageSrc} alt={stop.imageAlt || `${stop.name}: ${stop.signature[0] ?? stop.cuisine[0] ?? "kitchen on the path"}`} fill sizes="(min-width: 1200px) 300px, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" /> : <span className="kitchen-photo-fallback"><Store />{stop.name}</span>}
      </button>
      <button type="button" className={`save-kitchen icon-button ${isSaved ? "is-saved" : ""}`} aria-label={`${isSaved ? "Unsave" : "Save"} ${stop.name}`} aria-pressed={isSaved} onClick={() => toggleSaved(stop.slug, stop.name)}><Heart filled={isSaved} /></button>
      <span className="kitchen-area">{area}</span>
    </div>
    <div className="kitchen-body">
      <p className={`kitchen-status ${stop.status.open ? "is-open" : ""}`}><span aria-hidden />{stop.status.headline.replace("Now open till", "Open until")}</p>
      <h3><button onClick={onDetails}>{stop.name}</button></h3>
      <p className="kitchen-cuisine">{stop.cuisine.slice(0, 2).join(" · ")}{stop.dineIn === true ? " · Dine in" : stop.dineIn === false ? " · Carryout" : ""}</p>
      <p className="kitchen-tagline">{stop.tagline}</p>
      <a className="kitchen-address" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`} target="_blank" rel="noopener noreferrer"><MapPin /><span>{stop.address.split(",")[0]}</span><span className="sr-only"> — open map in a new tab</span></a>
      <div className="kitchen-actions"><button className="details-button" onClick={onDetails}>Explore kitchen</button>{stop.phoneHref && <a className="kitchen-call" href={stop.phoneHref} aria-label={`Call ${stop.name}`}><Phone /><span>Call</span></a>}</div>
    </div>
  </article>;
}
