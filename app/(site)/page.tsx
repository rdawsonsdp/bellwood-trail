import { DineVipProvider, BellwoodPromotion } from "@/app/components/DineVip";
import { SITE } from "@/content/restaurants";
import { getContent } from "@/app/lib/content-store";
import { resolveStops } from "@/app/lib/live-status";
import { Board } from "@/app/components/Board";
import { KitchenSheetProvider } from "@/app/components/KitchenSheet";
import { MayorWelcome } from "@/app/components/MayorWelcome";
import { PathExplorer } from "@/app/components/PathExplorer";
import { RestaurantMap } from "@/app/components/RestaurantMap";
import { Since } from "@/app/components/Since";

// Content comes from the store (cached until an admin saves) and each card's
// hours, phone and address from the kitchen's own site (cached ten minutes in
// site-data.ts), so the page itself is rendered per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { restaurants, hero } = await getContent();
  const stops = await resolveStops(restaurants);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SITE.name,
    description: SITE.description,
    itemListElement: stops.map((r, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Restaurant", name: r.name, url: r.site || undefined, servesCuisine: r.cuisine, telephone: r.phone || undefined, hasMenu: r.menu?.source.url,
        address: { "@type": "PostalAddress", streetAddress: r.address.split(",")[0], addressLocality: "Bellwood", addressRegion: "IL", addressCountry: "US" } },
    })),
  };
  return (
    <DineVipProvider>
      <KitchenSheetProvider stops={stops}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Board stops={stops} hero={hero} />
        <BellwoodPromotion />
        <PathExplorer stops={stops} />
        <RestaurantMap stops={stops} />
        <Since stops={stops} />
        <MayorWelcome />
      </KitchenSheetProvider>
    </DineVipProvider>
  );
}
