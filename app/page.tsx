import fs from "node:fs";
import path from "node:path";
import { RESTAURANTS, SITE } from "@/content/restaurants";
import { allStatuses } from "./lib/live-status";
import { Hero } from "./components/Hero";
import { PathExplorer, type Stop } from "./components/PathExplorer";
import { Updates } from "./components/Updates";

// Live open/closed is read from each kitchen's own site at request time
// (ISR-cached ten minutes in live-status.ts), so the page is dynamic.
export const dynamic = "force-dynamic";
export const revalidate = 600;

// A stop's photo may be .jpg, .png or .webp depending on what its site
// served. Resolve the real file once on the server rather than guessing.
function resolveImage(base: string): string | null {
  for (const ext of ["jpg", "png", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", `${base}.${ext}`))) return `${base}.${ext}`;
  }
  return null;
}

export default async function Home() {
  const statuses = await allStatuses();
  const stops: Stop[] = RESTAURANTS.map((r) => ({ ...r, status: statuses[r.slug], imageSrc: resolveImage(r.image) }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SITE.name,
    description: SITE.description,
    itemListElement: RESTAURANTS.map((r, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Restaurant", name: r.name, url: r.site, servesCuisine: r.cuisine, telephone: r.phone || undefined,
        address: { "@type": "PostalAddress", streetAddress: r.address.split(",")[0], addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" } },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero count={stops.length} />
      <PathExplorer stops={stops} />
      <Updates />
    </>
  );
}
