"use client";
import Image from "next/image";
import { CardGoogleReview } from "./CardGoogleReview";
import { CORRIDORS } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { useDiscovery } from "./DiscoveryContext";
import { DirectionsLink } from "./DirectionsLink";
import { Camera, Heart, MapPin, Store } from "./icons";
export function StopCard({ stop, onDetails }: { stop: Stop; onDetails: () => void }) {
  const { saved, toggleSaved } = useDiscovery();
  const isSaved = saved.includes(stop.slug);
  const area = CORRIDORS[stop.corridor].label;
  return <article className="kitchen-card" data-kitchen={stop.slug}>
    <div className="kitchen-photo">
      <button className="photo-detail-button" onClick={onDetails} aria-label={`View details for ${stop.name}`}>
        {stop.imageSrc ? <Image src={stop.imageSrc} alt={stop.imageAlt || `${stop.name}: ${stop.signature[0] ?? stop.cuisine[0] ?? "kitchen on the path"}`} fill sizes="(max-width: 480px) 100vw, (min-width: 1200px) 300px, (min-width: 900px) 33vw, 50vw" /> : <span className="kitchen-photo-fallback"><Store />{stop.name}</span>}
      </button>
      <button type="button" className={`save-kitchen icon-button ${isSaved ? "is-saved" : ""}`} aria-label={`${isSaved ? "Unsave" : "Save"} ${stop.name}`} aria-pressed={isSaved} onClick={() => toggleSaved(stop.slug, stop.name)}><Heart filled={isSaved} /></button>
      <span className="kitchen-area">{area}</span>
      {stop.gallery.length > 0 && <span className="kitchen-photo-count"><Camera />{stop.gallery.length + (stop.imageSrc && !stop.gallery.some(p => p.src === stop.imageSrc) ? 1 : 0)}<span className="sr-only"> photos</span></span>}
    </div>
    <div className="kitchen-body">
      <p className={`kitchen-status ${stop.status.open ? "is-open" : ""}`}><span aria-hidden />{stop.status.headline.replace("Now open till", "Open until")}</p>
      <h3><button onClick={onDetails}>{stop.name}</button></h3>
      <p className="kitchen-cuisine">{stop.cuisine.slice(0, 2).join(" · ")}{stop.dineIn === true ? " · Dine in" : stop.dineIn === false ? " · Carryout" : ""}</p>
      <CardGoogleReview slug={stop.slug} name={stop.name} address={stop.address} />
      <DirectionsLink className="kitchen-address" name={stop.name} address={stop.address} label={`${stop.address.split(",")[0]}: drive there with Google Maps`}><MapPin /><span>{stop.address.split(",")[0]}</span></DirectionsLink>
      <div className="kitchen-actions"><button className="details-button" onClick={onDetails}>Explore kitchen</button><DirectionsLink className="card-directions" name={stop.name} address={stop.address}><MapPin />Directions ↗</DirectionsLink></div>
    </div>
  </article>;
}
