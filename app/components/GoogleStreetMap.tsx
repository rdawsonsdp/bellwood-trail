"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Stop } from "@/app/lib/live-status";
import { BELLWOOD_CENTER, mapCuisine, separateMapPins } from "@/app/lib/map";
import { MapPin } from "./icons";

type LocatedStop = Stop & { lat: number; lng: number };
type Pin = { stop: LocatedStop; x: number; y: number; anchorX: number; anchorY: number };
export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function GoogleStreetMap({ stops, active, interactive = false, onSelect }: { stops: LocatedStop[]; active?: string; interactive?: boolean; onSelect?: (stop: LocatedStop) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const overlay = useRef<google.maps.OverlayView | null>(null);
  const stopsRef = useRef(stops); stopsRef.current = stops;
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const pointsKey = stops.map(s => `${s.slug}:${s.lat}:${s.lng}`).join("|");
  const fitAll = () => {
    if (!map.current) return;
    const bounds = new google.maps.LatLngBounds();
    stopsRef.current.forEach(stop => bounds.extend({ lat: stop.lat, lng: stop.lng }));
    if (stopsRef.current.length) map.current.fitBounds(bounds, 65);
    else { map.current.setCenter(BELLWOOD_CENTER); map.current.setZoom(14); }
  };
  useEffect(() => {
    if (!ready || !host.current) return;
    const element = host.current;
    const instance = new google.maps.Map(element, {
      center: BELLWOOD_CENTER, zoom: 14, minZoom: 11, maxZoom: 19,
      mapTypeId: "roadmap", mapTypeControl: false, streetViewControl: false,
      fullscreenControl: interactive, zoomControl: interactive,
      gestureHandling: interactive ? "cooperative" : "none", keyboardShortcuts: interactive,
      clickableIcons: false,
    });
    map.current = instance;
    let frame = 0;
    const layer = new google.maps.OverlayView();
    layer.onAdd = () => {};
    layer.onRemove = () => {};
    layer.draw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const projection = layer.getProjection();
        if (!projection) return;
        const width = element.clientWidth, height = element.clientHeight;
        const visible = stopsRef.current.flatMap(stop => {
          const point = projection.fromLatLngToContainerPixel(new google.maps.LatLng(stop.lat, stop.lng));
          return point && point.x >= 0 && point.y >= 0 && point.x <= width && point.y <= height ? [{ stop, x: point.x, y: point.y }] : [];
        });
        const positions = separateMapPins(visible, width, height);
        setPins(visible.map((pin, i) => ({ stop: pin.stop, anchorX: pin.x, anchorY: pin.y, ...positions[i] })));
      });
    };
    layer.setMap(instance); overlay.current = layer;
    fitAll();
    const resize = new ResizeObserver(() => { fitAll(); layer.draw(); });
    resize.observe(element);
    return () => {
      resize.disconnect(); cancelAnimationFrame(frame); layer.setMap(null);
      google.maps.event.clearInstanceListeners(instance);
      map.current = null; overlay.current = null;
    };
  }, [ready, interactive]);
  useEffect(() => {
    if (!map.current) return;
    const selected = stopsRef.current.find(stop => stop.slug === active);
    if (selected) { map.current.panTo({ lat: selected.lat, lng: selected.lng }); map.current.setZoom(17); }
    else fitAll();
    overlay.current?.draw();
  }, [active, pointsKey, ready]);
  return <div className="street-map google-street-map">
    <Script id="bellwood-google-maps" src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY ?? "")}&v=weekly`} strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setFailed(true)} />
    <div ref={host} className="google-map-background" aria-label="Google map of Bellwood restaurants" />
    <svg className="map-pin-connectors" aria-hidden="true">{pins.map(pin => <g key={pin.stop.slug}><line x1={pin.anchorX} y1={pin.anchorY} x2={pin.x} y2={pin.y} stroke={mapCuisine(pin.stop.cuisine).color} /><circle cx={pin.anchorX} cy={pin.anchorY} r="3" fill={mapCuisine(pin.stop.cuisine).color} /></g>)}</svg>
    {pins.map(pin => { const type = mapCuisine(pin.stop.cuisine), selected = active === pin.stop.slug; return <button key={pin.stop.slug} className={`map-pin ${selected ? "is-selected" : ""}`} type="button" style={{ left: pin.x, top: pin.y, background: type.color, color: "white" }} disabled={!interactive} aria-label={`${pin.stop.name} · ${type.label}`} aria-pressed={selected} onClick={() => onSelect?.(pin.stop)}><MapPin /><span className="map-pin-label">{pin.stop.name}</span></button>; })}
    {interactive && ready && <button className="google-map-reset" type="button" onClick={fitAll}>Show all {stops.length}</button>}
    {failed && <p className="map-error" role="status">Google Maps couldn’t load. Choose a restaurant from the list for directions.</p>}
  </div>;
}
