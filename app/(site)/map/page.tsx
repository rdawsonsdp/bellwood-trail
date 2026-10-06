import type { Metadata } from "next";
import { getContent } from "@/app/lib/content-store";
import { resolveStops } from "@/app/lib/live-status";
import { RestaurantMap } from "@/app/components/RestaurantMap";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Restaurant map", description: "Explore Bellwood restaurants by street, cuisine and dish. Find a local kitchen and get directions.", alternates: { canonical: "/map" } };
export default async function MapPage() {
  const { restaurants } = await getContent();
  const stops = await resolveStops(restaurants);
  return <div className="map-page"><div className="site-container map-page-title"><a href="/">← Back to the trail</a><h1>A village worth tasting.</h1><p>Pick a kitchen. Find your way. Make it a Bellwood day.</p></div><RestaurantMap stops={stops} embedded /></div>;
}
