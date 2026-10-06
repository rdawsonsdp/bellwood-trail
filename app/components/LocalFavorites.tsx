import Image from "next/image";
import type { Stop } from "@/app/lib/live-status";

const FEATURES = [
  { slug: "mickeys", label: "THE DRIVE-IN CLASSIC", title: "Mickey’s Drive-In", copy: "A Bellwood tradition since 1959. Start with Chicago-style hot dogs or an Italian beef.", source: "https://mickeysdrivein.com/about/", alt: "Illustration of a Chicago-style hot dog with fries" },
  { slug: "gioacchinos", label: "THE FAMILY TABLE", title: "Gioacchino’s", copy: "Decades of homemade Italian cooking on St. Charles Road. Come hungry for pizza and a neighborhood welcome.", source: "https://www.gioacchinopizza.com/", alt: "Illustration of square-cut thin-crust sausage pizza" },
  { slug: "tastee-rolls", label: "A LOCAL TWIST", title: "Tastee Rolls", copy: "Jerk chicken, Philly steak and other bold flavors, wrapped in a golden egg roll. Find them on Mannheim Road.", source: "https://www.tasteerolls.com/menu-bellwood", alt: "Illustration of crispy egg rolls with a jerk chicken filling" },
];

export function LocalFavorites({ stops }: { stops: Stop[] }) {
  return <section className="local-favorites site-container" id="local-favorites" aria-labelledby="favorites-title">
    <div className="favorites-heading"><div><p className="gateway-eyebrow">A TASTE OF THE NEIGHBORHOOD</p><h2 id="favorites-title">Start with a local favorite.</h2></div><a href="#restaurant-map">Find your next stop ↗</a></div>
    <div className="favorites-grid">{FEATURES.filter(f => stops.some(s => s.slug === f.slug)).map(f => <article className="favorite-card" key={f.slug}>
      <a href={`/map?stop=${f.slug}`} aria-label={`Find ${f.title} on the map`} className="favorite-art"><Image src={`/images/illustrations/${f.slug}.webp`} alt={f.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></a>
      <div className="favorite-copy"><p className="favorite-label">{f.label}</p><h3>{f.title}</h3><p>{f.copy}</p><div className="favorite-links"><a href={`/map?stop=${f.slug}`}>Find on map ↗</a><a href={f.source} target="_blank" rel="noopener noreferrer">Their story & menu</a></div></div>
    </article>)}</div>
    <p className="illustration-note">Food illustrations created with AI, inspired by the restaurants’ menus. Actual dishes and presentation vary.</p>
  </section>;
}
