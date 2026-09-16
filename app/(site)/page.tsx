import { SITE } from "@/content/restaurants";
import { getContent } from "@/app/lib/content-store";
import { resolveStops } from "@/app/lib/live-status";
import { FoodCollections } from "@/app/components/FoodCollections";
import { Hero } from "@/app/components/Hero";
import { RestaurantMap } from "@/app/components/RestaurantMap";
import { PathExplorer } from "@/app/components/PathExplorer";

// Content comes from the store (cached until an admin saves) and each card's
// hours, phone and address from the kitchen's own site (cached ten minutes in
// site-data.ts), so the page itself is rendered per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { restaurants } = await getContent();
  const stops = await resolveStops(restaurants);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SITE.name,
    description: SITE.description,
    itemListElement: stops.map((r, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Restaurant", name: r.name, url: r.site, servesCuisine: r.cuisine, telephone: r.phone || undefined,
        address: { "@type": "PostalAddress", streetAddress: r.address.split(",")[0], addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" } },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero count={stops.length} />
      <RestaurantMap stops={stops} />
      <FoodCollections stops={stops} />
      <PathExplorer stops={stops} />
    </>
  );
}
